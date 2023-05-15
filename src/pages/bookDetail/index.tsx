import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Space,
  Checkbox,
  Drawer,
  RadioChangeEvent,
  Radio,
} from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import TranslateBox from "./components/TranslateBox/TranslateBox";
import PaginationControls from "./components/PaginationControls/PaginationControls";
import { LabelType, SentenceData } from "@/models/sentences.interfaces";
import { calculateFirstIndex, getRangeNumber } from "@/utils/stringUtils";
import {
  deleteUserPhrases,
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
import { libraryIdState } from "@/stores/library";
import { currentPageState } from "@/stores/library";
import { pageSizeState } from "@/stores/library";
import EmbeddedVideo, {
  getCurrentIndex,
} from "./components/EmbeddedVideo/EmbeddedVideo";
import styles from "./index.module.less";
import { Snapshot } from "@/models/snapshot.interfaces";
import { getSnapshots } from "@/services/snapshotService";

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
  const [videoId, setVideoId] = useState<string | undefined>("");
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [sentencesData, setSentencesData] = useState<SentenceData[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);
  const [userSentences, setUserSentences] = useState<UserSentence[]>([]);
  const [vocabularyListUserPhrases, setVocabularyListUserPhrases] = useState<
    VocabularyListUserPhrase[] | undefined
  >(undefined);
  const [mode, setMode] = useState<"word" | "sentence">("word");
  const [wordData, setWordData] = useState<any>();
  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [initState, setInitState] = useState<boolean>(true);
  const [showVocabularyList, setShowVocabularyList] = useState(
    vocabularyListUserPhrases && vocabularyListUserPhrases.length > 0
  );
  const [showWordDefinition, setShowWordDefinition] = useState(
    vocabularyListUserPhrases && vocabularyListUserPhrases.length > 0
  );
  const [selectAll, setSelectAll] = useState(false);
  const [recoilLibraryId, setRecoilLibraryId] = useRecoilState(libraryIdState);
  const [recoilCurrentPage, setRecoilCurrentPage] =
    useRecoilState(currentPageState); // Add this line
  const [recoilPageSize, setRecoilPageSize] = useRecoilState(pageSizeState);
  const [highlightedSubtitleIndex, setHighlightedSubtitleIndex] = useState<
    number | null
  >(null);
  const [label, setLabel] = useState<LabelType | undefined>(LabelType.VIDEO);
  const [libraryTitle, setLibraryTitle] = useState<string | undefined>("");
  const [colSpan, setColSpan] = useState(24);
  const [snapshots, setSnapshots] = useState<Snapshot[] | null | undefined>();
  const [shouldSetVideo, setShouldSetVideo] = useState(false);
  const [
    changeTriggeredByHighlightChange,
    setChangeTriggeredByHighlightChange,
  ] = useState(false);
  const [firstIndexAfterReset, setFirstIndexAfterReset] = useState<number>();

  const handlePageChange = useCallback(
    async (
      page: number,
      pageSize: number,
      changeTriggeredByHighlightChange: boolean = false,
      changeTriggeredFromVideo: boolean = false
    ) => {
      console.log("HANDLEPAGECHANGE1");
      if (!changeTriggeredFromVideo) {
        console.log("HANDLEPAGECHANGE1.5");
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.set("currentPage", page.toString());
        newQueryParams.set("pageSize", pageSize.toString());
        setCurrentPage(page);
        let localSentenceFrom = (page - 1) * pageSize + 1;
        console.log("SETIKUJEM" + getRangeNumber(localSentenceFrom));
        setSentenceFrom(getRangeNumber(localSentenceFrom));
        // Navigate to the new state
        navigate({
          pathname: location.pathname,
          search: newQueryParams.toString(),
        });
      }
      if (changeTriggeredFromVideo) {
        console.log("CHANGIKUJEM");
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.set("currentPage", page.toString());
        newQueryParams.set("pageSize", pageSize.toString());
        setCurrentPage(page);
        navigate({
          pathname: location.pathname,
          search: newQueryParams.toString(),
        });
      }

      await updateReadingProgress(libraryId, page, pageSize);
      if (initState) {
        console.log("HANDLEPAGECHANGE2");
        let localSentenceFrom = changeTriggeredFromVideo
          ? (page - 1) * pageSizeFromQuery + 1
          : (currentPageFromQuery - 1) * pageSizeFromQuery + 1;
        setSentenceFrom(getRangeNumber(localSentenceFrom));
        await fetchAndUpdate(localSentenceFrom);
        setInitState(false);
      } else if (
        sentenceFrom + countOfSentences < page * pageSize ||
        page * pageSize > sentenceFrom + countOfSentences ||
        page * pageSize < sentenceFrom
      ) {
        console.log(
          "sentenceFrom pred" + JSON.stringify(sentenceFrom, null, 2)
        );
        console.log("page pred" + JSON.stringify(page, null, 2));
        let localSentenceFrom = (page - 1) * pageSize + 1;
        setSentenceFrom(getRangeNumber(localSentenceFrom));
        console.log(
          "sentenceFrom local po" + JSON.stringify(localSentenceFrom, null, 2)
        );
        console.log("page po" + JSON.stringify(page, null, 2));
        console.log("FETCH" + getRangeNumber(localSentenceFrom));
        await fetchAndUpdate(getRangeNumber(localSentenceFrom));
        setFirstIndexAfterReset(calculateFirstIndex(page, pageSize));
      }
      setCurrentTextIndex((page - 1) * (pageSize || sentencesPerPage));
      setCurrentPage(page);

      if (snapshots && !changeTriggeredByHighlightChange) {
        console.log("HANDLEPAGECHANGE4");
        console.log(
          "calculateFirstIndex(page, pageSize)" +
            JSON.stringify(calculateFirstIndex(page, pageSize), null, 2)
        );
        setFirstIndexAfterReset(calculateFirstIndex(page, pageSize));
        if (!changeTriggeredByHighlightChange) {
          setShouldSetVideo(true);
        }
      }
    },
    [
      initState,
      currentPageFromQuery,
      pageSizeFromQuery,
      sentenceFrom,
      countOfSentences,
      sentencesPerPage,
      changeTriggeredByHighlightChange,
    ]
  );

  useEffect(() => {
    console.log("FROM BOOKDETAIL INIT");
    console.log(
      "currentPageFromQuery" + JSON.stringify(currentPageFromQuery, null, 2)
    );
    if (pageSizeFromQuery) {
      setSentencesPerPage(pageSizeFromQuery);
    }
    if (currentPageFromQuery) {
      setCurrentPage(currentPageFromQuery);
    }
    setRecoilLibraryId(libraryId!);
    setRecoilCurrentPage(currentPageFromQuery);
    setRecoilPageSize(pageSizeFromQuery);
  }, []);

  const handleAddWordDefinition = async (word: string) => {
    // Fetch word details from public API
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0]) {
          setWordData(data[0]);
          setShowWordDefinition(true); // Show word definition when data is available
        } else {
          setWordData(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  const memoizeTexts = (sentences: SentenceData[]) => {
    return sentences.map((sentence) => {
      const {
        sentenceNo,
        language,
        sentenceText,
        sentenceWords,
        start,
        duration,
      } = sentence;
      const sentenceData: SentenceData = {
        sentenceNo: sentenceNo,
        language: language,
        sentenceText: sentenceText,
        sentenceWords: sentenceWords,
        ...(start !== undefined && { start: start }),
        ...(duration !== undefined && { duration: duration }),
      };
      return sentenceData;
    });
  };
  const memoizedSentencesData = useMemo(
    () => memoizeTexts(sentencesData),
    [sentencesData]
  );

  const fetchDataAndUpdateState = async (localSentenceFrom: number) => {
    const snapshots = await getSnapshots(
      sourceLanguage,
      [targetLanguage],
      undefined,
      localSentenceFrom
    );
    const userSentencesData: UserSentence[] = await getUserSentences({
      sentenceFrom,
      countOfSentences,
      sourceLanguage,
      targetLanguage,
      orderBy: "sentenceNo",
      libraryId,
      localSentenceFrom,
    });
    const vocabularyListUserPhrases =
      mapUserSentencesToVocabularyListUserPhrases(userSentencesData);
    await updateSentencesState(
      userSentencesData,
      snapshots!,
      vocabularyListUserPhrases
    );
    setLoading(false);
  };

  const updateSentencesState = async (
    userSentencesData: UserSentence[],
    snapshots: Snapshot[],
    vocabularyListUserPhrases: VocabularyListUserPhrase[]
  ) => {
    setSnapshots(snapshots);
    setLibraryTitle(snapshots[0].title);
    setLabel(snapshots[0].label);
    setVideoId(snapshots[0].videoId);
    setSentencesData(memoizeTexts(snapshots[0].sentencesData));
    setTotalSentences(snapshots[0].totalSentences);
    setVocabularyListUserPhrases(vocabularyListUserPhrases);
    setUserSentences(userSentencesData);
  };

  const handleAddUserPhrase = useCallback(
    async (vocabularyListUserPhrase: VocabularyListUserPhrase) => {
      try {
        handleAddWordDefinition(vocabularyListUserPhrase.phrase.sourceText);
        const updateVocabularyListUserPhrases = [
          ...(vocabularyListUserPhrases || []),
          vocabularyListUserPhrase,
        ];

        const userSentence: UserSentence = {
          libraryId: libraryId!,
          sentenceNo: vocabularyListUserPhrase.sentenceNo,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
          phrases: [vocabularyListUserPhrase.phrase],
          _id: "",
          userId: "",
          countOfPhrases: 0,
          sentenceText: "",
          title: "",
          sentencesPerPage: 0,
          currentPage: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
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
    async (
      phraseId: string,
      sentenceId: string,
      startPosition: number,
      sentenceNo: number
    ) => {
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
        await deleteUserPhrases([phraseId]).then(() => {
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

  useEffect(() => {
    let newColSpan = 24;

    if (showVocabularyList && showWordDefinition) {
      newColSpan = 12;
    } else if (showVocabularyList || showWordDefinition) {
      newColSpan = 24;
    }

    setColSpan(newColSpan);
  }, [showVocabularyList, showWordDefinition]);

  const { toggleSettingsDrawer, settingsDrawerVisible } =
    useSettingsDrawerContext();

  useEffect(() => {
    if (vocabularyListUserPhrases && vocabularyListUserPhrases.length === 0) {
      setShowVocabularyList(false);
      setShowWordDefinition(false);
    } else {
      setShowVocabularyList(true);
      setShowWordDefinition(true);
    }
  }, [vocabularyListUserPhrases]);

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
    <PageContainer title={false} className={styles.container}>
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
        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          {label === LabelType.VIDEO && (
            <EmbeddedVideo
              onHighlightedSubtitleIndexChange={setHighlightedSubtitleIndex}
              sentencesPerPage={sentencesPerPage}
              handlePageChange={handlePageChange}
              snapshots={snapshots}
              shouldSetVideo={shouldSetVideo}
              setShouldSetVideo={setShouldSetVideo}
              firstIndexAfterReset={firstIndexAfterReset!}
            />
          )}
        </Col>
        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card
            title={libraryTitle}
            extra={
              <Radio.Group
                onChange={handleModeChange}
                value={mode}
                buttonStyle="solid"
              >
                <Radio.Button value="word">Word</Radio.Button>
                <Radio.Button value="sentence">Sentence</Radio.Button>
                <Radio.Button value="all">All</Radio.Button>
              </Radio.Group>
            }
          >
            <TranslateBox
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              currentTextIndex={currentTextIndex}
              sentenceFrom={sentenceFrom}
              sentencesPerPage={sentencesPerPage}
              currentPage={currentPage}
              libraryTitle={libraryTitle}
              mode={mode}
              sentencesData={memoizedSentencesData}
              userSentences={userSentences}
              onAddUserPhrase={handleAddUserPhrase}
              vocabularyListUserPhrases={vocabularyListUserPhrases}
              highlightedSentenceIndex={
                highlightedSubtitleIndex !== null
                  ? highlightedSubtitleIndex - (currentTextIndex % 100)
                  : null
              }
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
      </Row>
      {vocabularyListUserPhrases?.length !== 0 && (
        <Row gutter={[16, 16]}>
          {showVocabularyList && (
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              {/* <FilteredVocabularyList
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
              /> */}
            </Col>
          )}
          {showWordDefinition && (
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              <WordDefinitionCard wordData={wordData}></WordDefinitionCard>
            </Col>
          )}
        </Row>
      )}
    </PageContainer>
  );
};

export default BookDetail;
