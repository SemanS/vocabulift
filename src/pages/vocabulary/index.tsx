import React, { useState, useRef, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { deleteUserPhrases, getUserPhrases } from "@/services/userService";
import { useRecoilState } from "recoil";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import {
  AutoComplete,
  Checkbox,
  Col,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  theme,
} from "antd";
import classNames from "classnames";
import styles from "./index.module.less";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import { UserPhrase } from "@/models/userSentence.interface";
import { PageContainer } from "@ant-design/pro-layout";
import { getLibraryItems } from "@/services/libraryService";
import { DownOutlined } from "@ant-design/icons";

type DateFilter = "today" | "last week" | "last month" | "all";

const Vocabulary: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceLanguage] = useRecoilState(sourceLanguageState);
  const [targetLanguage] = useRecoilState(targetLanguageState);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [tableWidth, setTableWidth] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const fetchSize = 50;
  const scroll = { y: 800, x: "100vw" };

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
      orderBy: "createdAt",
      filterBy: {
        title: selectedTitle,
      },
    });
    return { phrasesData, totalCount, nextCursor };
  };

  interface DataItem {
    id: string;
    title: string;
    label: string;
    image: string;
    description: string;
    totalSentences: number;
  }

  useEffect(() => {
    const fetchOptions = async () => {
      const data = await getLibraryItems(
        sessionStorage.getItem("access_token")
      );

      const renderTitle = (title: any) => title;

      const renderItem = (title: string, totalSentences: number) => ({
        value: title, // This is required for the AutoComplete component
        label: (
          <div>
            {title}
            {/* <span style={{ float: "right" }}>{totalSentences}</span> */}
          </div>
        ),
      });

      const groupByLabel = (data: DataItem[]) => {
        return data.reduce((acc: any, item: any) => {
          if (!acc[item.label]) {
            acc[item.label] = [];
          }
          acc[item.label].push(item);
          return acc;
        }, {});
      };

      const formatData = (data: DataItem[]) => {
        const groupedData = groupByLabel(data);

        return Object.entries(groupedData).map(([label, items]) => ({
          label: renderTitle(label),
          options: (items as DataItem[]).map((item) =>
            renderItem(item.title, item.totalSentences)
          ),
        }));
      };

      const options = formatData(data);

      setOptions(options);
    };

    fetchOptions();
  }, [tableWidth]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "phrases",
      sourceLanguage,
      targetLanguage,
      dateFilter,
      selectedTitle,
      tableWidth,
    ],
    queryFn: fetchPhrases,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const dataSource = useMemo(
    () => data?.pages.flatMap((page) => page.phrasesData) || [],
    [data, selectedTitle, tableWidth]
  );
  const maxTextLength = 30; // Set the maximum length for text truncation

  const truncateText = (content: JSX.Element, text: string) => {
    if (text.length > maxTextLength) {
      const truncatedText = text.slice(0, maxTextLength - 1) + "...";
      const truncatedContent = (
        <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
          {truncatedText.split(" ").map((word, index) => (
            <span key={index}>
              {word}
              &nbsp;
            </span>
          ))}
        </div>
      );

      return (
        <Tooltip
          title={text}
          overlayInnerStyle={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
            fontSize: "16px",
          }}
        >
          <span className={styles.truncate}>{truncatedContent}</span>
        </Tooltip>
      );
    } else {
      return <span className={styles.truncate}>{content}</span>;
    }
  };

  const onCheckboxChange = (record: UserPhrase, checked: boolean) => {
    const newSelectedRowKeys = new Set(selectedRowKeys);
    if (checked) {
      newSelectedRowKeys.add(record._id);
    } else {
      newSelectedRowKeys.delete(record._id);
    }
    setSelectedRowKeys([...newSelectedRowKeys]);
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <Checkbox
            // Add this condition to check if selectedRowKeys is not empty
            checked={
              !isFetching &&
              selectedRowKeys.length > 0 &&
              selectedRowKeys.length === dataSource.length
            }
            indeterminate={
              selectedRowKeys.length > 0 &&
              selectedRowKeys.length < dataSource.length
            }
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked) {
                setSelectedRowKeys(dataSource.map((record) => record._id));
              } else {
                setSelectedRowKeys([]);
              }
            }}
          />
        ),
        dataIndex: "selection",
        key: "selection",
        render: (_: any, record: UserPhrase) => (
          <Checkbox
            checked={selectedRowKeys.includes(record._id)}
            onChange={(e) => onCheckboxChange(record, e.target.checked)}
          />
        ),
        width: 60,
      },
      {
        title: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Title</span>
            <AutoComplete
              className={styles.customAutocomplete}
              style={{ width: "200px", marginLeft: "8px" }}
              options={options}
              placeholder="Search title"
              dropdownStyle={{ minWidth: "300px" }} // Add this line to set a fixed width
              value={selectedTitle}
              onChange={(value) => setSelectedTitle(value)}
            />
          </div>
        ),
        dataIndex: "libraryTitle",
        key: "libraryTitle",
        render: (text: string) => {
          const content = (
            <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
              {text.split(" ").map((word, index) => (
                <span key={index}>
                  {word}
                  &nbsp;
                </span>
              ))}
            </div>
          );

          return truncateText(content, text);
        },
      },
      {
        title: "Text",
        dataIndex: "sentenceText",
        key: "sentenceText",
        render: (text: string, row: any) => {
          const content = (
            <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
              {text.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={
                    isWordInSentenceText(word, row.sourceText)
                      ? styles.bubbleHovered
                      : ""
                  }
                >
                  {word}
                  &nbsp;
                </span>
              ))}
            </div>
          );

          return truncateText(content, text);
        },
      },
      {
        title: "Phrase",
        dataIndex: "sourceText",
        key: "sourceText",
      },
      {
        title: "TargetText",
        dataIndex: "targetText",
        key: "targetText",
      },
      {
        title: "Date added",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => {
          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);

          const createdAt = new Date(date);
          const createdAtDate = new Date(
            createdAt.getFullYear(),
            createdAt.getMonth(),
            createdAt.getDate()
          );

          if (createdAtDate.getTime() === today.getTime()) {
            return <span>Today</span>;
          } else if (createdAtDate > lastWeek) {
            return <span>Last week</span>;
          } else if (createdAtDate > lastMonth) {
            return <span>Last month</span>;
          } else {
            const formattedDate = createdAt.toLocaleDateString();
            return <span>{formattedDate}</span>;
          }
        },
      },
    ],
    [selectedRowKeys, isFetching, options]
  );

  const handleDateChange = (e: RadioChangeEvent) => {
    setDateFilter(e.target.value);
  };

  const isWordInSentenceText = (word: string, sentenceText: string) => {
    return sentenceText.split(" ").includes(word);
  };

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
  }, [dateFilter, tableWidth]);

  const renderVirtualList = useMemo(
    () =>
      (rawData: readonly object[], { scrollbarSize, ref, onScroll }: any) => {
        ref.current = connectObject;
        const totalHeight = rawData.length * 70;
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
            rowHeight={() => 70}
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
            }) => {
              const column = mergedColumns[columnIndex];
              const dataIndex = column.dataIndex;
              const cellData = (rawData[rowIndex] as any)[dataIndex];
              const render = column.render;

              const cellContent = render
                ? render(cellData, rawData[rowIndex])
                : cellData;

              return (
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
                  {cellContent}
                </div>
              );
            }}
          </Grid>
        );
      },
    [mergedColumns, tableWidth, scroll]
  );

  return (
    <PageContainer loading={loading} title={false}>
      <Row gutter={[24, 24]} justify="center" align="bottom">
        <Col span={20}>
          <Row justify="start">
            <Space>
              <Select
                value="Actions"
                placeholder="Actions"
                onSelect={async (value: string) => {
                  if (value === "delete") {
                    // Convert selectedRowKeys to string[]
                    const selectedIds = selectedRowKeys.map((key) =>
                      key.toString()
                    );
                    await deleteUserPhrases(selectedIds);
                    // Clear selected row keys and refresh table data
                    setSelectedRowKeys([]);
                    // Call the method to fetch data again and update the table
                    refetch(); // Add this line
                  }
                }}
                style={{ width: 120 }}
                disabled={selectedRowKeys.length === 0}
              >
                <Select.Option value="delete">Delete</Select.Option>
              </Select>
            </Space>
          </Row>
          <Row justify="end">
            <Space>
              <Radio.Group onChange={handleDateChange} value={dateFilter}>
                <Radio.Button value="today">Today</Radio.Button>
                <Radio.Button value="last week">Last Week</Radio.Button>
                <Radio.Button value="last month">Last Month</Radio.Button>
                <Radio.Button value="all">All</Radio.Button>
              </Radio.Group>
            </Space>
          </Row>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="center" align="middle">
        <Col span={20}>
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
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Vocabulary;
