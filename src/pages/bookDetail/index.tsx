import React, { FC, useState, useEffect } from "react";
import { Card, Row, Col, Switch, Space, PaginationProps } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import TranslateBox from "./components/TranslateBox/TranslateBox";
import WordDefinitionCard from "./components/WordDefinitionCard/WordDefinitionCard";
import LanguageSelect from "./components/LanguageSelect/LanguageSelect";
import PaginationControls from "./components/PaginationControls/PaginationControls";
import VocabularyList from "./components/VocabularyList/VocabularyList";
import { FetchDataResponse } from "@/models/services.interfaces";
import { getRangeNumber } from "@/utils/stringUtils";
import { addWordToUser, updateBookState } from "@/services/bookService";
import { getSentences, getUserSentences } from "@/services/userService";
import { UserSentence, UserWord } from "@/models/userSentence.interface";
import { getAllUserWords } from "@/utils/getAllUserWords";

const BookDetail: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageSizeFromQuery = parseInt(queryParams.get("pageSize") as string);
  const currentPageFromQuery = parseInt(
    queryParams.get("currentPage") as string
  );

  const [clickedWord, setClickedWord] = useState<string>();
  const [clickedWords, setClickedWords] = useState<UserWord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalSentences, setTotalSentences] = useState(0);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [texts, setTexts] = useState<{
    en: { text: string; sentence_no: number }[];
    cz: { text: string; sentence_no: number }[];
    sk: { text: string; sentence_no: number }[];
  }>({
    en: [],
    cz: [],
    sk: [],
  });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);
  const [userSentences, setUserSentences] = useState<UserSentence[]>([]);
  const [mode, setMode] = useState<"word" | "sentence">("word");
  const [wordData, setWordData] = useState<any>();
  const [user, setUser] = useRecoilState(userState);
  const [sourceLanguage, setSourceLanguage] = useState<"en" | "sk" | "cz">(
    "en"
  );
  const [targetLanguage, setTargetLanguage] = useState<"en" | "sk" | "cz">(
    "sk"
  );

  useEffect(() => {
    const fetchData = async () => {
      let localSentenceFrom =
        (currentPageFromQuery - 1) * pageSizeFromQuery + 1;
      setSentenceFrom(getRangeNumber(localSentenceFrom));
      await fetchDataAndUpdateState(localSentenceFrom);
    };

    if (currentPageFromQuery && pageSizeFromQuery) {
      fetchData();
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
      sourceLanguage &&
        targetLanguage &&
        addWordToUser(
          clickedWord,
          sourceLanguage,
          targetLanguage,
          sessionStorage.getItem("access_token")
        );
    }
  }, [clickedWord]);

  const fetchDataAndUpdateState = async (localSentenceFrom: number) => {
    const sentencesData: FetchDataResponse = await getSentences(
      id,
      sentenceFrom,
      countOfSentences,
      localSentenceFrom
    );
    const userSentencesData: UserSentence[] = await getUserSentences(
      id,
      sentenceFrom,
      countOfSentences,
      localSentenceFrom,
      sourceLanguage,
      targetLanguage
    );

    await updateSentencesState(userSentencesData, sentencesData);
    setLoading(false);
  };

  const updateSentencesState = async (
    userSentencesData: UserSentence[],
    sentencesData: FetchDataResponse
  ) => {
    setTexts({
      en: sentencesData.sentences.map(({ content_en, sentence_no }) => ({
        text: content_en,
        sentence_no,
      })),
      cz: sentencesData.sentences.map(({ content_cz, sentence_no }) => ({
        text: content_cz,
        sentence_no,
      })),
      sk: sentencesData.sentences.map(({ content_sk, sentence_no }) => ({
        text: content_sk,
        sentence_no,
      })),
    });
    setTotalSentences(sentencesData.totalSentences);
    setUserSentences(userSentencesData);
  };

  const handleClickedWord = async (word: string) => {
    /* if (!clickedWords.includes(word) && mode == "word") {
      setClickedWords([...clickedWords, word]);
      setClickedWord(word);
    } */
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
    // Update the URL parameters
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set("currentPage", page.toString());
    newQueryParams.set("pageSize", pageSize.toString());

    // Navigate to the new state
    navigate({
      pathname: location.pathname,
      search: newQueryParams.toString(),
    });

    // Save the book state in local storage
    const bookState = {
      page: page,
      pageSize: pageSize,
    };
    localStorage.setItem(`bookState-${id}`, JSON.stringify(bookState));

    await updateBookState(id, page, pageSize);

    let localSentenceFrom = (page - 1) * pageSize + 1;
    setSentenceFrom(getRangeNumber(localSentenceFrom));
    await fetchDataAndUpdateState(localSentenceFrom);

    setCurrentTextIndex((page - 1) * (pageSize || sentencesPerPage));
    setCurrentPage(page);
  };

  return (
    <PageContainer loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={userSentences.length === 0 ? 24 : 18}>
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
                    onChange={setSourceLanguage}
                    disabledValue={targetLanguage}
                    options={[
                      { label: "English", value: "en" },
                      { label: "Czech", value: "cz" },
                      { label: "Slovak", value: "sk" },
                    ]}
                  />
                  <LanguageSelect
                    defaultValue="sk"
                    onChange={setTargetLanguage}
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
              texts={texts}
              onClick={handleClickedWord}
            />
            <PaginationControls
              currentPage={currentPage}
              onShowSizeChange={onShowSizeChange}
              handlePageChange={handlePageChange}
              totalSentences={totalSentences}
              sentencesPerPage={sentencesPerPage}
            />
          </Card>
        </Col>
        {userSentences.length !== 0 && (
          <>
            <Col span={6}>
              <VocabularyList
                sourceLanguage={sourceLanguage}
                targetLanguage={targetLanguage}
                clickedWords={getAllUserWords(userSentences)}
              />
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
