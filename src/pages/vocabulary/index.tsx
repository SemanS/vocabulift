import { Card } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Input } from "antd";
import { getUserSentences } from "@/services/userService";
import {
  UserPhrase,
  UserSentence,
  UserWord,
} from "@/models/userSentence.interface";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { useRecoilState } from "recoil";
import { Table } from "antd";
import { PageContainer } from "@ant-design/pro-layout";

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
      title: "Library ID",
      dataIndex: "libraryId",
      key: "libraryId",
    },
    {
      title: "Sentence No.",
      dataIndex: "sentenceNo",
      key: "sentenceNo",
    },
    {
      title: "Source Language",
      dataIndex: "sourceLanguage",
      key: "sourceLanguage",
    },
    {
      title: "Target Language",
      dataIndex: "targetLanguage",
      key: "targetLanguage",
    },
    {
      title: "Words",
      dataIndex: "words",
      key: "words",
      render: (words: UserWord[]) =>
        words.map((word) => word.sourceText).join(", "),
    },
    {
      title: "Phrases",
      dataIndex: "phrases",
      key: "phrases",
      render: (phrases: UserPhrase[]) =>
        phrases.map((phrase) => phrase.sourceText).join(", "),
    },
  ];

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
          dataSource={userSentences}
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
