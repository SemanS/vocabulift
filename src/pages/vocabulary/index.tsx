import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card, Col, Input, Radio, Row, Table } from "antd";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getUserSentences } from "@/services/userService";
import { UserPhrase, UserSentence } from "@/models/userSentence.interface";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { PageContainer } from "@ant-design/pro-layout";
import styles from "./index.module.less";
import { PaginationConfig } from "antd/lib/pagination";

const { Search } = Input;

const Vocabulary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [userSentences, setUserSentences] = useState<UserSentence[]>([]);
  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [dateFilter, setDateFilter] = useState<
    "today" | "last week" | "last month" | "all"
  >("all");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | undefined>(
    "descend"
  );

  const handleDateFilterChange = useCallback((value: any) => {
    setDateFilter(value);
    setSentenceFrom(1);
    setUserSentences([]); // Clear the userSentences state
    setHasMore(true); // Reset the hasMore state
    fetchDataAndUpdateState(value); // Pass the dateFilter value to fetchDataAndUpdateState
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  // Add a new useRef for the sentinel (the last element in the list)
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchDataAndUpdateState();
  }, [dateFilter]);

  useEffect(() => {
    // Create a new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore) {
          fetchDataAndUpdateState(dateFilter, sentenceFrom);
        }
      },
      { threshold: 1 }
    );

    const currentObserver = observer.current;
    const currentSentinel = sentinelRef.current;

    if (currentSentinel) {
      currentObserver.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        currentObserver.unobserve(currentSentinel);
      }
    };
  }, [dateFilter, hasMore, sentenceFrom]);

  // Update fetchDataAndUpdateState function to receive nextSentenceFrom
  const fetchDataAndUpdateState = async (
    dateFilter: "today" | "last week" | "last month" | "all" = "all",
    nextSentenceFrom: number = sentenceFrom
  ) => {
    setLoading(true);

    const { results: userSentencesData, countOfSentences: totalCount } =
      await getUserSentences({
        sentenceFrom: nextSentenceFrom,
        countOfSentences,
        sourceLanguage,
        targetLanguage,
        dateFilter,
      });

    if (
      userSentencesData.length === 0 ||
      nextSentenceFrom + userSentencesData.length >= totalCount
    ) {
      setHasMore(false);
    } else {
      setSentenceFrom(nextSentenceFrom + countOfSentences);
    }

    // Only update the state with unique sentences
    setUserSentences((prevUserSentences) => {
      // Create a new Set from the existing and new fetched sentences
      const uniqueUserSentences = new Set([
        ...prevUserSentences,
        ...userSentencesData,
      ]);

      // Convert the Set back to an array and return it
      return Array.from(uniqueUserSentences);
    });
  };

  const isWordInPhrases = (word: string, phrases: UserPhrase[]) => {
    return phrases.some(
      (phrase) =>
        phrase.sourceText.split(" ").includes(word) ||
        phrase.targetText.split(" ").includes(word)
    );
  };

  const renderLink = (content: any, row: any) => (
    <Link
      style={{ textDecoration: "none", color: "black" }}
      to={`/library/${row.libraryId}?currentPage=${row.currentPage}&pageSize=${row.sentencesPerPage}`}
    >
      {content}
    </Link>
  );

  const renderPhraseColumns = (
    sourceText: string,
    targetText: string,
    row: any
  ) => (
    <>
      {renderLink(sourceText, row)}
      <br />
      {renderLink(targetText, row)}
    </>
  );

  const renderColumn = (text: string, row: any, type: string) => {
    switch (type) {
      case "sentenceText":
        return (
          <>
            {text.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  isWordInPhrases(word, row.phrases) ? styles.bubbleHovered : ""
                }
              >
                {word}
                &nbsp;
              </span>
            ))}
          </>
        );
      default:
        return text;
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Text", dataIndex: "sentenceText", key: "sentenceText" },
    { title: "Phrases", key: "phrases" },
    // ...remaining columns
  ].reduce((acc: any[], column) => {
    const { dataIndex, ...otherProps } = column;
    const render = (text: string, row: any) => {
      if (dataIndex === "sentenceText") {
        return renderLink(renderColumn(text, row, dataIndex), row);
      }
      if (column.key === "phrases") {
        return renderPhraseColumns(row.sourceText, row.targetText, row);
      }
      return renderLink(text, row);
    };

    return [
      ...acc,
      {
        ...otherProps,
        dataIndex,
        render,
      },
    ];
  }, []);

  const flattenedSentences = useMemo(() => {
    return userSentences.reduce((acc: UserPhrase[], sentence: UserSentence) => {
      return acc.concat(
        sentence.phrases.map((phrase) => ({
          ...phrase,
          libraryId: sentence.libraryId,
          title: sentence.title,
          sentenceText: sentence.sentenceText,
          phrases: sentence.phrases,
          currentPage: sentence.currentPage,
          sentencesPerPage: sentence.sentencesPerPage,
          createdAt: sentence.createdAt,
          phraseCreatedAt: phrase.createdAt,
        }))
      );
    }, []);
  }, [userSentences]);

  return (
    <PageContainer loading={loading} title={false}>
      <Row justify="center">
        <Col span={16}>
          {userSentences.length}
          {flattenedSentences.length}
          <Card
            className={styles.cardCentered}
            style={{ marginBottom: "20px" }}
            /* extra={
              <Radio.Group
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="today">Today</Radio.Button>
                <Radio.Button value="last week">Last week</Radio.Button>
                <Radio.Button value="last month">Last month</Radio.Button>
              </Radio.Group>
            } */
          >
            <div
              id="scrollableDiv"
              ref={scrollableDivRef}
              style={{ height: 400, overflow: "auto" }}
            >
              <Table
                columns={columns}
                dataSource={flattenedSentences}
                rowKey={(record) =>
                  `${record.sourceText}-${record.targetText}-${record.createdAt}`
                }
                pagination={false}
              />
              {/* Add sentinel */}
              <div
                ref={sentinelRef}
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "transparent",
                }}
              ></div>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Vocabulary;
