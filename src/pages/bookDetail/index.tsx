import React, { FC, useEffect, useCallback, useMemo, useReducer } from "react";
import {
  Card,
  Row,
  Col,
  Space,
  Checkbox,
  RadioChangeEvent,
  Radio,
  Modal,
  Typography,
  Select,
} from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import TranslateBox from "./components/TranslateBox/TranslateBox";
import PaginationControls from "./components/PaginationControls/PaginationControls";
import { LabelType } from "@/models/sentences.interfaces";
import { calculateFirstIndex, getRangeNumber } from "@/utils/stringUtils";
import {
  deleteUserPhrases,
  getPhraseAlternatives,
  getPhraseMeaning,
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
import styles from "./index.module.less";
import { Snapshot } from "@/models/snapshot.interfaces";
import { getSnapshots } from "@/services/snapshotService";
import { userState } from "@/stores/user";
import EmbeddedVideo from "./components/EmbeddedVideo/EmbeddedVideo";
import PricingComponent from "@/pages/webLayout/shared/components/Pricing/PricingComponent";
import Flag from "react-world-flags";
import Masonry from "react-masonry-css";

const initialReducerState = (targetLanguageFromQuery: string) => ({
  currentPage: 1,
  currentTextIndex: 0,
  sentenceFrom: 1,
  firstIndexAfterReset: null,
  loadingFromFetch: false,
  loading: true,
  shouldSetVideo: false,
  wordData: null,
  showWordDefinition: false,
  mode: "words",
  snapshots: null,
  userSentences: null,
  libraryTitle: "",
  label: "",
  videoId: "",
  totalSentences: 0,
  vocabularyListUserPhrases: null,
  selectedUserPhrase: null,
  showVocabularyList: true,
  selectAll: true,
  colSpan: 24,
  settingsDrawerVisible: false,
  countOfSentences: 100,
  sentencesPerPage: 10,
  initState: true,
  isLimitExceeded: false,
  selectedLanguageTo: targetLanguageFromQuery,
  wordMeaningData: null,
  loadingFromWordMeaning: false,
});

function reducer(state: any, action: any) {
  switch (action.type) {
    case "setCurrentPage":
      return { ...state, currentPage: action.payload };
    case "setCurrentTextIndex":
      return { ...state, currentTextIndex: action.payload };
    case "setSentenceFrom":
      return { ...state, sentenceFrom: action.payload };
    case "setFirstIndexAfterReset":
      return { ...state, firstIndexAfterReset: action.payload };
    case "setLoadingFromFetch":
      return { ...state, loading: action.payload };
    case "setLoading":
      return { ...state, loadingFromFetch: action.payload };
    case "setLoadingFromWordMeaning":
      return { ...state, loadingFromWordMeaning: action.payload };
    case "setShouldSetVideo":
      return { ...state, shouldSetVideo: action.payload };
    case "setWordData":
      return { ...state, wordData: action.payload };
    case "setShowWordDefinition":
      return { ...state, showWordDefinition: action.payload };
    case "setMode":
      return { ...state, mode: action.payload };
    case "setSnapshots":
      return { ...state, snapshots: action.payload };
    case "setUserSentences":
      return { ...state, userSentences: action.payload };
    case "setLibraryTitle":
      return { ...state, libraryTitle: action.payload };
    case "setLabel":
      return { ...state, label: action.payload };
    case "setVideoId":
      return { ...state, videoId: action.payload };
    case "setTotalSentences":
      return { ...state, totalSentences: action.payload };
    case "setVocabularyListUserPhrases":
      return { ...state, vocabularyListUserPhrases: action.payload };
    case "setSelectedUserPhrase":
      return { ...state, selectedUserPhrase: action.payload };
    case "setShowVocabularyList":
      return { ...state, showVocabularyList: action.payload };
    case "setSelectAll":
      return { ...state, selectAll: action.payload };
    case "setColSpan":
      return { ...state, colSpan: action.payload };
    case "toggleSettingsDrawer":
      return { ...state, settingsDrawerVisible: !state.settingsDrawerVisible };
    case "setCountOfSentences":
      return { ...state, countOfSentences: action.payload };
    case "setSentencesPerPage":
      return { ...state, sentencesPerPage: action.payload };
    case "setHighlightedSubtitleIndex":
      return { ...state, highlightedSubtitleIndex: action.payload };
    case "setInitState":
      return { ...state, initState: action.payload };
    case "setIsLimitExceeded":
      return { ...state, isLimitExceeded: action.payload };
    case "setSelectedLanguageTo":
      return { ...state, selectedLanguageTo: action.payload };
    case "setWordMeaningData":
      return { ...state, wordMeaningData: action.payload };
    default:
      throw new Error();
  }
}

const BookDetail: FC = () => {
  const navigate = useNavigate();
  const { libraryId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageSizeFromQuery = parseInt(queryParams.get("pageSize") as string);
  const currentPageFromQuery = parseInt(
    queryParams.get("currentPage") as string
  );
  const targetLanguageFromQuery = queryParams.get("targetLanguage") as string;
  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [recoilCurrentPage, setRecoilCurrentPage] =
    useRecoilState(currentPageState);
  const [recoilPageSize, setRecoilPageSize] = useRecoilState(pageSizeState);
  const [recoilLibraryId, setRecoilLibraryId] = useRecoilState(libraryIdState);
  const [user, setUser] = useRecoilState(userState);

  const [state, dispatch] = useReducer(
    reducer,
    initialReducerState(targetLanguageFromQuery)
  );

  const setSelectedUserPhrase = (
    selectedUserPhrase: VocabularyListUserPhrase
  ) => dispatch({ type: "setSelectedUserPhrase", payload: selectedUserPhrase });
  const setCurrentPage = (page: any) =>
    dispatch({ type: "setCurrentPage", payload: page });
  const setCurrentTextIndex = (index: any) =>
    dispatch({ type: "setCurrentTextIndex", payload: index });
  const setSentenceFrom = (sentence: any) =>
    dispatch({ type: "setSentenceFrom", payload: sentence });
  const setFirstIndexAfterReset = (index: number) =>
    dispatch({ type: "setFirstIndexAfterReset", payload: index });
  const setLoading = (isLoading: boolean) =>
    dispatch({ type: "setLoading", payload: isLoading });
  const setLoadingFromFetch = (isLoading: boolean) =>
    dispatch({ type: "setLoadingFromFetch", payload: isLoading });
  const setLoadingFromWordMeaning = (isLoading: boolean) =>
    dispatch({ type: "setLoadingFromWordMeaning", payload: isLoading });
  const setShouldSetVideo = (shouldSetVideo: boolean) =>
    dispatch({ type: "setShouldSetVideo", payload: shouldSetVideo });
  const setMode = (mode: string) =>
    dispatch({ type: "setMode", payload: mode });
  const setHighlightedSubtitleIndex = (
    highlightedSubtitleIndex: number | null
  ) =>
    dispatch({
      type: "setHighlightedSubtitleIndex",
      payload: highlightedSubtitleIndex,
    });
  const setSelectedLanguageTo = (language: string) =>
    dispatch({ type: "setSelectedLanguageTo", payload: language });

  const handlePageChange = useCallback(
    async (
      page: number,
      pageSize: number,
      changeTriggeredByHighlightChange: boolean = false,
      changeTriggeredFromVideo: boolean = false,
      changeTriggeredFromVideoFetch: boolean = false
    ) => {
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.set("currentPage", page.toString());
      newQueryParams.set("pageSize", pageSize.toString());
      let localSentenceFrom;

      if (changeTriggeredFromVideo) {
        if (changeTriggeredFromVideoFetch) {
          localSentenceFrom = (page - 1) * pageSize + 1;
          await fetchAndUpdate(localSentenceFrom);
          dispatch({ type: "setSentenceFrom", payload: localSentenceFrom });
          dispatch({
            type: "setFirstIndexAfterReset",
            payload: calculateFirstIndex(page, pageSize),
          });
          dispatch({ type: "setLoadingFromFetch", payload: true });
        }
      } else {
        await updateReadingProgress(libraryId, page, pageSize);
        if (state.initState) {
          localSentenceFrom = changeTriggeredFromVideo
            ? (page - 1) * state.pageSizeFromQuery + 1
            : (state.currentPageFromQuery - 1) * state.pageSizeFromQuery + 1;
          await fetchAndUpdate(localSentenceFrom);
          dispatch({ type: "setInitState", payload: false });
        } else if (
          state.sentenceFrom + state.countOfSentences < page * pageSize ||
          page * pageSize > state.sentenceFrom + state.countOfSentences ||
          page * pageSize < state.sentenceFrom
        ) {
          localSentenceFrom = (page - 1) * pageSize + 1;
          await fetchAndUpdate(localSentenceFrom);
          dispatch({
            type: "setFirstIndexAfterReset",
            payload: calculateFirstIndex(page, pageSize),
          });
        }
        if (state.snapshots && !changeTriggeredByHighlightChange) {
          dispatch({
            type: "setFirstIndexAfterReset",
            payload: calculateFirstIndex(page, pageSize),
          });
          if (!changeTriggeredByHighlightChange) {
            dispatch({ type: "setShouldSetVideo", payload: true });
          }
        }
      }

      dispatch({
        type: "setCurrentTextIndex",
        payload: (page - 1) * (pageSize || state.sentencesPerPage),
      });
      dispatch({ type: "setCurrentPage", payload: page });
      dispatch({
        type: "setSentenceFrom",
        payload: getRangeNumber((page - 1) * pageSize + 1),
      });
      navigate({
        pathname: location.pathname,
        search: newQueryParams.toString(),
      });
    },
    [
      state,
      state.initState,
      state.currentPageFromQuery,
      state.pageSizeFromQuery,
      state.sentenceFrom,
      state.countOfSentences,
      state.sentencesPerPage,
      state.changeTriggeredByHighlightChange,
    ]
  );

  useEffect(() => {
    if (user.isLimitExceeded === true) {
      dispatch({ type: "setIsLimitExceeded", payload: true });
    } else {
      if (pageSizeFromQuery) {
        dispatch({ type: "setSentencesPerPage", payload: pageSizeFromQuery });
      }
      if (currentPageFromQuery) {
        dispatch({ type: "setCurrentPage", payload: currentPageFromQuery });
      }
      handlePageChange(
        currentPageFromQuery,
        pageSizeFromQuery,
        false,
        false,
        false
      );
      setRecoilLibraryId(libraryId!);
      setRecoilCurrentPage(currentPageFromQuery);
      setRecoilPageSize(pageSizeFromQuery);
    }
  }, []);

  const handleAddWordDefinition = useCallback(async (word: string) => {
    // Fetch word details from public API
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0]) {
          dispatch({ type: "setWordData", payload: data[0] });
          dispatch({ type: "setShowWordDefinition", payload: true });
        } else {
          dispatch({ type: "setWordData", payload: null });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleModeChange = useCallback((e: RadioChangeEvent) => {
    dispatch({ type: "setMode", payload: e.target.value });
  }, []);

  const memoizedSnapshots = useMemo(() => state.snapshots, [state.snapshots]);

  const fetchDataAndUpdateState = useCallback(
    async (localSentenceFrom: number) => {
      dispatch({ type: "setLoadingFromFetch", payload: true });

      const snapshots = await getSnapshots(
        libraryId!,
        user.sourceLanguage,
        [user.targetLanguage],
        undefined,
        localSentenceFrom
      );

      const userSentencesData: UserSentence[] = await getUserSentences({
        sentenceFrom: state.sentenceFrom,
        countOfSentences: state.countOfSentences,
        sourceLanguage: user.sourceLanguage,
        targetLanguage: state.selectedLanguageTo,
        orderBy: "sentenceNo",
        libraryId,
        localSentenceFrom,
      });

      const vocabularyListUserPhrases =
        mapUserSentencesToVocabularyListUserPhrases(userSentencesData);

      await updateSentencesState(
        userSentencesData,
        snapshots,
        vocabularyListUserPhrases
      );

      dispatch({ type: "setLoadingFromFetch", payload: false });
    },
    [
      getSnapshots,
      libraryId,
      sourceLanguage,
      targetLanguage,
      state.selectedLanguageTo,
    ]
  );

  const updateSentencesState = useCallback(
    async (
      userSentencesData: UserSentence[],
      snapshots: Snapshot[],
      vocabularyListUserPhrases: VocabularyListUserPhrase[]
    ) => {
      dispatch({ type: "setSnapshots", payload: snapshots });
      dispatch({ type: "setLibraryTitle", payload: snapshots[0].title });
      dispatch({ type: "setLabel", payload: snapshots[0].label });
      dispatch({ type: "setVideoId", payload: snapshots[0].videoId });
      dispatch({
        type: "setTotalSentences",
        payload: snapshots[0].totalSentences,
      });
      dispatch({
        type: "setVocabularyListUserPhrases",
        payload: vocabularyListUserPhrases,
      });
      dispatch({ type: "setUserSentences", payload: userSentencesData });
    },
    []
  );

  const handleAddUserPhrase = useCallback(
    async (vocabularyListUserPhrase: VocabularyListUserPhrase) => {
      try {
        dispatch({
          type: "setSelectedUserPhrase",
          payload: vocabularyListUserPhrase,
        });
        handleAddWordDefinition(vocabularyListUserPhrase.phrase.sourceText);
        const updateVocabularyListUserPhrases = [
          ...(state.vocabularyListUserPhrases || []),
          vocabularyListUserPhrase,
        ];

        const userSentence: UserSentence = {
          libraryId: libraryId!,
          sentenceNo: vocabularyListUserPhrase.sentenceNo,
          sourceLanguage: sourceLanguage,
          targetLanguage: state.selectedLanguageTo,
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

        const updateUserSentences = [
          ...(state.userSentences || []),
          userSentence,
        ];

        dispatch({
          type: "setVocabularyListUserPhrases",
          payload: updateVocabularyListUserPhrases,
        });
        dispatch({ type: "setUserSentences", payload: updateUserSentences });
      } catch (error) {
        console.error("Error adding user phrase:", error);
      }
    },
    [state.userSentences, state.vocabularyListUserPhrases]
  );

  const handleQuestionClick = async (phrase: string) => {
    try {
      dispatch({ type: "setLoadingFromWordMeaning", payload: true });
      const meaning = await getPhraseMeaning(phrase);
      dispatch({ type: "setWordMeaningData", payload: meaning });
      dispatch({ type: "setLoadingFromWordMeaning", payload: false });
    } catch (error) {
      console.error("Error occurred:", error);
      dispatch({ type: "setWordMeaningData", payload: "An error occured." });
    }
  };

  const handleAlternativesClick = async (phrase: string) => {
    try {
      console.log("okej");
      dispatch({ type: "setLoadingFromWordMeaning", payload: true });
      const meaning = await getPhraseAlternatives(phrase);
      dispatch({ type: "setWordMeaningData", payload: meaning });
      dispatch({ type: "setLoadingFromWordMeaning", payload: false });
    } catch (error) {
      console.error("Error occurred:", error);
      dispatch({ type: "setWordMeaningData", payload: "An error occured." });
    }
  };

  const handleDeleteUserPhrase = useCallback(
    async (
      phraseId: string,
      sentenceId: string,
      startPosition: number,
      sentenceNo: number
    ) => {
      // Update sentences in TranslateBox by deleted sentences
      const updatedUserSentences = state.userSentences.map((sentence) => {
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
        state.vocabularyListUserPhrases!.filter(
          (item) =>
            !(
              item.phrase.startPosition === startPosition &&
              item.sentenceNo === sentenceNo
            )
        );
      try {
        await deleteUserPhrases([phraseId]).then(() => {
          dispatch({
            type: "setVocabularyListUserPhrases",
            payload: updatedVocabularyListUserPhrases,
          });
          dispatch({ type: "setUserSentences", payload: updatedUserSentences });
        });

        // Filter out the element with the specified startPosition and sentenceNo
      } catch (error) {
        console.error("Error deleting user phrase:", error);
      }
    },
    [state.userSentences, state.vocabularyListUserPhrases]
  );

  const onShowSizeChange = useCallback(
    async (current: number, pageSize: number) => {
      // Calculate the new current page based on the new page size
      const newCurrentPage =
        Math.floor(((current - 1) * state.sentencesPerPage) / pageSize) + 1;
      dispatch({ type: "setSentencesPerPage", payload: pageSize });
      await handlePageChange(newCurrentPage, pageSize);
    },
    [state.sentencesPerPage]
  );

  const fetchVocabularyAndSetState = useCallback(
    async (localSentenceFrom: number, value: string) => {
      const userSentencesData: UserSentence[] = await getUserSentences({
        sentenceFrom: state.sentenceFrom,
        countOfSentences: state.countOfSentences,
        sourceLanguage: user.sourceLanguage,
        targetLanguage: value,
        orderBy: "sentenceNo",
        libraryId,
        localSentenceFrom,
      });

      const vocabularyListUserPhrases =
        mapUserSentencesToVocabularyListUserPhrases(userSentencesData);

      dispatch({
        type: "setVocabularyListUserPhrases",
        payload: vocabularyListUserPhrases,
      });
    },
    [state.selectedLanguageTo]
  );

  const fetchAndUpdate = useCallback(
    async (localSentenceFrom: number) => {
      dispatch({ type: "setLoadingFromFetch", payload: true });
      await fetchDataAndUpdateState(getRangeNumber(localSentenceFrom));
      dispatch({ type: "setLoadingFromFetch", payload: false });
    },
    [fetchDataAndUpdateState]
  );

  const onCheckboxChange = useCallback(
    (e: any) => {
      if (e.target.name === "vocabularyList") {
        dispatch({ type: "setShowVocabularyList", payload: e.target.checked });
      } else if (e.target.name === "wordDefinition") {
        dispatch({ type: "setShowWordDefinition", payload: e.target.checked });
      }
      if (
        e.target.checked &&
        state.showVocabularyList &&
        state.showWordDefinition
      ) {
        dispatch({ type: "setSelectAll", payload: true });
      } else {
        dispatch({ type: "setSelectAll", payload: false });
      }
    },
    [state.showVocabularyList, state.showWordDefinition]
  );

  const onSelectAllChange = useCallback((e: any) => {
    const isChecked = e.target.checked;
    dispatch({ type: "setShowVocabularyList", payload: isChecked });
    dispatch({ type: "setShowWordDefinition", payload: isChecked });
    dispatch({ type: "setSelectAll", payload: isChecked });
  }, []);

  useEffect(() => {
    let newColSpan = 24;

    if (state.showVocabularyList && state.showWordDefinition) {
      newColSpan = 12;
    } else if (state.showVocabularyList || state.showWordDefinition) {
      newColSpan = 24;
    }

    dispatch({ type: "setColSpan", payload: newColSpan });
  }, [state.showVocabularyList, state.showWordDefinition]);

  /* const { toggleSettingsDrawer, settingsDrawerVisible } =
    useSettingsDrawerContext(); */

  /* useEffect(() => {
    if (
      state.vocabularyListUserPhrases &&
      state.vocabularyListUserPhrases.length === 0
    ) {
      dispatch({ type: "setShowVocabularyList", payload: false });
      dispatch({ type: "setShowWordDefinition", payload: false });
    } else {
      dispatch({ type: "setShowVocabularyList", payload: true });
      dispatch({ type: "setShowWordDefinition", payload: true });
    }
  }, [state.vocabularyListUserPhrases]); */

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
                    checked={state.showVocabularyList}
                    onChange={onCheckboxChange}
                  >
                    Vocabulary List
                  </Checkbox>
                  <Checkbox
                    name="wordDefinition"
                    checked={state.showWordDefinition}
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
                    checked={state.selectAll}
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

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 2,
    600: 1,
  };

  return (
    <PageContainer title={false} className={styles.container}>
      {state.isLimitExceeded ? (
        <Modal
          open={true}
          closable={true}
          //maskClosable={false}
          footer={false}
          width="80%"
          centered
        >
          <center>
            <Typography.Title style={{ marginTop: "30px" }}>
              You exceed your daily limit of 3 min, for continuing please
              subscribe:
            </Typography.Title>
          </center>
          <PricingComponent />
        </Modal>
      ) : (
        <>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid}
            columnClassName={styles.myMasonryGridColumn}
          >
            <div
              className={`${styles.myVideoContainer} ${styles.fixedVideoAndVocabulary}`}
            >
              {state.label === LabelType.VIDEO && (
                <EmbeddedVideo
                  onHighlightedSubtitleIndexChange={setHighlightedSubtitleIndex}
                  sentencesPerPage={state.sentencesPerPage}
                  handlePageChange={handlePageChange}
                  snapshots={memoizedSnapshots}
                  shouldSetVideo={state.shouldSetVideo}
                  setShouldSetVideo={setShouldSetVideo}
                  firstIndexAfterReset={state.firstIndexAfterReset!}
                  setLoadingFromFetch={setLoadingFromFetch}
                />
              )}
            </div>
            <div className={styles.translateBoxScroll}>
              <Card
                loading={state.loading || state.loadingFromFetch}
                title={state.libraryTitle}
                extra={
                  <>
                    <Select
                      value={state.selectedLanguageTo}
                      onChange={(value) => {
                        dispatch({
                          type: "setSelectedLanguageTo",
                          payload: value,
                        });
                        fetchVocabularyAndSetState(state.sentenceFrom, value);
                      }}
                      style={{ marginRight: 16 }}
                    >
                      {memoizedSnapshots &&
                        memoizedSnapshots
                          .filter(
                            (snapshot) =>
                              snapshot.language !== user.sourceLanguage
                          )
                          .map((snapshot, index) => (
                            <Select.Option
                              key={index}
                              value={snapshot.language}
                            >
                              <Flag code={snapshot.language} height="16" />{" "}
                            </Select.Option>
                          ))}
                    </Select>

                    <Radio.Group
                      onChange={handleModeChange}
                      value={state.mode}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="words">Words</Radio.Button>
                      <Radio.Button value="phrases">Phrases</Radio.Button>
                      <Radio.Button value="sentences">Sentences</Radio.Button>
                      <Radio.Button value="all">All</Radio.Button>
                    </Radio.Group>
                  </>
                }
              >
                <TranslateBox
                  sourceLanguage={user.sourceLanguage}
                  currentTextIndex={state.currentTextIndex}
                  sentenceFrom={state.sentenceFrom}
                  sentencesPerPage={state.sentencesPerPage}
                  currentPage={state.currentPage}
                  libraryTitle={state.libraryTitle}
                  mode={state.mode}
                  snapshots={memoizedSnapshots}
                  userSentences={state.userSentences}
                  onAddUserPhrase={handleAddUserPhrase}
                  vocabularyListUserPhrases={state.vocabularyListUserPhrases}
                  highlightedSentenceIndex={
                    state.highlightedSubtitleIndex !== null
                      ? state.highlightedSubtitleIndex -
                        (state.currentTextIndex % 100)
                      : null
                  }
                  selectedLanguageTo={state.selectedLanguageTo}
                  onChangeMode={setMode}
                />
                <PaginationControls
                  currentPage={state.currentPage}
                  onShowSizeChange={onShowSizeChange}
                  handlePageChange={handlePageChange}
                  totalSentences={state.totalSentences}
                  sentencesPerPage={state.sentencesPerPage}
                />
              </Card>
            </div>
            <div
              className={styles.myVocabularyContainer}
              style={{ marginTop: "16px" }}
            >
              {state.showVocabularyList &&
                state.vocabularyListUserPhrases?.length !== 0 &&
                state.vocabularyListUserPhrases && (
                  <>
                    <FilteredVocabularyList
                      title="Words list"
                      mode={"words"}
                      phrases={state.vocabularyListUserPhrases!}
                      onDeleteItem={handleDeleteUserPhrase}
                      onWordClick={handleAddWordDefinition}
                      selectedUserPhrase={state.selectedUserPhrase}
                      setSelectedUserPhrase={setSelectedUserPhrase}
                    />
                    <FilteredVocabularyList
                      title="Phrases list"
                      mode={"phrases"}
                      phrases={state.vocabularyListUserPhrases!}
                      onDeleteItem={handleDeleteUserPhrase}
                      onWordClick={handleAddWordDefinition}
                      onQuestionClick={handleQuestionClick}
                      onAlternativesClick={handleAlternativesClick}
                    />
                  </>
                )}

              {(state.loadingFromWordMeaning || state.wordMeaningData) && (
                <>
                  <Card
                    title={"Word meaning"}
                    loading={state.loadingFromWordMeaning}
                  >
                    {state.wordMeaningData && state.wordMeaningData.data}
                  </Card>
                </>
              )}

              {/* {state.showWordDefinition && (
                  <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <WordDefinitionCard
                      wordData={state.wordData}
                    ></WordDefinitionCard>
                  </Col>
                )} */}
            </div>
          </Masonry>
        </>
      )}
    </PageContainer>
  );
};

export default BookDetail;
