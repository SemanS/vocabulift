import React, { useState, useRef, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPhrases } from "@/services/userService";
import { useRecoilState } from "recoil";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { Table, Typography, theme } from "antd";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { UserPhrase } from "@/models/userSentence.interface";
import styles from "./index.module.less";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";

type DateFilter = "today" | "last week" | "last month" | "all";

const Vocabulary: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceLanguage] = useRecoilState(sourceLanguageState);
  const [targetLanguage] = useRecoilState(targetLanguageState);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [tableWidth, setTableWidth] = useState(0);

  const fetchSize = 5;
  const scroll = { y: 300, x: "100vw" };

  const fetchPhrases = async ({ pageParam = 0 }) => {
    const {
      results: phrasesData,
      countOfPhrases: totalCount,
      nextCursor: nextCursor,
    } = await getUserPhrases({
      nextCursor: pageParam,
      countOfPhrases: fetchSize,
      sourceLanguage,
      targetLanguage,
      dateFilter,
    });

    return { phrasesData, totalCount, nextCursor };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["phrases", sourceLanguage, targetLanguage, dateFilter],
    queryFn: fetchPhrases,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo(
    () => [
      { title: "Title", dataIndex: "sentenceNo", key: "sentenceNo" },
      {
        title: "Text",
        dataIndex: "sentenceText",
        key: "sentenceText",
        width: 200,
      },
      {
        title: "SourceText",
        dataIndex: "sourceText",
        key: "sourceText",
      },
      {
        title: "TargetText",
        dataIndex: "targetText",
        key: "targetText",
      },
    ],
    []
  );

  const dataSource = useMemo(
    () => data?.pages.flatMap((page) => page.phrasesData) || [],
    [data]
  );

  const mergedColumns = useMemo(
    () =>
      columns.map((column: any) => {
        if (column.width) {
          return column;
        }
        return {
          ...column,
          width: Math.floor(
            tableWidth / columns.filter(({ width }) => !width).length
          ),
        };
      }),
    [columns, tableWidth]
  );

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  const { token } = theme.useToken();

  useEffect(() => {
    resetVirtualGrid();
    fetchNextPage();
  }, [dateFilter, tableWidth]);

  const renderVirtualList = useMemo(
    () =>
      (rawData: readonly object[], { scrollbarSize, ref, onScroll }: any) => {
        ref.current = connectObject;
        const totalHeight = rawData.length * 54;
        return (
          <Grid
            ref={gridRef}
            className={styles.virtualGrid}
            columnCount={mergedColumns.length}
            columnWidth={(index: number) => {
              const { width } = mergedColumns[index];
              return totalHeight > (scroll?.y as number) &&
                index === mergedColumns.length - 1
                ? (width as number) - scrollbarSize - 1
                : (width as number);
            }}
            height={scroll!.y as number}
            rowCount={rawData.length}
            rowHeight={() => 54}
            width={tableWidth}
            onScroll={({ scrollLeft, scrollTop }) => {
              onScroll({ scrollLeft });
              const isScrolledToBottom = scrollTop + scroll.y >= totalHeight;
              if (isScrolledToBottom) {
                fetchNextPage();
              }
            }}
          >
            {({
              columnIndex,
              rowIndex,
              style,
            }: {
              columnIndex: number;
              rowIndex: number;
              style: React.CSSProperties;
            }) => (
              <div
                className={classNames("virtual-table-cell", {
                  "virtual-table-cell-last":
                    columnIndex === mergedColumns.length - 1,
                })}
                style={{
                  ...style,
                  boxSizing: "border-box",
                  padding: token.padding,
                  borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
                  background: token.colorBgContainer,
                }}
              >
                {
                  (rawData[rowIndex] as any)[
                    (mergedColumns as any)[columnIndex].dataIndex
                  ]
                }
              </div>
            )}
          </Grid>
        );
      },
    [mergedColumns, tableWidth, scroll]
  );

  return (
    <>
      <div>
        <button onClick={() => setDateFilter("today")}>Today</button>
        <button onClick={() => setDateFilter("last week")}>Last Week</button>
        <button onClick={() => setDateFilter("last month")}>Last Month</button>
        <button onClick={() => setDateFilter("all")}>All</button>
        <button onClick={() => fetchNextPage()}>asd</button>
      </div>
      <ResizeObserver
        onResize={({ width }) => {
          setTableWidth(width);
        }}
      >
        <Table
          columns={mergedColumns}
          scroll={scroll}
          className={styles.virtualTable}
          dataSource={dataSource}
          pagination={false}
          components={{
            body: renderVirtualList,
          }}
        />
      </ResizeObserver>
    </>
  );
};

export default Vocabulary;
