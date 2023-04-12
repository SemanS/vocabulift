import React, { useEffect } from "react";
import { Card } from "antd";
import { useState } from "react";
import { Input } from "antd";
import { getUserSentences } from "@/services/userService";
import { UserPhrase, UserSentence } from "@/models/userSentence.interface";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { useRecoilState } from "recoil";
import { Table } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import styles from "./index.module.less";
import { Link } from "react-router-dom";

const { Search } = Input;

const Vocabulary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [userSentences, setUserSentences] = useState<UserSentence[]>([]);
  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);

  useEffect(() => {
    fetchDataAndUpdateState(sentenceFrom, 1);
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, row: any) => (
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/library/${row.libraryId}?currentPage=${row.currentPage}&pageSize=${row.sentencesPerPage}`}
        >
          {title}
        </Link>
      ),
    },
    {
      title: "Text",
      dataIndex: "sentenceText",
      key: "sentenceText",
      render: (text: string, row: any) => {
        return (
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to={`/library/${row.libraryId}?currentPage=${row.currentPage}&pageSize=${row.sentencesPerPage}`}
          >
            <>
              {text.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={
                    isWordInPhrases(word, row.phrases)
                      ? styles.bubbleHovered
                      : ""
                  }
                >
                  {word}
                  &nbsp;
                </span>
              ))}
            </>
          </Link>
        );
      },
    },
    {
      title: "Phrases",
      dataIndex: "sourceText",
      key: "sourceText",
      render: (sourceText: string, row: any) => (
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/library/${row.libraryId}?currentPage=${row.currentPage}&pageSize=${row.sentencesPerPage}`}
        >
          {sourceText}
        </Link>
      ),
    },
    {
      title: "Phrases",
      dataIndex: "targetText",
      key: "targetText",
      render: (targetText: string, row: any) => (
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/library/${row.libraryId}?currentPage=${row.currentPage}&pageSize=${row.sentencesPerPage}`}
        >
          {targetText}
        </Link>
      ),
    },
  ];

  const flattenedSentences = userSentences.reduce(
    (acc: UserPhrase[], sentence: UserSentence) => {
      return acc.concat(
        sentence.phrases.map((phrase) => ({
          ...phrase,
          libraryId: sentence.libraryId,
          title: sentence.title,
          sentenceText: sentence.sentenceText,
          phrases: sentence.phrases,
          currentPage: sentence.currentPage,
          sentencesPerPage: sentence.sentencesPerPage,
        }))
      );
    },
    []
  );

  const fetchDataAndUpdateState = async (
    localSentenceFrom: number,
    pageNumber: number
  ) => {
    const userSentencesData: UserSentence[] = await getUserSentences(
      sentenceFrom,
      countOfSentences,
      localSentenceFrom,
      sourceLanguage,
      targetLanguage,
      "sentenceNo"
    );

    setUserSentences(userSentencesData);
    setLoading(false);
  };

  const isWordInPhrases = (word: string, phrases: UserPhrase[]) => {
    return phrases.some(
      (phrase) =>
        phrase.sourceText.split(" ").includes(word) ||
        phrase.targetText.split(" ").includes(word)
    );
  };

  return (
    <PageContainer loading={loading} title={false}>
      {/*  <Search
        style={{ marginBottom: "20px" }}
        placeholder="input search text"
        enterButton="Search"
        size="large"
        loading={loading}
        onSearch={(value) => console.log(value)}
      /> */}
      <Card
        style={{
          marginBottom: "20px",
        }}
      >
        <Table
          columns={columns}
          dataSource={flattenedSentences}
          rowKey="libraryId"
          pagination={{
            current: 1,
            pageSize: countOfSentences,
            total: totalItems,
            onChange: (page) => {
              setLoading(true);
              fetchDataAndUpdateState(sentenceFrom, page);
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default Vocabulary;
