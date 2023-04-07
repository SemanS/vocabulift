import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { Card, Row, Col, Switch, Space, Checkbox, Drawer } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import TranslateBox from "./components/TranslateBox/TranslateBox";
import PaginationControls from "./components/PaginationControls/PaginationControls";
import { SentenceData, SentenceResponse } from "@/models/sentences.interfaces";
import { getRangeNumber } from "@/utils/stringUtils";
import {
  deleteUserPhrase,
  getSentences,
  getUserSentences,
  updateReadingProgress,
} from "@/services/userService";
import { UserSentence } from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { mapUserSentencesToVocabularyListUserPhrases } from "@/utils/mapUserSentencesToVocabularyListUserPhrases";
import WordDefinitionCard from "./components/WordDefinitionCard/WordDefinitionCard";
import { useSettingsDrawerContext } from "@/contexts/SettingsDrawerContext";
import FilteredVocabularyList from "./components/VocabularyList/FilteredVocabularyList";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";

const BookDetail: FC = () => {
  const navigate = useNavigate();
  const { libraryId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageSizeFromQuery = parseInt(queryParams.get("pageSize") as string);
  const currentPageFromQuery = parseInt(
    queryParams.get("currentPage") as string
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalSentences, setTotalSentences] = useState(0);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [sentencesData, setSentencesData] = useState<SentenceData[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);
  const [userSentences, setUserSentences] = useState<UserSentence[]>([]);
  const [vocabularyListUserPhrases, setVocabularyListUserPhrases] =
    useState<VocabularyListUserPhrase[]>();
  const [mode, setMode] = useState<"word" | "sentence">("word");
  const [wordData, setWordData] = useState<any>();
  const [user, setUser] = useRecoilState(userState);
  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [initState, setInitState] = useState<boolean>(true);
  const [showVocabularyList, setShowVocabularyList] = useState(true);
  const [showWordDefinition, setShowWordDefinition] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (currentPageFromQuery && pageSizeFromQuery) {
      setCurrentPage(currentPageFromQuery);
      setSentencesPerPage(pageSizeFromQuery);
      handlePageChange(currentPageFromQuery, pageSizeFromQuery);
    }
  }, []);

  const handleAddWordDefinition = async (word: string) => {
    console.log(JSON.stringify(word));
    // Fetch word details from public API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => response.json())
      .then((data) => setWordData(data[0]))
      .catch((error) => console.error(error));
    // Make POST on backend to save word under user
    /* sourceLanguage &&
      targetLanguage &&
      addWordToUser(
        word,
        sourceLanguage,
        targetLanguage,
        sessionStorage.getItem("access_token")
      ); */
  };

  const memoizeTexts = (sentences: SentenceData[]) => {
    return sentences.map((sentence) => {
      const { sentenceNo, language, sentenceText, sentenceWords } = sentence;
      const sentenceData: SentenceData = {
        sentenceNo: sentenceNo,
        language: language,
        sentenceText: sentenceText,
        sentenceWords: sentenceWords,
      };
      return sentenceData;
    });
  };
  const memoizedSentencesData = useMemo(
    () => memoizeTexts(sentencesData),
    [sentencesData]
  );

  const fetchDataAndUpdateState = async (localSentenceFrom: number) => {
    const sentencesData: SentenceResponse = await getSentences(
      libraryId,
      sentenceFrom,
      countOfSentences,
      localSentenceFrom,
      sourceLanguage,
      targetLanguage
    );
    const userSentencesData: UserSentence[] = await getUserSentences(
      sentenceFrom,
      countOfSentences,
      localSentenceFrom,
      sourceLanguage,
      targetLanguage,
      "sentenceNo",
      libraryId
    );

    await updateSentencesState(userSentencesData, sentencesData);
    setLoading(false);
  };

  const updateSentencesState = async (
    userSentencesData: UserSentence[],
    sentencesData: SentenceResponse
  ) => {
    setSentencesData(memoizeTexts(sentencesData.sentences));

    //setSentenceWords([]);
    setTotalSentences(sentencesData.totalSentences);
    setVocabularyListUserPhrases(
      mapUserSentencesToVocabularyListUserPhrases(userSentencesData)
    );
    setUserSentences(userSentencesData);
  };

  const handleAddUserPhrase = useCallback(
    async (vocabularyListUserPhrase: VocabularyListUserPhrase) => {
      try {
        if (
          vocabularyListUserPhrase.phrase.endPosition -
            vocabularyListUserPhrase.phrase.startPosition ===
          0
        ) {
          handleAddWordDefinition(vocabularyListUserPhrase.phrase.sourceText);
        }
        const updateVocabularyListUserPhrases = [
          ...(vocabularyListUserPhrases || []),
          vocabularyListUserPhrase,
        ];

        const userSentence: UserSentence = {
          libraryId: libraryId!,
          sentenceNo: vocabularyListUserPhrase.sentenceNo,
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
    },
    [userSentences, vocabularyListUserPhrases]
  );

  const handleDeleteUserPhrase = useCallback(
    async (startPosition: number, sentenceNo: number) => {
      // Update sentences in TranslateBox by deleted sentences
      const updatedUserSentences = userSentences.map((sentence) => {
        if (sentence.sentenceNo === sentenceNo) {
          return {
            ...sentence,
            phrases: sentence.phrases.filter(
              (phrase) => phrase.startPosition !== startPosition
            ),
          };
        }
        return sentence;
      });

      // Update sentences in VocabularyList by deleted sentences
      const updatedVocabularyListUserPhrases =
        vocabularyListUserPhrases!.filter(
          (item) =>
            !(
              item.phrase.startPosition === startPosition &&
              item.sentenceNo === sentenceNo
            )
        );

      try {
        await deleteUserPhrase(
          libraryId,
          sentenceNo,
          startPosition,
          sourceLanguage,
          targetLanguage,
          sessionStorage.getItem("access_token")
        ).then(() => {
          setVocabularyListUserPhrases(updatedVocabularyListUserPhrases);
          setUserSentences(updatedUserSentences);
        });

        // Filter out the element with the specified startPosition and sentenceNo
      } catch (error) {
        console.error("Error deleting user phrase:", error);
      }
    },
    [userSentences, vocabularyListUserPhrases]
  );

  const onShowSizeChange = useCallback(
    async (current: number, pageSize: number) => {
      // Calculate the new current page based on the new page size
      const newCurrentPage =
        Math.floor(((current - 1) * sentencesPerPage) / pageSize) + 1;
      setSentencesPerPage(pageSize);
      await handlePageChange(newCurrentPage, pageSize);
    },
    [sentencesPerPage]
  );

  const fetchAndUpdate = async (localSentenceFrom: number) => {
    setLoading(true);
    await fetchDataAndUpdateState(getRangeNumber(localSentenceFrom));
    setLoading(false);
  };

  const handlePageChange = useCallback(
    async (page: number, pageSize: number) => {
      // Update the URL parameters
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.set("currentPage", page.toString());
      newQueryParams.set("pageSize", pageSize.toString());

      // Navigate to the new state
      navigate({
        pathname: location.pathname,
        search: newQueryParams.toString(),
      });

      await updateReadingProgress(libraryId, page, pageSize);

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
    },
    [
      initState,
      currentPageFromQuery,
      pageSizeFromQuery,
      sentenceFrom,
      countOfSentences,
      sentencesPerPage,
    ]
  );

  const onCheckboxChange = (e: any) => {
    if (e.target.name === "vocabularyList") {
      setShowVocabularyList(e.target.checked);
    } else if (e.target.name === "wordDefinition") {
      setShowWordDefinition(e.target.checked);
    }
    if (e.target.checked && showVocabularyList && showWordDefinition) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const onSelectAllChange = (e: any) => {
    const isChecked = e.target.checked;
    setShowVocabularyList(isChecked);
    setShowWordDefinition(isChecked);
    setSelectAll(isChecked);
  };

  const calculateColSpan = useMemo(() => {
    if (showVocabularyList && showWordDefinition) {
      return 12;
    } else if (showVocabularyList || showWordDefinition) {
      return 18;
    } else {
      return 24;
    }
  }, [showVocabularyList, showWordDefinition, vocabularyListUserPhrases]);

  const { toggleSettingsDrawer, settingsDrawerVisible } =
    useSettingsDrawerContext();

  const renderSettingsDrawerContent = () => {
    return (
      <>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "16px" }}
        >
          <Col>
            <Row gutter={[16, 16]}>
              <Col style={{ marginTop: "4px" }}>
                <Space>
                  <label htmlFor="switchMode">
                    Translate by word or sentence:
                  </label>
                  <Switch
                    id="switchMode"
                    checked={mode === "sentence"}
                    onChange={() =>
                      setMode(mode === "word" ? "sentence" : "word")
                    }
                  />
                </Space>
              </Col>
              <Col>
                <Space>
                  <Checkbox
                    name="vocabularyList"
                    checked={showVocabularyList}
                    onChange={onCheckboxChange}
                  >
                    Vocabulary List
                  </Checkbox>
                  <Checkbox
                    name="wordDefinition"
                    checked={showWordDefinition}
                    onChange={onCheckboxChange}
                  >
                    Word Definition
                  </Checkbox>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Checkbox
                    name="selectAll"
                    checked={selectAll}
                    onChange={onSelectAllChange}
                  >
                    Select All
                  </Checkbox>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <PageContainer loading={loading}>
      <Drawer
        style={{ backgroundColor: "#D7DFEA" }}
        title="Settings"
        placement="left"
        onClose={toggleSettingsDrawer}
        open={settingsDrawerVisible}
        width={320}
      >
        {renderSettingsDrawerContent()}
      </Drawer>
      <Row gutter={[16, 16]}>
        <Col
          xxl={calculateColSpan}
          xl={calculateColSpan}
          lg={calculateColSpan}
          md={24}
          sm={24}
          xs={24}
        >
          <Card>
            <TranslateBox
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              currentTextIndex={currentTextIndex}
              sentenceFrom={sentenceFrom}
              sentencesPerPage={sentencesPerPage}
              mode={mode}
              sentencesData={memoizedSentencesData}
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
            {showVocabularyList && (
              <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
                <FilteredVocabularyList
                  title="Words list"
                  mode={"words"}
                  phrases={vocabularyListUserPhrases!}
                  onDeleteItem={handleDeleteUserPhrase}
                  onWordClick={handleAddWordDefinition}
                />
                <FilteredVocabularyList
                  title="Phrases list"
                  style={{ marginTop: "16px" }}
                  mode={"phrases"}
                  phrases={vocabularyListUserPhrases!}
                  onDeleteItem={handleDeleteUserPhrase}
                  onWordClick={handleAddWordDefinition}
                />
              </Col>
            )}
            {showWordDefinition && (
              <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
                <WordDefinitionCard wordData={wordData}></WordDefinitionCard>
              </Col>
            )}
          </>
        )}
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
