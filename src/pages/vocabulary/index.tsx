import React, { useState, useRef, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { deleteUserPhrases, getUserPhrases } from "@/services/userService";
import { useRecoilState } from "recoil";
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
  theme,
} from "antd";
import classNames from "classnames";
import styles from "./index.module.less";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import { UserPhrase } from "@/models/userSentence.interface";
import { PageContainer } from "@ant-design/pro-layout";
import { getVocabularyLibraryItems } from "@/services/libraryService";
import { SwapOutlined } from "@ant-design/icons";
import TruncatedText from "./components/TruncatedText/TruncatedText";
import { useSettingsDrawerContext } from "@/contexts/SettingsDrawerContext";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";
import { userState } from "@/stores/user";
import { UserEntity } from "@/models/user";

type DateFilter = "today" | "last week" | "last month" | "all";

const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

const Vocabulary: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [tableWidth, setTableWidth] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [user, setUser] = useRecoilState(userState);
  const [onMobile, setOnMobile] = useState(isMobile());

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
      sourceLanguage: user.sourceLanguage,
      targetLanguage: user.targetLanguage,
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
    refetch();
  }, [user]);

  useEffect(() => {
    const userEntity: UserEntity = {
      sourceLanguage: user.sourceLanguage,
      targetLanguage: user.targetLanguage,
    };
    const fetchOptions = async () => {
      const data = await getVocabularyLibraryItems(userEntity);

      const renderTitle = (title: any) => title;

      const renderItem = (title: string, totalSentences: number) => ({
        value: title, // This is required for the AutoComplete component
        label: <div>{title}</div>,
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
      user.sourceLanguage,
      user.targetLanguage,
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

  const onCheckboxChange = (record: UserPhrase, checked: boolean) => {
    const newSelectedRowKeys = new Set(selectedRowKeys);
    if (checked) {
      newSelectedRowKeys.add(record._id);
    } else {
      newSelectedRowKeys.delete(record._id);
    }
    setSelectedRowKeys([...newSelectedRowKeys]);
  };

  const columns = useMemo(() => {
    if (onMobile) {
      return [
        {
          title: "Phrase",
          dataIndex: "sourceText",
          key: "sourceText",
          render: (text: string, row: any) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
        },
        {
          title: "Translation",
          dataIndex: "targetText",
          key: "targetText",
          render: (text: string, row: any) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
        },
      ];
    } else {
      return [
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
          title: "Sentence",
          dataIndex: "sentenceText",
          key: "sentenceText",
          render: (text: string, row: any) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
        },
        {
          title: "Sentence Translation",
          dataIndex: "sentenceTextTranslation",
          key: "sentenceTextTranslation",
          render: (text: string, row: any) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
        },
        {
          title: "Phrase",
          dataIndex: "sourceText",
          key: "sourceText",
          render: (text: string, row: any) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
        },
        {
          title: "Translation",
          dataIndex: "targetText",
          key: "targetText",
          render: (text: string, row: any) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
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
          render: (text: string) => (
            <TruncatedText text={text} maxTextLength={30} />
          ),
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
      ];
    }
  }, [selectedRowKeys, isFetching, options, onMobile]);

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

  const handleSwapLanguages = async () => {
    const previousSourceLanguage = user.sourceLanguage;

    setUser((prevUser) => ({
      ...prevUser,
      sourceLanguage: user.targetLanguage,
      targetLanguage: previousSourceLanguage,
    }));
  };

  const { toggleSettingsDrawer, settingsDrawerVisible } =
    useSettingsDrawerContext();

  const renderSettingsDrawerContent = () => {
    return (
      <>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "20px" }}
        >
          <Col
            xs={20}
            sm={20}
            md={16}
            lg={8}
            xl={8}
            xxl={8}
            style={{ marginTop: "30px" }}
          >
            <Row gutter={[16, 16]} justify="center">
              <Col span={10}>
                <LanguageSelector
                  useRecoil={true}
                  languageProp="sourceLanguage"
                  disabledLanguage={user.targetLanguage}
                  text={"Translate from: "}
                />
              </Col>
              <Col
                span={4}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <SwapOutlined
                  style={{ fontSize: "42px" }}
                  onClick={handleSwapLanguages}
                />
              </Col>
              <Col span={10}>
                <LanguageSelector
                  useRecoil={true}
                  languageProp="targetLanguage"
                  disabledLanguage={user.sourceLanguage}
                  text={"Translate to: "}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <PageContainer loading={loading} title={false}>
      {renderSettingsDrawerContent()}

      <Row
        gutter={[24, 24]}
        justify="center"
        align="bottom"
        style={{ marginBottom: "26px", marginTop: "26px" }}
      >
        <Col span={20}>
          <Row justify="space-between">
            <Space>
              <Select
                value="Actions"
                placeholder="Actions"
                onSelect={async (value: string) => {
                  if (value === "delete") {
                    const selectedIds = selectedRowKeys.map((key) =>
                      key.toString()
                    );
                    await deleteUserPhrases(selectedIds);
                    setSelectedRowKeys([]);
                    refetch();
                  }
                }}
                style={{ width: 120 }}
                disabled={selectedRowKeys.length === 0}
              >
                <Select.Option value="delete">Delete</Select.Option>
              </Select>
            </Space>
            <Space>
              <Radio.Group
                onChange={handleDateChange}
                value={dateFilter}
                buttonStyle="solid"
              >
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
