import React, { FC, useState, useEffect } from "react";
import { Card, Row, Col, PaginationProps, Switch, Space } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { WordData } from "@/models/word.interface";
import TranslateBox from "./components/TranslateBox/TranslateBox";
import WordDefinitionCard from "./components/WordDefinitionCard/WordDefinitionCard";
import LanguageSelect from "./components/LanguageSelect/LanguageSelect";
import PaginationControls from "./components/PaginationControls/PaginationControls";
import VocabularyList from "./components/VocabularyList/VocabularyList";
import { FetchDataResponse } from "@models/services.interfaces";
import { getRangeNumber } from "@/utils/stringUtils";
import { addWordToUser } from "@/services/bookService";

const BookDetail: FC = () => {
  const [clickedWord, setClickedWord] = useState<string>();
  const [clickedWords, setClickedWords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [totalSentences, setTotalSentences] = useState(0);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [texts_en, setTextsEn] = useState<
    { text: string; sentence_no: number }[]
  >([]);
  const [texts_cz, setTextsCz] = useState<
    { text: string; sentence_no: number }[]
  >([]);
  const [texts_sk, setTextsSk] = useState<
    { text: string; sentence_no: number }[]
  >([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);
  const [mode, setMode] = useState<"word" | "sentence">("word");
  const [wordData, setWordData] = useState<WordData>();
  const [user, setUser] = useRecoilState(userState);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("sk");
  const [pageSizeChanged, setPageSizeChanged] = useState(false);

  const { title } = useParams();

  const fetchData = async (localSentenceFrom: number) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/sentence/${title}?sentenceFrom=${
        localSentenceFrom ? localSentenceFrom : sentenceFrom
      }&countOfSentences=${countOfSentences}`,
      {
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    setLoading(true);
    fetchDataAndUpdateState(sentenceFrom);
  }, [sentenceFrom]);

  const handlePageSizeLimitReached = () => {
    setLimitReached(true);
    // Set a flag or perform any other action you want
  };

  useEffect(() => {
    if (
      sentenceFrom + countOfSentences < currentPage * sentencesPerPage ||
      currentPage * sentencesPerPage > sentenceFrom + countOfSentences ||
      currentPage * sentencesPerPage < sentenceFrom
    ) {
      let localSentenceFrom = (currentPage - 1) * sentencesPerPage + 1;
      setSentenceFrom(getRangeNumber(localSentenceFrom));
    }
  }, [currentPage, sentencesPerPage]);

  useEffect(() => {
    if (sentenceFrom === 1) {
      fetchDataAndUpdateState(sentenceFrom);
    }
  }, []);

  useEffect(() => {
    if (clickedWord) {
      // Fetch word details from public API
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clickedWord}`)
        .then((response) => response.json())
        .then((data) => setWordData(data[0]))
        .catch((error) => console.error(error));
      // Make POST on backend to save word under user
      addWordToUser(clickedWord, sessionStorage.getItem("access_token")).catch(
        (error) => console.error(error)
      );
    }
  }, [clickedWord]);

  const fetchDataAndUpdateState = async (localSentenceFrom: number) => {
    const data: FetchDataResponse = await fetchData(localSentenceFrom);

    await updateState(data);
    setLoading(false);
  };

  const updateState = async (data: FetchDataResponse) => {
    setTextsEn((prev) =>
      data.sentences.map(({ content_en, sentence_no }) => ({
        text: content_en,
        sentence_no,
      }))
    );
    setTextsCz((prev) =>
      data.sentences.map(({ content_cz, sentence_no }) => ({
        text: content_cz,
        sentence_no,
      }))
    );
    setTextsSk((prev) =>
      data.sentences.map(({ content_sk, sentence_no }) => ({
        text: content_sk,
        sentence_no,
      }))
    );
    setTotalSentences(data.totalSentences);
  };

  const handleClickedWord = async (word: string) => {
    if (!clickedWords.includes(word) && mode == "word") {
      setClickedWords([...clickedWords, word]);
      setClickedWord(word);
    }
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = async (
    current,
    pageSize
  ) => {
    // Calculate the new current page based on the new page size
    const newCurrentPage =
      Math.floor(((current - 1) * sentencesPerPage) / pageSize) + 1;
    setSentencesPerPage(pageSize);
    await handlePageChange(newCurrentPage, pageSize);
  };

  const handlePageChange = async (page: number, pageSize: number) => {
    setCurrentTextIndex((page - 1) * (pageSize || sentencesPerPage));
    setCurrentPage(page);
  };

  const handleSourceLanguageChange = async (
    value: React.SetStateAction<string>
  ) => {
    setSourceLanguage(value);
  };

  const handleTargetLanguageChange = async (
    value: React.SetStateAction<string>
  ) => {
    setTargetLanguage(value);
  };

  return (
    <PageContainer loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={clickedWords.length == 0 ? 24 : 18}>
          <Card>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: "16px" }}
            >
              <Col>
                <Switch
                  checked={mode === "sentence"}
                  onChange={() =>
                    setMode(mode === "word" ? "sentence" : "word")
                  }
                />
                Translate by word or sentence
              </Col>
              <Col>
                <Space>
                  <LanguageSelect
                    defaultValue="en"
                    onChange={handleSourceLanguageChange}
                    disabledValue={targetLanguage}
                    options={[
                      { label: "English", value: "en" },
                      { label: "Czech", value: "cz" },
                      { label: "Slovak", value: "sk" },
                    ]}
                  />
                  <LanguageSelect
                    defaultValue="sk"
                    onChange={handleTargetLanguageChange}
                    disabledValue={sourceLanguage}
                    options={[
                      { label: "Slovak", value: "sk" },
                      { label: "Czech", value: "cz" },
                      { label: "English", value: "en" },
                    ]}
                  />
                </Space>
              </Col>
            </Row>
            <TranslateBox
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              currentTextIndex={currentTextIndex}
              sentenceFrom={sentenceFrom}
              sentencesPerPage={sentencesPerPage}
              mode={mode}
              texts_en={texts_en}
              texts_cz={texts_cz}
              texts_sk={texts_sk}
              onClick={handleClickedWord}
            />
            <PaginationControls
              currentPage={currentPage}
              onShowSizeChange={onShowSizeChange}
              handlePageChange={handlePageChange}
              totalSentences={totalSentences}
              sentencesPerPage={sentencesPerPage}
              pageSizeLimitReached={handlePageSizeLimitReached}
            />
          </Card>
        </Col>
        {clickedWords.length != 0 && (
          <>
            <Col span={6}>
              <VocabularyList clickedWords={clickedWords} />
            </Col>
            <Col span={18}>
              <WordDefinitionCard wordData={wordData} />
            </Col>
          </>
        )}
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
