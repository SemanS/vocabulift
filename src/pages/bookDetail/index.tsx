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
import {
  addUserPhrase,
  deleteUserPhrase,
  getSentences,
  getUserSentences,
} from "@/services/userService";
import {
  UserPhrase,
  UserSentence,
  UserWord,
} from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { mapUserSentencesToVocabularyListUserPhrases } from "@/utils/mapUserSentencesToVocabularyListUserPhrases";
import { mapVocabularyListUserPhrasesToUserSentences } from "@/utils/mapVocabularyListUserPhrasesToUserSentences";

const BookDetail: FC = () => {
  const navigate = useNavigate();
  const { libraryId } = useParams();
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
  const [vocabularyListUserPhrases, setVocabularyListUserPhrases] =
    useState<VocabularyListUserPhrase[]>();
  const [mode, setMode] = useState<"word" | "sentence">("word");
  const [wordData, setWordData] = useState<any>();
  const [user, setUser] = useRecoilState(userState);
  const [sourceLanguage, setSourceLanguage] = useState<"en" | "sk" | "cz">(
    "en"
  );
  const [targetLanguage, setTargetLanguage] = useState<"en" | "sk" | "cz">(
    "sk"
  );
  const [initState, setInitState] = useState<boolean>(true);

  useEffect(() => {
    if (currentPageFromQuery && pageSizeFromQuery) {
      setCurrentPage(currentPageFromQuery);
      setSentencesPerPage(pageSizeFromQuery);
      handlePageChange(currentPageFromQuery, pageSizeFromQuery);
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
      libraryId,
      sentenceFrom,
      countOfSentences,
      localSentenceFrom
    );
    const userSentencesData: UserSentence[] = await getUserSentences(
      libraryId,
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
    console.log("nastavujem setUserSentenes");
    setVocabularyListUserPhrases(
      mapUserSentencesToVocabularyListUserPhrases(userSentencesData)
    );
    setUserSentences(userSentencesData);
  };

  const handleAddUserPhrase = async (
    vocabularyListUserPhrase: VocabularyListUserPhrase
  ) => {
    try {
      const updateVocabularyListUserPhrases = [
        ...(vocabularyListUserPhrases || []),
        vocabularyListUserPhrase,
      ];

      const userSentence: UserSentence = {
        libraryId: libraryId!,
        sentence_no: vocabularyListUserPhrase.sentence_no,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        words: [],
        phrases: [vocabularyListUserPhrase.phrase],
      };

      const updateUserSentences = [...(userSentences || []), userSentence];

      setVocabularyListUserPhrases(updateVocabularyListUserPhrases);
      setUserSentences(updateUserSentences);
    } catch (error) {
      console.error("Error adding user phrase:", error);
    }
  };

  const handleDeleteUserPhrase = async (
    startPosition: number,
    sentence_no: number
  ) => {
    try {
      await deleteUserPhrase(
        libraryId,
        sentence_no,
        startPosition,
        sourceLanguage,
        targetLanguage,
        sessionStorage.getItem("access_token")
      );

      // Filter out the element with the specified startPosition and sentence_no
      const updatedVocabularyListUserPhrases =
        vocabularyListUserPhrases!.filter(
          (item) =>
            !(
              item.phrase.startPosition === startPosition &&
              item.sentence_no === sentence_no
            )
        );

      setVocabularyListUserPhrases(updatedVocabularyListUserPhrases);
    } catch (error) {
      console.error("Error deleting user phrase:", error);
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

  const fetchAndUpdate = async (localSentenceFrom: number) => {
    setLoading(true);
    await fetchDataAndUpdateState(getRangeNumber(localSentenceFrom));
    setLoading(false);
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
      pageSieze: pageSize,
    };
    localStorage.setItem(`bookState-${libraryId}`, JSON.stringify(bookState));

    await updateBookState(libraryId, page, pageSize);

    if (initState) {
      let localSentenceFrom =
        (currentPageFromQuery - 1) * pageSizeFromQuery + 1;
      setSentenceFrom(getRangeNumber(localSentenceFrom));
      await fetchAndUpdate(localSentenceFrom);
      setInitState(false);
    } else if (
      sentenceFrom + countOfSentences < page * pageSize ||
      page * pageSize > sentenceFrom + countOfSentences ||
      page * pageSize < sentenceFrom
    ) {
      let localSentenceFrom = (page - 1) * pageSize + 1;
      setSentenceFrom(getRangeNumber(localSentenceFrom));
      await fetchAndUpdate(localSentenceFrom);
    }

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
              userSentences={userSentences}
              onAddUserPhrase={handleAddUserPhrase}
              vocabularyListUserPhrases={vocabularyListUserPhrases!}
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
        {vocabularyListUserPhrases?.length !== 0 && (
          <>
            <Col span={6}>
              <VocabularyList
                phrases={vocabularyListUserPhrases}
                onDeleteItem={handleDeleteUserPhrase}
              />
            </Col>
            {/* <Col span={18}>
              <WordDefinitionCard wordData={wordData} />
            </Col> */}
          </>
        )}
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
