import React, {
  FC,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
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
  Button,
  FloatButton,
  Flex,
  Tag,
  Divider,
  List,
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
  getUserSentences,
  updateReadingProgress,
  updateUser,
} from "@/services/userService";
import { UserSentence } from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { mapUserSentencesToVocabularyListUserPhrases } from "@/utils/mapUserSentencesToVocabularyListUserPhrases";
import FilteredVocabularyList from "./components/VocabularyList/FilteredVocabularyList";
import {
  sourceLanguageState,
  targetLanguageState,
  uniqueLanguagesState,
} from "@/stores/language";
import { libraryIdState } from "@/stores/library";
import { currentPageState } from "@/stores/library";
import { pageSizeState } from "@/stores/library";
import styles from "./index.module.less";
import { Snapshot } from "@/models/snapshot.interfaces";
import { getPageNumber, getSnapshots } from "@/services/snapshotService";
import { userState } from "@/stores/user";
import EmbeddedVideo from "./components/EmbeddedVideo/EmbeddedVideo";
import PricingComponent from "@/pages/webLayout/shared/components/Pricing/PricingComponent";
import Masonry from "react-masonry-css";
import { getWorkSheet } from "@/services/aiService";
import html2pdf from "html2pdf.js";
import { getLibraryItem } from "@/services/libraryService";
import { getFlagCode } from "@/utils/utilMethods";
import { SvgIcon } from "@/pages/webLayout/shared/common/SvgIcon";
import { useIntl } from "react-intl";
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from "react-joyride";
import { wrapMultiElements } from "@/utils/joyride";
import { useMount, useSetState } from "react-use";
import { triggerState } from "@/stores/joyride";
import { User } from "@models/user";
import * as Slider from "@radix-ui/react-slider";
import "react-modern-drawer/dist/index.css";
import { Resizable } from "re-resizable";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import QuizComponent from "./components/Quiz/QuizComponent";
import lib, {
  QuestionOutlined,
  UnorderedListOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { parseLocale } from "@/utils/stringUtils";
import SelectLang from "@/pages/layout/components/RightContent/SelectLang";
import CustomSpinnerComponent from "@/pages/spinner/CustomSpinnerComponent";
import { WordTriple } from "@/pages/webLayout/shared/common/types";
import ReactECharts from "echarts-for-react";
import { getTriples } from "@/services/analyticService";
import "echarts-wordcloud";

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
  mode: "all",
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
  isMobile: false,
  isPlaying: false,
  subscribed: false,
  selectedPartOfSpeech: "",
});

interface StepType {
  content: JSX.Element | string;
  target: string | string[];
  title: string;
  placement: string;
  disableBeacon: boolean;
  disableOverlayClose: boolean;
  hideCloseButton: boolean;
  spotlightClicks: boolean;
}

interface JoyrideState {
  run: boolean;
  stepIndex?: number;
  translateBoxSteps: StepType[];
  vocabularyListSteps: StepType[];
  mainKey?: number;
}

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
    case "setLoadingWorkSheet":
      return { ...state, loadingWorkSheet: action.payload };
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
    case "setHighlightedWordIndex":
      return { ...state, highlightedWordIndex: action.payload };
    case "setInitState":
      return { ...state, initState: action.payload };
    case "setIsLimitExceeded":
      return { ...state, isLimitExceeded: action.payload };
    case "setSelectedLanguageTo":
      return { ...state, selectedLanguageTo: action.payload };
    case "setWordMeaningData":
      return { ...state, wordMeaningData: action.payload };
    case "setIsMobile":
      return { ...state, isMobile: action.payload };
    case "setIsPlaying":
      return { ...state, isPlaying: action.payload };
    case "setLibrary":
      return { ...state, library: action.payload };
    case "setSelectedPartOfSpeech":
      return { ...state, partOfSpeech: action.payload };
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
  const videoPlayerRef = useRef<ExposedFunctions | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const [isTenseVisible, setIsTenseVisible] = useState(true);

  const chartRef1 = useRef<ReactECharts>(null);

  const toggleIsTenseVisible = () => {
    setIsTenseVisible((prevState) => !prevState);
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

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
  const setLoadingWorkSheet = (isLoadingWorkSheet: boolean) =>
    dispatch({ type: "setLoadingWorkSheet", payload: isLoadingWorkSheet });
  const setLoading = (isLoading: boolean) =>
    dispatch({ type: "setLoading", payload: isLoading });
  const setLoadingFromFetch = (isLoading: boolean) =>
    dispatch({ type: "setLoadingFromFetch", payload: isLoading });
  const setLoadingFromWordMeaning = (isLoading: boolean) =>
    dispatch({ type: "setLoadingFromWordMeaning", payload: isLoading });
  const setShouldSetVideo = (shouldSetVideo: boolean) =>
    dispatch({ type: "setShouldSetVideo", payload: shouldSetVideo });
  const setMode = (mode: string) => {
    dispatch({ type: "setMode", payload: mode });
  };
  const setIsMobile = (isMobile: boolean) =>
    dispatch({ type: "isMobile", payload: isMobile });
  const setIsPlaying = (isPlaying: boolean) =>
    dispatch({ type: "isPlaying", payload: isPlaying });
  const setHighlightedSubtitleIndex = (
    highlightedSubtitleIndex: number | null
  ) =>
    dispatch({
      type: "setHighlightedSubtitleIndex",
      payload: highlightedSubtitleIndex,
    });
  const setHighlightedWordIndex = (highlightedWordIndex: number | null) =>
    dispatch({
      type: "setHighlightedWordIndex",
      payload: highlightedWordIndex,
    });
  const setSelectedLanguageTo = (language: string) =>
    dispatch({ type: "setSelectedLanguageTo", payload: language });
  const setLibrary = (library: any) =>
    dispatch({ type: "setLibrary", payload: library });
  const setSelectedPartOfSpeech = (partOfSpeech) => {
    dispatch({ type: "setSelectedPartOfSpeech", payload: partOfSpeech });
  };
  const intl = useIntl();

  const users = [
    { email: "Katharina.Landes@senacor.com" },
    { email: "james@englishlab.online" },
    { email: "adriana@taliancinaonline.sk" }, //iTalki
    { email: "krishnagoswami.52@gmail.com" },
    { email: "limudim972@gmail.com" },
    { email: "ninakocurova0@gmail.com" },
    { email: "slavosmn@gmail.com" },
    { email: "lubec.seman@gmail.com" },
    { email: "Paulina@polskidaily.eu" },
    { email: "info@angolrahangolva.com" },
    { email: "info@brona.cz" },
    { email: "ytcontact+emma@engvid.com" },
    { email: "tiffani@speakenglishwithtiffani.com" },
    { email: "support@francaisauthentique.com" },
    { email: "business@englishwithlucy.co.uk" },
    { email: "contact@speakenglishwithvanessa.com" },
    { email: "business@3s-media.net" },
    { email: "hello@englishwithgreg.com" },
    { email: "info@englishlessonviaskype.com" },
  ];

  const [isDropdownActive, setDropdownActive] = useState(false);

  const hasAccess = users.some(
    (existingUser) => existingUser.email === user.email
  );

  const handlePageChange = useCallback(
    async (
      page: number,
      pageSize: number,
      changeTriggeredByHighlightChange: boolean = false,
      changeTriggeredFromVideo: boolean = false,
      changeTriggeredFromVideoFetch: boolean = false,
      time?: number
    ) => {
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.set("currentPage", page.toString());
      newQueryParams.set("pageSize", pageSize.toString());
      let localSentenceFrom;

      /* if (time) {
        localSentenceFrom = (page - 1) * pageSize + 1;
        await fetchAndUpdate(localSentenceFrom);
        const newPageNumber = await getPageNumber(libraryId!, time);
        dispatch({ type: "setCurrentPage", payload: newPageNumber });
      } */

      if (changeTriggeredFromVideo) {
        if (changeTriggeredFromVideoFetch && time) {
          localSentenceFrom = (page - 1) * pageSize + 1;
          console.log("FETCH3");
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
        if (!initialFetchDone.current) {
          localSentenceFrom = changeTriggeredFromVideo
            ? (page - 1) * state.pageSizeFromQuery + 1
            : (state.currentPageFromQuery - 1) * state.pageSizeFromQuery + 1;
          console.log("FETCH4");
          await fetchAndUpdate(localSentenceFrom);
          dispatch({ type: "setInitState", payload: false });
        } else if (
          state.sentenceFrom + state.countOfSentences < page * pageSize ||
          page * pageSize > state.sentenceFrom + state.countOfSentences ||
          page * pageSize < state.sentenceFrom
        ) {
          localSentenceFrom = (page - 1) * pageSize + 1;
          console.log("FETCH5");
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

  const handlePlay = () => {
    dispatch({ type: "setIsPlaying", payload: true });
  };

  const handlePause = () => {
    dispatch({ type: "setIsPlaying", payload: false });
  };

  const handlePlayPause = () => {
    if (state.isPlaying) {
      videoPlayerRef.current.pauseVideo();
    } else {
      videoPlayerRef.current.playVideo();
    }
    dispatch({ type: "setIsPlaying", payload: !state.isPlaying });
  };

  const initialFetchDone = useRef(false);

  useEffect(() => {
    const initializeData = async () => {
      if (initialFetchDone.current) return;

      if (
        user.isLimitExceeded === true &&
        user.subscribed === false &&
        !hasAccess
      ) {
        dispatch({ type: "setIsLimitExceeded", payload: true });
      } else {
        const localSentenceFrom =
          (currentPageFromQuery - 1) * pageSizeFromQuery + 1;
        console.log("FETCH1");
        await fetchAndUpdate(localSentenceFrom, targetLanguageFromQuery);

        setRecoilLibraryId(libraryId!);
        setRecoilCurrentPage(currentPageFromQuery);
        setRecoilPageSize(pageSizeFromQuery);

        dispatch({ type: "setInitState", payload: false });
        initialFetchDone.current = true;
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (
      user.targetLanguage &&
      user.targetLanguage !== state.selectedLanguageTo
    ) {
      dispatch({
        type: "setSelectedLanguageTo",
        payload: user.targetLanguage,
      });
      console.log("FETCH2");
      fetchAndUpdate(state.sentenceFrom, user.targetLanguage);

      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set("targetLanguage", user.targetLanguage);
      window.history.replaceState({}, "", `${url.pathname}?${params}`);
    }
  }, [user.targetLanguage]);

  const handleModeChange = useCallback((e: RadioChangeEvent) => {
    dispatch({ type: "setMode", payload: e.target.value });
  }, []);

  const memoizedSnapshots = useMemo(() => state.snapshots, [state.snapshots]);

  const fetchDataAndUpdateState = useCallback(
    async (localSentenceFrom: number, targetLanguage?: string) => {
      dispatch({ type: "setLoadingFromFetch", payload: true });
      const snapshots = await getSnapshots(
        libraryId!,
        user.sourceLanguage,
        targetLanguage ? [targetLanguage] : [user.targetLanguage],
        undefined,
        localSentenceFrom
      );

      await updateSentencesState(snapshots, localSentenceFrom);

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
    async (snapshots: Snapshot[], localSentenceFrom: number) => {
      let language = state.selectedLanguageTo;

      const isLanguageInSnapshots = snapshots.some(
        (snapshot) => snapshot.language === state.selectedLanguageTo
      );

      if (!isLanguageInSnapshots && snapshots.length > 0) {
        //language = snapshots[1].language;
        dispatch({
          type: "setSelectedLanguageTo",
          payload: language,
        });
      }

      const userSentencesData: UserSentence[] = await getUserSentences({
        sentenceFrom: state.sentenceFrom,
        countOfSentences: state.countOfSentences,
        sourceLanguage: user.sourceLanguage,
        targetLanguage: language,
        orderBy: "sentenceNo",
        libraryId,
        localSentenceFrom,
      });

      const vocabularyListUserPhrases =
        mapUserSentencesToVocabularyListUserPhrases(userSentencesData);

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
    [state.selectedLanguageTo, setSelectedLanguageTo]
  );

  const [joyrideStyles, setJoyrideStyles] = useState({
    options: {
      width: 400,
    },
  });

  const handleAddUserPhrase = useCallback(
    async (vocabularyListUserPhrase: VocabularyListUserPhrase) => {
      try {
        dispatch({
          type: "setSelectedUserPhrase",
          payload: vocabularyListUserPhrase,
        });
        //handleAddWordDefinition(vocabularyListUserPhrase.phrase.sourceText);
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

      if (!rightVocabVisible) {
        toggleRightVocabPanel();
      }
    },
    [state.userSentences, state.vocabularyListUserPhrases]
  );

  function getBase64Image(imgUrl, callback) {
    var img = new Image();

    // onload event handler
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);

      var dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
    };

    // set source
    img.src = imgUrl;
  }

  const handleDownloadWorkSheet = async () => {
    dispatch({ type: "setLoadingWorkSheet", payload: true });

    let htmlContent = await getWorkSheet(
      sourceLanguage,
      targetLanguage,
      libraryId!
    );

    const element = document.createElement("div");
    element.style.margin = "20px";
    // Create a temporary container to parse your htmlContent
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlContent;

    // Find and remove all iframes
    Array.from(tempContainer.getElementsByTagName("iframe")).forEach(
      (iframe) => {
        iframe.parentElement!.removeChild(iframe);
      }
    );

    // Now use this cleaned HTML as your content
    htmlContent = tempContainer.innerHTML;
    element.innerHTML = htmlContent;

    // Here, let's say each block of content that should stay together per page is encapsulated by a div
    const blocks = Array.from(element.getElementsByTagName("div"));
    blocks.forEach(
      (block) =>
        (block.style.cssText +=
          "; page-break-inside: avoid;margin-bottom: 13.333pt;")
    );

    let base64Logo: any;

    getBase64Image(
      `${import.meta.env.VITE_BASE_URL}/vocabulift_logo.png`,
      function (base64Image) {
        base64Logo = base64Image;
      }
    );

    html2pdf()
      .from(element)
      .set({
        margin: [50, 15, 15, 15],
        jsPDF: { unit: "pt", format: "letter", orientation: "portrait" },
        pagebreak: { after: "section", mode: ["avoid-all", "css", "legacy"] },
      })
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const currentDate = new Date();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150);

          // Adding header line
          let margin = 15;
          let lineHeight = 50;
          let pageWidth = pdf.internal.pageSize.getWidth() - margin;
          pdf.line(margin, lineHeight, pageWidth, lineHeight);

          // Adding the vocabulift.com text at the end of the line
          pdf.text("https://vocabulift.com", pageWidth - 75, lineHeight - 5);
          let imageX = 15;
          let imageY = 15;
          pdf.addImage(base64Logo, "PNG", 15, 10, 50, 50);
        }
      })
      .save(state.libraryTitle + "-worksheet.pdf");

    dispatch({ type: "setLoadingWorkSheet", payload: false });
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

        if (state.vocabularyListUserPhrases.length === 1) {
          toggleRightVocabPanel();
        }

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
    async (localSentenceFrom: number, targetLanguage?: string) => {
      dispatch({ type: "setLoadingFromFetch", payload: true });
      try {
        const [library, snapshots] = await Promise.all([
          getLibraryItem(libraryId!),
          getSnapshots(
            libraryId!,
            user.sourceLanguage,
            targetLanguage ? [targetLanguage] : [user.targetLanguage],
            undefined,
            localSentenceFrom
          ),
        ]);

        dispatch({ type: "setLibrary", payload: library });
        await updateSentencesState(snapshots, localSentenceFrom);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch({ type: "setLoadingFromFetch", payload: false });
      }
    },
    [libraryId, user.sourceLanguage, user.targetLanguage, updateSentencesState]
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
    750: 2,
    749: 1,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoPlayerRef.current && videoPlayerRef.current.getCurrentTime) {
        const newTime = videoPlayerRef.current.getCurrentTime();
        setCurrentTime(newTime); // This updates the slider position indirectly
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [videoPlayerRef]);

  const handleSliderChange = (value) => {
    const newTime = parseFloat(value[0]);
    setCurrentTime(newTime); // You might want to avoid this if it's directly controlled by user input
    if (videoPlayerRef.current && videoPlayerRef.current.seekTo) {
      videoPlayerRef.current.seekTo(newTime, true);
      videoPlayerRef.current.updateHighlightedSubtitleAndPage(newTime);
    }
  };

  const videoContainer = (
    <div className={`${styles.myVideoContainer}`}>
      {state.label === LabelType.VIDEO && (
        <EmbeddedVideo
          ref={videoPlayerRef}
          onHighlightedSubtitleIndexChange={setHighlightedSubtitleIndex}
          onHighlightedWordIndexChange={setHighlightedWordIndex}
          sentencesPerPage={state.sentencesPerPage}
          handlePageChange={handlePageChange}
          snapshots={memoizedSnapshots}
          shouldSetVideo={state.shouldSetVideo}
          setShouldSetVideo={setShouldSetVideo}
          firstIndexAfterReset={state.firstIndexAfterReset!}
          setLoadingFromFetch={setLoadingFromFetch}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      )}
    </div>
  );

  const magnifyingGlassRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const magnifyingGlass = document.createElement("div");
    magnifyingGlass.className = "magnifying-glass";
    document.body.appendChild(magnifyingGlass);
    magnifyingGlassRef.current = magnifyingGlass;
    return () => {
      document.body.removeChild(magnifyingGlass);
    };
  }, []);

  const [uniqueLanguages, setUniqueLanguages] = useState<string[]>([]);

  const [uniqueLanguagesRecoil, setUniqueLanguagesRecoil] =
    useRecoilState(uniqueLanguagesState);

  useEffect(() => {
    if (state.library?.snapshotsInfo) {
      const languages = Array.from(
        new Set(
          state.library.snapshotsInfo.map((snapshot) => snapshot.language)
        )
      );
      setUniqueLanguages(languages);
    }
  }, [state.library?.snapshotsInfo]);

  useEffect(() => {
    if (uniqueLanguages.length > 0) {
      setUniqueLanguagesRecoil(uniqueLanguages);
    }
  }, [uniqueLanguages, setUniqueLanguagesRecoil]);

  const languagesWithoutSource = uniqueLanguages.filter(
    (lang) => lang !== user.sourceLanguage
  );

  const [trigger, setTrigger] = useRecoilState(triggerState);

  const [joyrideState, setJoyrideState] = useState<JoyrideState>({
    run: false,
    translateBoxSteps: [],
    vocabularyListSteps: [],
  });

  const [
    { run, stepIndex, translateBoxSteps, vocabularyListSteps, mainKey },
    setState,
  ] = useSetState<JoyrideState>({
    run: false,
    stepIndex: 0,
    translateBoxSteps: [],
    vocabularyListSteps: [],
    mainKey: 0,
  });

  useMount(() => {
    setState({
      run: true,
      translateBoxSteps: [],
      vocabularyListSteps: [],
    });
  });

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { action, index, status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setState({ stepIndex: nextStepIndex });
    }

    if (type === EVENTS.TOUR_START) {
      setJoyrideStyles({
        options: {
          width: 900,
        },
      });
    }

    if (type === EVENTS.TOUR_END) {
      document.body.style.overflow = "auto";
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      if (user.newUser) {
        const updatedUserEntity: Partial<User> = {
          newUser: false,
        };
        try {
          await updateUser(updatedUserEntity);
          setUser((prevUser) => ({
            ...prevUser,
            newUser: false,
          }));
        } catch (error) {
          console.error("Failed to update user", error);
        }
      }
      setState({ run: false, stepIndex: 0 });
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (index === 0 && user.newUser) {
        document.body.style.overflow = "hidden";
        setState({ run: true, stepIndex: nextStepIndex });
        setJoyrideStyles({
          options: {
            width: 400,
          },
        });
      } else if (index === 1) {
        setTrigger({
          shouldTrigger: true,
          params: { sourceLanguage: "en", targetLanguage: "sk" },
        });
        document.body.style.overflow = "hidden";
        setState({ run: true, stepIndex: nextStepIndex });
        setJoyrideStyles({
          options: {
            width: 900,
          },
        });
      } else if (index === 2) {
        document.body.style.overflow = "hidden";
        setState({ run: true, stepIndex: nextStepIndex });
      } else {
        setState({
          stepIndex: nextStepIndex,
        });
      }
    }
  };

  const addTranslateBoxSteps = useCallback((newSteps: StepType[]) => {
    setJoyrideState((prevState) => ({
      ...prevState,
      translateBoxSteps: [...prevState.translateBoxSteps, ...newSteps],
    }));
  }, []);

  const addVocabularyListSteps = useCallback((newSteps: StepType[]) => {
    setJoyrideState((prevState) => ({
      ...prevState,
      vocabularyListSteps: [...prevState.vocabularyListSteps, ...newSteps],
    }));
  }, []);

  useEffect(() => {
    const combinedSteps = [
      ...joyrideState.translateBoxSteps,
      ...joyrideState.vocabularyListSteps,
    ];
    wrapMultiElements(combinedSteps);
    setState((prevState) => ({
      ...prevState,
      joyrideSteps: combinedSteps,
    }));
  }, [joyrideState.translateBoxSteps, joyrideState.vocabularyListSteps]);

  const [rightVisible, setRightVisible] = useState(true);
  const [rightVocabVisible, setRightVocabVisible] = useState(false);
  const [rightExerciseVisible, setRightExerciseVisible] = useState(false);
  const [rightQuizVisible, setRightQuizVisible] = useState(false);
  const [sizes, setSizes] = useState({
    centerWidth: window.innerWidth,
    rightWidth: 0,
    rightVocabWidth: 0,
    rightExerciseWidth: 0,
    rightQuizWidth: 0,
  });

  function formatTime(seconds) {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "00:00"; // Default format if the input is not a number
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad the minutes and seconds with leading zeros if they are less than 10
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  }

  const paginationControlsContainer = (
    <Card
      bodyStyle={{
        paddingTop: "15px",
        paddingBottom: "15px",
      }}
      style={{
        marginBottom: 16,
        borderBottomLeftRadius: "15px",
        borderBottomRightRadius: "15px",
      }}
    >
      <PaginationControls
        currentPage={state.currentPage}
        onShowSizeChange={onShowSizeChange}
        handlePageChange={handlePageChange}
        totalSentences={state.totalSentences}
        sentencesPerPage={state.sentencesPerPage}
      />
    </Card>
  );

  const translateBoxContainer = (
    <>
      {/* <Radio.Group
        style={{
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)", // Shadow applied here
          borderRadius: "15px", // Rounded corners for the group
          width: "auto",
        }}
        size="large"
        className={`${styles.play}`}
      >
        <Radio.Button
          style={{
            pointerEvents: "none",
            borderTopLeftRadius: "15px",
            borderBottomLeftRadius: "15px",
            width: "65px",
            border: "none",
            color: "black",
          }}
        >
          <span style={{ marginLeft: "-3px" }}>
            {formatTime(Math.floor(currentTime))}
          </span>
        </Radio.Button>
        <Radio.Button
          value={state.isPlaying}
          onChange={handlePlayPause}
          style={{
            borderTopRightRadius: "15px",
            borderBottomRightRadius: "15px",
            backgroundColor: "tomato",
            color: "white",
            border: "none",
          }}
        >
          {state.isPlaying ? <span>❚❚</span> : <span>▶</span>}
        </Radio.Button>
      </Radio.Group> */}
      {/* <button className={`${styles.myPlayButton}`} onClick={handlePlayPause}>
        
      </button> */}

      <div>
        {/* <Card
          bodyStyle={{ paddingTop: "20px", paddingBottom: "20px" }}
          style={{
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <Typography.Title level={5}>
                {state.libraryTitle}
              </Typography.Title>
            </div>
            <div>
              <Select
                value={state.selectedLanguageTo}
                onChange={(value) => {
                  dispatch({
                    type: "setSelectedLanguageTo",
                    payload: value,
                  });
                  fetchVocabularyAndSetState(state.sentenceFrom, value);
                  fetchAndUpdate(state.sentenceFrom, value);
                  const url = new URL(window.location.href);
                  const params = new URLSearchParams(url.search);
                  params.set("targetLanguage", value);
                  window.history.replaceState(
                    {},
                    "",
                    `${url.pathname}?${params}`
                  );
                }}
                style={{ marginLeft: 16, fontWeight: 500 }}
              >
                {languagesWithoutSource.map((language, index) => (
                  <Select.Option key={index} value={language}>
                    <SvgIcon code={getFlagCode(language)} height="16" />
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </Card> */}
        <div>
          <Card
            loading={state.loading || state.loadingFromFetch}
            className={styles.translateBoxScroll}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              paddingLeft: "40px",
              paddingTop: "20px",
            }}
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
              highlightedWordIndex={state.highlightedWordIndex}
              selectedLanguageTo={state.selectedLanguageTo}
              onChangeMode={setMode}
              magnifyingGlassRef={magnifyingGlassRef}
              addSteps={addTranslateBoxSteps}
              partOfSpeech={selectedTags}
              isTenseVisible={isTenseVisible}
              isLanding={false}
            />
          </Card>
        </div>
        {state.mode !== "quiz" && paginationControlsContainer}
      </div>
    </>
  );

  const phraseListContainer = (
    <div>
      {state.showVocabularyList &&
        state.vocabularyListUserPhrases?.length !== 0 &&
        state.vocabularyListUserPhrases && (
          <>
            <FilteredVocabularyList
              title="Words"
              mode={"words"}
              phrases={state.vocabularyListUserPhrases!}
              onDeleteItem={handleDeleteUserPhrase}
              onWordClick={() => {}}
              selectedUserPhrase={state.selectedUserPhrase}
              setSelectedUserPhrase={setSelectedUserPhrase}
              selectedLanguageTo={state.selectedLanguageTo}
              style={{
                marginBottom: "16px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                ...((rightVocabVisible && !rightVisible) ||
                (!rightVocabVisible && !rightVisible)
                  ? {
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }
                  : {}),
              }}
              addSteps={addVocabularyListSteps}
            />
            {/* <FilteredVocabularyList
              title="Phrases"
              mode={"phrases"}
              phrases={state.vocabularyListUserPhrases!}
              onDeleteItem={handleDeleteUserPhrase}
              onWordClick={handleAddWordDefinition}
              onQuestionClick={handleQuestionClick}
              onAlternativesClick={handleAlternativesClick}
              selectedLanguageTo={state.selectedLanguageTo}
              style={{ marginBottom: "16px" }}
            /> */}
          </>
        )}
    </div>
  );

  const isMobile = window.innerWidth <= 600;

  const customLocale = {
    last: intl.formatMessage({ id: "joyride.last" }),
    next: intl.formatMessage({ id: "joyride.next" }),
  };

  const [sliderMarginLeft, setSliderMarginLeft] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);

  useEffect(() => {
    function updateSizes() {
      if (rightExerciseVisible) {
        setSizes({
          centerWidth: window.innerWidth * 0.5,
          rightExerciseWidth: window.innerWidth * 0.33,
          rightQuizWidth: 0,
          rightVocabWidth: 0,
          rightWidth: 0,
        });
      } else if (rightVocabVisible && !rightVisible && !rightQuizVisible) {
        setSizes({
          centerWidth: window.innerWidth * 0.5,
          rightVocabWidth: window.innerWidth * 0.33,
          rightQuizWidth: 0,
          rightExerciseWidth: 0,
          rightWidth: 0,
        });
      } else if (!rightVocabVisible && rightVisible && !rightQuizVisible) {
        setSizes({
          centerWidth: window.innerWidth * 0.5,
          rightVocabWidth: 0,
          rightExerciseWidth: 0,
          rightQuizWidth: 0,
          rightWidth: window.innerWidth * 0.33,
        });
      } else if (rightVisible && rightVocabVisible && !rightQuizVisible) {
        setSizes({
          centerWidth: window.innerWidth * 0.5,
          rightVocabWidth: window.innerWidth * 0.3312,
          rightExerciseWidth: 0,
          rightQuizWidth: 0,
          rightWidth: window.innerWidth * 0.33,
        });
      } else if (!rightVisible && !rightVocabVisible && !rightQuizVisible) {
        setSizes({
          centerWidth: window.innerWidth * 0.7,
          rightVocabWidth: 0,
          rightExerciseWidth: 0,
          rightQuizWidth: 0,
          rightWidth: 0,
        });
      } else if (rightQuizVisible) {
        setSizes({
          centerWidth: window.innerWidth * 0.5,
          rightQuizWidth: window.innerWidth * 0.3312,
          rightExerciseWidth: 0,
          rightVocabWidth: 0,
          rightWidth: 0,
        });
      } else {
        setSizes({
          centerWidth: window.innerWidth * 0.7,
          rightWidth: 0,
          rightExerciseWidth: 0,
          rightQuizWidth: 0,
          rightVocabWidth: 0,
        });
      }
    }

    window.addEventListener("resize", updateSizes);
    updateSizes();

    return () => {
      window.removeEventListener("resize", updateSizes);
    };
  }, [
    rightVisible,
    rightVocabVisible,
    rightExerciseVisible,
    rightQuizVisible,
    marginLeft,
  ]);

  useEffect(() => {
    if (
      !rightVisible &&
      !rightVocabVisible &&
      !rightExerciseVisible &&
      !rightQuizVisible
    ) {
      setMarginLeft(-30);
      setSliderMarginLeft(225);
    } else {
      setMarginLeft(-28);
      setSliderMarginLeft(80);
    }
  }, [rightVisible, rightVocabVisible, rightExerciseVisible, rightQuizVisible]);

  const toggleRightPanel = () => {
    if (rightExerciseVisible) {
      setRightExerciseVisible(!rightExerciseVisible);
      setRightQuizVisible(!rightQuizVisible);
      setRightVisible(!rightVisible);
    } else {
      setRightVisible(!rightVisible);
    }
  };

  const toggleRightVocabPanel = () => {
    setRightVocabVisible((prev) => !prev);

    if (rightExerciseVisible) {
      setRightExerciseVisible(!rightExerciseVisible);
      setRightQuizVisible(!rightQuizVisible);
      setRightVocabVisible(!rightVocabVisible);
    } else {
      setRightVocabVisible(!rightVocabVisible);
    }
  };

  const toggleRightExercisePanel = () => {
    setRightExerciseVisible(!rightExerciseVisible);
  };

  const toggleRightQuizPanel = () => {
    setRightQuizVisible(!rightQuizVisible);
  };

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const libraryIdsMusk = [
    { libraryId: "66d8865b20c573b77399f733", speaker: 1 },
    { libraryId: "66d8868020c573b77399fa7f", speaker: 1 },
    { libraryId: "66d8cd1da32ca5da2044c52d", speaker: 1 },
    { libraryId: "66d8cfe3a81ebf0bbdb995b4", speaker: 0 },
    { libraryId: "66d98c1a6df3038aa08e2e37", speaker: 0 },
  ];

  const [wordTriplesMusk, setWordTriplesMusk] = useState<WordTriple[]>([]);

  const getWordCloudOptions = useCallback(
    (wordTriples: WordTriple[]) => ({
      tooltip: {},
      series: [
        {
          type: "wordCloud",
          gridSize: 2,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          shape: "circle",
          width: "100%",
          height: "100%",
          textStyle: {
            normal: {
              color: () =>
                `rgb(${[
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                ].join(",")})`,
            },
          },
          data: wordTriples.map((triple) => ({
            name: triple.wordTriple, // Triple text
            value: triple.count, // Triple count
          })),
        },
      ],
    }),
    [libraryId]
  );

  const memoizedWordCloudOptions = useMemo(
    () => getWordCloudOptions(wordTriplesMusk),
    [wordTriplesMusk, getWordCloudOptions]
  );

  useEffect(() => {
    const fetchTriples = async () => {
      try {
        // Fetch Musk triples
        const dataMusk = await getTriples([
          { libraryId: "663f4c63746b77af97f93edf", speaker: 1 },
        ]);
        const parsedDataMusk = JSON.parse(dataMusk);
        setWordTriplesMusk(parsedDataMusk);
      } catch (err: any) {}
    };

    fetchTriples();
  }, []);

  useEffect(() => {
    if (chartRef1.current) {
      const chart = chartRef1.current.getEchartsInstance();
      chart.setOption(memoizedWordCloudOptions);
    }
  }, [memoizedWordCloudOptions]);

  const partsOfSpeech = [
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "conjunction",
    "interjection",
  ];

  return (
    <PageContainer
      title={false}
      className={`${styles.container} ${
        isDropdownActive && `${styles.blurred}`
      }`}
    >
      {/* {user.newUser && (
        <Joyride
          key={joyrideState.translateBoxSteps.length}
          continuous
          run={run}
          disableScrolling
          hideCloseButton
          showProgress
          showSkipButton
          steps={[
            ...joyrideState.translateBoxSteps,
            ...joyrideState.vocabularyListSteps,
          ]}
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          styles={joyrideStyles}
          locale={customLocale}
        />
      )} */}
      {state.isLimitExceeded && user.subscribed === false && !hasAccess ? (
        <Modal open={true} closable={true} footer={false} width="80%" centered>
          <center>
            <Typography.Title style={{ marginTop: "30px" }}>
              You have exceeded your daily limit of either 5 minutes of viewing
              or 5 phrase meanings/alternatives. To continue, please subscribe,
              or wait for 3 hours to reset your limit:
            </Typography.Title>
          </center>
          <PricingComponent />
        </Modal>
      ) : (
        <>
          {!isMobile ? (
            <Row>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "70.4vh",
                }}
              >
                <Slider.Root
                  className={`${styles.sliderRoot}`}
                  value={[currentTime]}
                  onValueChange={handleSliderChange}
                  max={state.library?.duration}
                  orientation="vertical"
                  step={0.1}
                  style={{
                    marginLeft: `${sliderMarginLeft}px`,
                    marginRight: "0px",
                    marginTop: "55px",
                    marginBottom: "-120px",
                    zIndex: 88,
                  }}
                  inverted={true}
                >
                  <Slider.Track className={`${styles.sliderTrack}`}>
                    <Slider.Range className={`${styles.sliderRange}`} />
                  </Slider.Track>
                  <Slider.Thumb
                    className={`${styles.sliderThumb}`}
                    aria-label="Volume"
                  />
                </Slider.Root>
                <Resizable
                  size={{ width: sizes.centerWidth, height: "auto" }}
                  style={{
                    transition: "all 0.5s",
                    marginLeft: `${marginLeft}px`,
                    marginRight: "10px",
                  }}
                  enable={{ right: true }}
                >
                  {translateBoxContainer}
                  <FloatButton.Group
                    shape="square"
                    //style={{ right: 20, bottom: 580 }}
                    style={{
                      right: 20,
                      /* bottom: `${
                        state.vocabularyListUserPhrases?.length !== 0
                          ? 580
                          : 630
                      }px`, */
                    }}
                  >
                    <FloatButton
                      icon={<YoutubeOutlined />}
                      type={rightVisible ? "primary" : "default"}
                      onClick={() => {
                        toggleRightPanel();
                        setRightVocabVisible(false);
                        setRightQuizVisible(false);
                      }}
                      style={{
                        fontSize: "20px",
                        padding: "10px 10px",
                        width: "50px",
                      }}
                    />
                    {state.vocabularyListUserPhrases?.length !== 0 && (
                      <FloatButton
                        icon={<UnorderedListOutlined />}
                        type={rightVocabVisible ? "primary" : "default"}
                        onClick={() => {
                          toggleRightVocabPanel();
                          setRightExerciseVisible(false);
                          setRightQuizVisible(false);
                        }}
                        style={{
                          fontSize: "20px",
                          padding: "10px 10px",
                          width: "50px",
                        }}
                      />
                    )}
                    <FloatButton
                      type={rightExerciseVisible ? "primary" : "default"}
                      onClick={() => {
                        toggleRightExercisePanel();
                        setRightVisible(false);
                        setRightVocabVisible(false);
                        setRightQuizVisible(false);
                      }}
                      style={{
                        fontSize: "20px",
                        padding: "10px 10px",
                        width: "50px",
                      }}
                    />
                    <FloatButton
                      icon={<QuestionOutlined />}
                      type={rightQuizVisible ? "primary" : "default"}
                      onClick={() => {
                        toggleRightQuizPanel();
                        setRightVisible(false);
                        setRightVocabVisible(false);
                        setRightExerciseVisible(false);
                      }}
                      style={{
                        fontSize: "20px",
                        padding: "10px 10px",
                        width: "50px",
                      }}
                    />
                  </FloatButton.Group>

                  {/* <Button
                    onClick={toggleRightPanel}
                    className={`${styles.stickyButton}`}
                    type="primary"
                    style={{ backgroundColor: "tomato" }}
                    size="large"
                  >
                    Video
                  </Button>
                  {state.showVocabularyList &&
                    state.vocabularyListUserPhrases?.length !== 0 && (
                      <Button
                        onClick={toggleRightVocabPanel}
                        className={`${styles.videoStickyButton}`}
                        type="primary"
                        size="large"
                      >
                        Vocabulary
                      </Button>
                    )}
                  <Button
                    onClick={toggleRightExercisePanel}
                    className={`${styles.exerciseStickyButton}`}
                    type="primary"
                    style={{ backgroundColor: "Steelblue" }}
                    size="large"
                  >
                    Exercise
                  </Button>
                  <Button
                    onClick={toggleRightQuizPanel}
                    className={`${styles.quizStickyButton}`}
                    type="primary"
                    style={{ backgroundColor: "Olive" }}
                    size="large"
                  >
                    Quiz
                  </Button> */}
                </Resizable>
                <Resizable
                  size={{ width: sizes.rightExerciseWidth, height: "720px" }}
                  className={`${styles.resizableContainer}`}
                  style={{
                    transition: "all 0.5s",
                    marginLeft: "15px",
                    marginRight: "10px",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                  enable={{ right: true }}
                >
                  <Card
                    style={{
                      height: "690px",
                      overflow: "auto",
                      borderBottomLeftRadius: "15px",
                      borderBottomRightRadius: "15px",
                    }}
                  >
                    <Radio.Group
                      style={{
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15",
                        borderRadius: "15px",
                        width: "auto",
                      }}
                      size="large"
                    >
                      <Radio.Button
                        style={{
                          pointerEvents: "none",
                          borderTopLeftRadius: "15px",
                          borderBottomLeftRadius: "15px",
                          width: "65px",
                          border: "none",
                          color: "black",
                        }}
                      >
                        <span style={{ marginLeft: "-3px" }}>
                          {formatTime(Math.floor(currentTime))}
                        </span>
                      </Radio.Button>
                      <Radio.Button
                        value={state.isPlaying}
                        onChange={handlePlayPause}
                        style={{
                          borderTopRightRadius: "15px",
                          borderBottomRightRadius: "15px",
                          backgroundColor: "tomato",
                          color: "white",
                          border: "none",
                        }}
                      >
                        {state.isPlaying ? <span>❚❚</span> : <span>▶</span>}
                      </Radio.Button>
                    </Radio.Group>
                    <Divider />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "460px",
                      }}
                    >
                      {partsOfSpeech.map((tag) => (
                        <Tag.CheckableTag
                          key={tag}
                          checked={selectedTags.includes(tag)}
                          onChange={(checked) => handleChange(tag, checked)}
                          style={{
                            margin: "4px",
                            padding: "8px 15px",
                            fontSize: "16px",
                            borderRadius: "10px",
                            backgroundColor: selectedTags.includes(tag)
                              ? "#4CAF50"
                              : "Gainsboro",
                            transition: "none",
                          }}
                        >
                          {tag}
                        </Tag.CheckableTag>
                      ))}
                    </div>
                    <Divider />
                    <Button
                      onClick={toggleIsTenseVisible}
                      size={"large"}
                      style={{
                        marginLeft: "5px",
                        borderRadius: "10px",
                        backgroundColor: isTenseVisible
                          ? "#4CAF50"
                          : "Gainsboro",
                        color: isTenseVisible ? "white" : "black",
                      }}
                    >
                      Tense
                    </Button>
                    <Divider />
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <h4>Musk</h4>
                        <ReactECharts
                          ref={chartRef1}
                          option={memoizedWordCloudOptions}
                          style={{ width: "200%" }}
                        />
                      </Col>
                    </Row>
                    {/* <List
                      style={{ width: "430px" }}
                      dataSource={state.library?.questions}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Typography.Text>
                            Q{index + 1}: {item}
                          </Typography.Text>
                        </List.Item>
                      )}
                    /> */}
                    {/* <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {Object.entries(tensesCategory).map(
                        ([category, tenses]) => (
                          <div
                            key={category}
                            style={{
                              display: "flex", // Using flex to manage layout
                              flexWrap: "wrap", // Allows wrapping to next line
                              width: "460px", // Maintain fixed width for consistent non-responsive behavior
                              marginBottom: "20px", // Space between categories
                            }}
                          >
                            <h4>{category}</h4>
                            {tenses.map((tag) => (
                              <Tag.CheckableTag
                                key={tag}
                                checked={selectedTags.includes(tag)}
                                onChange={(checked) =>
                                  handleChange(tag, checked)
                                }
                                style={{
                                  margin: "4px",
                                  padding: "5px 7px",
                                  fontSize: "14px",
                                  borderRadius: "5px",
                                  backgroundColor: selectedTags.includes(tag)
                                    ? "#4CAF50"
                                    : "Gainsboro",
                                  transition: "none",
                                }}
                              >
                                {tag}
                              </Tag.CheckableTag>
                            ))}
                          </div>
                        )
                      )}
                    </div> */}
                  </Card>
                </Resizable>
                <Resizable
                  size={{ width: sizes.rightQuizWidth, height: "720px" }}
                  className={`${styles.resizableContainer}`}
                  style={{
                    transition: "all 0.5s",
                    marginLeft: "-10px",
                    marginRight: "10px",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                  enable={{ right: true }}
                >
                  <Card
                    style={{
                      overflowY: "auto",
                      height: "calc(82.5vh)",
                      borderBottomLeftRadius: "15px",
                      borderBottomRightRadius: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Using flex to manage layout
                        flexWrap: "wrap", // Allows wrapping to next line
                        width: "460px",
                      }}
                    >
                      <QuizComponent
                        sourceLanguage={sourceLanguage}
                        libraryId={libraryId}
                        snapshot={memoizedSnapshots?.find(
                          (snapshot) => snapshot.language === "en"
                        )}
                      />
                    </div>
                  </Card>
                </Resizable>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Resizable
                    size={{
                      width: sizes.rightWidth,
                      height: rightVisible ? "360px" : "0px",
                    }}
                    className={`${styles.resizableContainer}
                    }`}
                    style={{
                      transition: "all 0.5s",
                      marginLeft: "-1px",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                    enable={{
                      left: true,
                    }}
                  >
                    {videoContainer}
                  </Resizable>
                  <Resizable
                    size={{
                      width: sizes.rightVocabWidth,
                      height: rightVocabVisible ? "378" : "0px",
                    }} // Adjust accordingly
                    className={`${styles.resizableContainer} 
                    }`}
                    style={{
                      transition: "all 0.5s",
                      marginLeft: "-2px",
                      borderBottomLeftRadius: "15px",
                      borderBottomRightRadius: "15px",
                    }}
                    enable={{
                      left: true,
                      top: false,
                      right: true,
                      bottom: true,
                    }}
                  >
                    {phraseListContainer}
                  </Resizable>
                </div>
              </div>
            </Row>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              <Row>
                {videoContainer}
                {translateBoxContainer}

                {paginationControlsContainer}
              </Row>
              <button
                className={`${styles.myFixedPlayButton}`}
                onClick={handlePlayPause}
              >
                {state.isPlaying ? "❚❚" : "▶"}
              </button>
              {phraseListContainer}
            </Masonry>
          )}
        </>
      )}
      {/* <SelectLang
        //setDropdownActive={setDropdownActive}
        uniqueLanguages={uniqueLanguages}
      /> */}
    </PageContainer>
  );
};

export default BookDetail;
