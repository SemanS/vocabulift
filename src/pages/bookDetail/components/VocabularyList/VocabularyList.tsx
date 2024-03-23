import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import { Button, Card, List, Select, Space, Tabs } from "antd";
import {
  CaretRightOutlined,
  CommentOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import "./VocabularyList.css";
import {
  getPhraseAlternatives,
  getPhraseMeaning,
  textToSpeech,
  updateUser,
} from "@/services/userService";
import { notification } from "antd";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { parseLocale } from "@/utils/stringUtils";
import usePressHandlers from "@/hooks/userPressHandlers";
import { Tooltip } from "antd";
import CustomSpinnerComponent from "@/pages/spinner/CustomSpinnerComponent";
import { SubscriptionType, User } from "@/models/user";
import { useIntl } from "react-intl";
import { AxiosError } from "axios";
import { getFlagCode } from "@/utils/utilMethods";
import { SvgIcon } from "@/pages/webLayout/shared/common/SvgIcon";
import { languages } from "@/utils/languages";
import { triggerState } from "@/stores/joyride";
import { Link } from "react-router-dom";

const TabPane = Tabs.TabPane;

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoadingFromWordMeaning":
      return { ...state, loadingFromWordMeaning: action.payload };
    case "setWordMeaningData":
      return { ...state, wordMeaningData: action.payload };
    case "setLoadingFromWordAlternatives":
      return { ...state, loadingFromWordAlternatives: action.payload };
    case "setWordAlternativesData":
      return { ...state, wordAlternativesData: action.payload };
    case "setDisableMeanings":
      return { ...state, disableMeanings: action.payload };
    case "setDisableAlternatives":
      return { ...state, disableAlternatives: action.payload };
    default:
      return state;
  }
};

interface VocabularyListProps {
  mode: string;
  title: string;
  style: React.CSSProperties | undefined;
  phrases: VocabularyListUserPhrase[] | undefined;
  onDeleteItem: (
    phraseId: string,
    sentenceId: string,
    startPosition: number,
    sentenceNo: number
  ) => void;
  onWordClick?: (word: string) => void;
  selectedUserPhrase?: VocabularyListUserPhrase | null;
  setSelectedUserPhrase: (
    vocabularyListUserPhrase: VocabularyListUserPhrase
  ) => void;
  selectedLanguageTo: string;
  addSteps: any;
}

const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

const VocabularyList: FC<VocabularyListProps> = ({
  mode,
  title,
  style,
  phrases,
  onDeleteItem,
  onWordClick,
  selectedUserPhrase,
  setSelectedUserPhrase,
  selectedLanguageTo,
  addSteps,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [prevPhrasesLength, setPrevPhrasesLength] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [onMobile, setOnMobile] = useState(isMobile());
  const [user, setUser] = useRecoilState(userState);
  const [activeTab, setActiveTab] = useState("1");
  const [deletedPhraseId, setDeletedPhraseId] = useState<string | null>(null);

  const intl = useIntl();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    loadingFromWordAlternatives: false,
    loadingFromWordMeaning: false,
    wordMeaningData: null,
    wordAlternativesData: null,
    disableMeanings: false,
    disableAlternatives: false,
  });

  const [trigger, setTrigger] = useRecoilState(triggerState);

  useEffect(() => {
    if (trigger.shouldTrigger) {
      handleQuestionClick("taka", "sk");
      setTrigger({ shouldTrigger: false, params: {} });
    }
  }, [trigger, setTrigger]);

  useEffect(() => {
    const vocabularyListSteps = [
      {
        content: (
          <div>
            Cool, you've made it to the next stage! Quick tip: you've got the
            power to switch up the language settings right at the top right
            corner, so it matches your vibe. <br />
            <br />
            And if you're itching to dig into what a word or phrase means, just
            click on the question mark. It's all set up to make things super
            easy for you. Let's keep this learning adventure going!
          </div>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        placement: "bottom",
        spotlightClicks: false,
        target: ".wordMeaning",
        title: "Uncover meanings",
        showSkipButton: false,
        hideBackButton: true,
      },
      {
        content: (
          <div>
            Here we are at the final step. You've experienced how words and
            phrases unfold in your native language—pretty cool, right? It's all
            designed to personalize your learning experience. While we've
            covered the basics of Vocabulift, there's still more for you to
            discover independently. Now, I'll let you explore further. Feel free
            to dive in and see what else there is to learn. Remember, learning
            is a continuous journey.
            <br />
            <br /> Enjoy digging into it at your own pace!
            <br />
            <br /> Also, if you have any feedback or suggestions, our team would
            love to hear from you. Your insights are valuable to us and could
            inspire our next big feature. So, don't hesitate to reach out.
            <br />
            <br />
            <Link to="/#contact">Contact us</Link>
          </div>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        placement: "bottom",
        spotlightClicks: true,
        target: ".meaning-tab",
        title: "Starting Your Learning Journey",
        showSkipButton: false,
        hideBackButton: true,
      },
    ];

    addSteps(vocabularyListSteps);
  }, [addSteps]);

  const longPressQuestionAction = () =>
    notification.info({
      message: "Information",
      description: "This is a question icon.",
    });

  const longPressAlternativesAction = () =>
    notification.info({
      message: "Information",
      description: "This is a question icon.",
    });

  const pressQuestionHandlers = usePressHandlers(longPressQuestionAction, 500);

  const pressAlternativesHandlers = usePressHandlers(
    longPressQuestionAction,
    500
  );

  const filteredPhrases = phrases!.filter(
    (phrase) => phrase.phrase.endPosition - phrase.phrase.startPosition > 0
  );

  const filteredWords = phrases!.filter(
    (phrase) => phrase.phrase.endPosition - phrase.phrase.startPosition === 0
  );

  const handleQuestionClick = async (phrase: string, languageTo: string) => {
    try {
      const nativeLanguage = parseLocale(user.locale);
      setActiveTab("3");
      dispatch({ type: "setLoadingFromWordMeaning", payload: true });
      const meaning = await getPhraseMeaning(
        phrase,
        user.languageForMeaning,
        languageTo
      );
      dispatch({ type: "setLoadingFromWordMeaning", payload: false });
      dispatch({ type: "setWordMeaningData", payload: meaning });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error occurred:", error);
      if (axiosError.response && axiosError.response.status === 400) {
        dispatch({ type: "disableMeanings", payload: true });
      }
      notification.error({
        message: "Error",
        description:
          "You exceeded your daily limit. Please, subscribe or wait 3 hours.",
      });
      //dispatch({ type: "setWordMeaningData", payload: "An error occurred." });
    }
  };

  const handleAlternativesClick = async (
    phrase: string,
    languageTo: string
  ) => {
    try {
      //const nativeLanguage = parseLocale(user.locale);
      setActiveTab("4");
      dispatch({ type: "setLoadingFromWordAlternatives", payload: true });
      const alternatives = await getPhraseAlternatives(
        phrase,
        user.languageForMeaning,
        languageTo
      );
      dispatch({ type: "setLoadingFromWordAlternatives", payload: false });
      dispatch({ type: "setWordAlternativesData", payload: alternatives });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error occurred:", error);
      if (axiosError.response && axiosError.response.status === 400) {
        dispatch({ type: "disableAlternatives", payload: true });
      }
      notification.error({
        message: "Error",
        description:
          "You exceeded your daily limit. Please, subscribe or wait 3 hours.",
      });
      /* dispatch({
        type: "setWordAlternativesData",
        payload: "An error occurred.",
      }); */
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handlePlayClick = async (text: string, language: string) => {
    console.log("handulujem");
    const audioUrl = await textToSpeech(text, language);

    const audio = audioRef.current;
    if (audio) {
      audio.src = audioUrl!;
      audio.playbackRate = 1;
      audio.play();
    }
  };

  const handleWordClick = async (
    word: VocabularyListUserPhrase
  ): Promise<any> => {
    activeTab === "1" && onWordClick && onWordClick(word.phrase.sourceText);
    activeTab === "1" && setSelectedWord(word.phrase.sourceText);
    activeTab === "1" && setSelectedUserPhrase(word);
  };

  const handleDeleteItem = async (
    phraseId: string,
    sentenceId: string,
    startPosition: number,
    sentenceNo: number
  ) => {
    onDeleteItem(phraseId, sentenceId, startPosition, sentenceNo);
    setDeletedPhraseId(phraseId);
  };

  useEffect(() => {
    if (user.meanings > 1) {
      dispatch({ type: "setDisableMeanings", payload: true });
    }
    if (user.alternatives > 1) {
      dispatch({ type: "setDisableAlternatives", payload: true });
    }
    if (phrases![0] !== undefined || phrases![0] !== null) {
      if (
        phrases![0].phrase.endPosition - phrases![0].phrase.startPosition >
        0
      ) {
        setActiveTab("2");
      } else {
        setActiveTab("1");
      }
    }
  }, []);

  useEffect(() => {
    if (phrases) {
      const remainingPhrases = deletedPhraseId
        ? phrases.filter((phrase) => phrase.phrase._id !== deletedPhraseId)
        : phrases;

      const hasZeroLengthWords = remainingPhrases.some(
        (phrase) =>
          phrase.phrase!.endPosition! - phrase.phrase?.startPosition! === 0
      );

      const hasZeroLengthPhrases = remainingPhrases.some(
        (phrase) =>
          phrase.phrase!.endPosition! - phrase.phrase?.startPosition! > 0
      );

      if (hasZeroLengthWords && !hasZeroLengthPhrases) {
        setActiveTab("1");
      } else if (!hasZeroLengthWords && hasZeroLengthPhrases) {
        setActiveTab("2");
      }

      setDeletedPhraseId(null); // Reset deletedPhraseId after checking
    }
  }, [phrases, deletedPhraseId]);

  useEffect(() => {
    if (selectedUserPhrase) {
      selectedUserPhrase?.phrase!.endPosition! -
        selectedUserPhrase?.phrase?.startPosition! ===
      0
        ? setActiveTab("1")
        : setActiveTab("2");
    }
  }, [selectedUserPhrase]);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    } else if (phrases && phrases.length > prevPhrasesLength) {
      const lastItemIndex = phrases.length - 1;
      itemRefs.current[lastItemIndex]?.scrollIntoView({ behavior: "smooth" });
    }

    if (phrases) {
      setPrevPhrasesLength(phrases.length);
    }
  }, [phrases]);

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

  const hasAccess = users.some(
    (existingUser) => existingUser.email === user.email
  );

  const handleLanguageChange = async (newLanguage: string) => {
    const updatedUserEntity: Partial<User> = {
      languageForMeaning: newLanguage,
    };

    try {
      await updateUser(updatedUserEntity);
      setUser((prevUser) => ({
        ...prevUser,
        languageForMeaning: newLanguage,
      }));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Card style={style} bodyStyle={{ padding: 0 }}>
      <Tabs
        className="meaning-tab"
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarStyle={{ paddingLeft: 25, paddingRight: 25 }}
        tabBarExtraContent={
          <Select
            value={user.languageForMeaning || user.targetLanguage}
            onChange={(newValue) => handleLanguageChange(newValue)}
          >
            {languages.map((language, index) => (
              <Select.Option key={index} value={language.code}>
                <SvgIcon code={getFlagCode(language.code)} height="16" />
              </Select.Option>
            ))}
          </Select>
        }
      >
        {filteredWords.length > 0 && (
          <TabPane
            tab={intl.formatMessage({ id: "vocabulary.list.words" })}
            key="1"
          >
            <div className="vocabularyListScroll">
              <div
                style={{ paddingTop: 10, paddingRight: 25, paddingLeft: 25 }}
              >
                <List
                  size="small"
                  dataSource={filteredWords}
                  renderItem={(
                    word: VocabularyListUserPhrase,
                    index: number
                  ) => {
                    return (
                      <List.Item
                        key={word.sentenceNo + word.phrase.startPosition}
                        style={{ padding: "4px 0" }}
                        onClick={() => {
                          activeTab === "1" &&
                            onWordClick &&
                            onWordClick(word.phrase.sourceText);
                          activeTab === "1" &&
                            setSelectedWord(word.phrase.sourceText);
                          //activeTab === "1" && setSelectedUserPhrase(word);
                        }}
                      >
                        {(activeTab === "2" || activeTab === "1") &&
                          onMobile && (
                            <List.Item.Meta
                              style={{ display: "flex", alignItems: "center" }}
                              title={
                                <div>
                                  <div
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    style={{
                                      fontWeight: "normal",
                                      cursor:
                                        activeTab === "2"
                                          ? "default"
                                          : "pointer",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                        marginBottom: 10,
                                        marginRight: 5,
                                      }}
                                      onClick={() => {
                                        togglePlay;
                                        handlePlayClick(
                                          word.phrase.sourceText,
                                          word.phrase.sourceLanguage
                                        );
                                      }}
                                    >
                                      <span style={{ fontWeight: 600 }}>
                                        {word.phrase.sourceText}
                                      </span>
                                      <CaretRightOutlined
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.sourceText,
                                            word.phrase.sourceLanguage
                                          );
                                        }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                        paddingLeft: "10px",
                                        borderLeft: "1px solid #000",
                                      }}
                                    >
                                      <span style={{ fontWeight: 600 }}>
                                        {word.phrase.targetText}
                                      </span>
                                      <CaretRightOutlined
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.targetText,
                                            parseLocale(user.locale)
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <audio key="audio" ref={audioRef} />
                                  <div
                                    style={{
                                      textAlign: "left",
                                      width: "50%",
                                      marginBottom: 20,
                                    }}
                                    onClick={() => {
                                      togglePlay;
                                      handlePlayClick(
                                        word.phrase.targetText,
                                        parseLocale(user.locale)
                                      );
                                    }}
                                  >
                                    <Space>
                                      <Button
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleDeleteItem(
                                            word.phrase._id,
                                            word.phrase.sentenceId,
                                            word.phrase.startPosition,
                                            word.sentenceNo
                                          )
                                        }
                                      />
                                      {/* parseLocale(user.locale) !==
                                        word.phrase.sourceLanguage && */}
                                      {(user.subscriptionType !==
                                        SubscriptionType.Free ||
                                        hasAccess ||
                                        !state.disableMeanings) && (
                                        <>
                                          <Tooltip
                                            title={intl.formatMessage({
                                              id: "vocabulary.list.meaning",
                                            })}
                                          >
                                            <Button
                                              type="default"
                                              icon={<QuestionCircleOutlined />}
                                              onClick={() =>
                                                handleQuestionClick(
                                                  word.phrase.sourceText,
                                                  word.phrase.sourceLanguage
                                                )
                                              }
                                              {...pressQuestionHandlers}
                                              className={"noselect"}
                                            />
                                          </Tooltip>
                                          <Tooltip
                                            title={intl.formatMessage({
                                              id: "vocabulary.list.alternatives",
                                            })}
                                          >
                                            <Button
                                              type="default"
                                              icon={<CommentOutlined />}
                                              onClick={() =>
                                                handleAlternativesClick(
                                                  word.phrase.sourceText,
                                                  word.phrase.sourceLanguage
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        </>
                                      )}
                                      {
                                        /* parseLocale(user.locale) !==
                                        word.phrase.targetLanguage && */
                                        (user.subscriptionType !==
                                          SubscriptionType.Free ||
                                          hasAccess ||
                                          !state.disableAlternatives) && (
                                          <>
                                            <Button
                                              type="default"
                                              icon={<QuestionCircleOutlined />}
                                              onClick={() =>
                                                handleQuestionClick(
                                                  word.phrase.sourceText,
                                                  word.phrase.targetLanguage
                                                )
                                              }
                                              {...pressQuestionHandlers}
                                              className={"noselect"}
                                            />
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.alternatives",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={<CommentOutlined />}
                                                onClick={() =>
                                                  handleAlternativesClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                                {...pressAlternativesHandlers}
                                                className={"noselect"}
                                              />
                                            </Tooltip>
                                          </>
                                        )
                                      }
                                    </Space>
                                  </div>
                                </div>
                              }
                            />
                          )}
                        {(activeTab === "2" || activeTab === "1") &&
                          !onMobile && (
                            <List.Item.Meta
                              style={{ display: "flex", alignItems: "center" }}
                              title={
                                <div>
                                  <div
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    style={{
                                      fontWeight: "normal",
                                      cursor:
                                        activeTab === "2"
                                          ? "default"
                                          : "pointer",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Space>
                                      <Button
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleDeleteItem(
                                            word.phrase._id,
                                            word.phrase.sentenceId,
                                            word.phrase.startPosition,
                                            word.sentenceNo
                                          )
                                        }
                                      />
                                      {
                                        /* parseLocale(user.locale) !==
                                        word.phrase.sourceLanguage && */
                                        (user.subscriptionType !==
                                          SubscriptionType.Free ||
                                          hasAccess ||
                                          !state.disableMeanings) && (
                                          <>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.meaning",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={
                                                  <QuestionCircleOutlined />
                                                }
                                                onClick={() =>
                                                  handleQuestionClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.sourceLanguage
                                                  )
                                                }
                                              />
                                            </Tooltip>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.alternatives",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={<CommentOutlined />}
                                                onClick={() =>
                                                  handleAlternativesClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.sourceLanguage
                                                  )
                                                }
                                              />
                                            </Tooltip>
                                          </>
                                        )
                                      }
                                    </Space>
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "right",
                                        paddingRight: "20px",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                      }}
                                      onClick={() => {
                                        togglePlay;
                                        handlePlayClick(
                                          word.phrase.sourceText,
                                          word.phrase.sourceLanguage
                                        );
                                      }}
                                    >
                                      {word.phrase.sourceText}
                                      <CaretRightOutlined
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.sourceText,
                                            word.phrase.sourceLanguage
                                          );
                                        }}
                                        style={{ marginLeft: "5px" }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                        paddingLeft: "20px",
                                        borderLeft: "1px solid #000",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                      }}
                                      onClick={() => {
                                        togglePlay;
                                        handlePlayClick(
                                          word.phrase.targetText,
                                          word.phrase.targetLanguage
                                        );
                                      }}
                                    >
                                      {word.phrase.targetText}
                                      <CaretRightOutlined
                                        style={{ marginLeft: "5px" }}
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.targetText,
                                            word.phrase.targetLanguage
                                          );
                                        }}
                                      />
                                    </div>
                                    <audio key="audio" ref={audioRef} />
                                    <Space>
                                      {
                                        /* parseLocale(user.locale) !==
                                        word.phrase.targetLanguage && */
                                        (user.subscriptionType !==
                                          SubscriptionType.Free ||
                                          hasAccess ||
                                          !state.disableMeanings) && (
                                          <>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.meaning",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={
                                                  <QuestionCircleOutlined />
                                                }
                                                onClick={() =>
                                                  handleQuestionClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                                {...pressQuestionHandlers}
                                                className={"noselect"}
                                              />
                                            </Tooltip>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.alternatives",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={<CommentOutlined />}
                                                onClick={() =>
                                                  handleAlternativesClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                              />
                                            </Tooltip>
                                          </>
                                        )
                                      }
                                    </Space>
                                  </div>
                                </div>
                              }
                            />
                          )}
                      </List.Item>
                    );
                  }}
                />
              </div>
            </div>
          </TabPane>
        )}
        {filteredPhrases.length > 0 && (
          <TabPane
            tab={intl.formatMessage({ id: "vocabulary.list.phrases" })}
            key="2"
          >
            <div className="vocabularyListScroll">
              <div
                style={{ paddingTop: 10, paddingRight: 25, paddingLeft: 25 }}
              >
                <List
                  size="small"
                  dataSource={filteredPhrases}
                  renderItem={(
                    word: VocabularyListUserPhrase,
                    index: number
                  ) => {
                    return (
                      <List.Item
                        key={word.sentenceNo + word.phrase.startPosition}
                        style={{ padding: "4px 0" }}
                        onClick={() => {
                          activeTab === "1" &&
                            onWordClick &&
                            onWordClick(word.phrase.sourceText);
                          activeTab === "1" &&
                            setSelectedWord(word.phrase.sourceText);
                          //activeTab === "1" && setSelectedUserPhrase(word);
                        }}
                      >
                        {(activeTab === "2" || activeTab === "1") &&
                          onMobile && (
                            <List.Item.Meta
                              style={{ display: "flex", alignItems: "center" }}
                              title={
                                <div>
                                  <div
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    style={{
                                      fontWeight: "normal",
                                      cursor:
                                        activeTab === "2"
                                          ? "default"
                                          : "pointer",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                        marginBottom: 10,
                                        marginRight: 5,
                                      }}
                                      onClick={() => {
                                        togglePlay;
                                        handlePlayClick(
                                          word.phrase.sourceText,
                                          word.phrase.sourceLanguage
                                        );
                                      }}
                                    >
                                      <span style={{ fontWeight: 600 }}>
                                        {word.phrase.sourceText}
                                      </span>
                                      <CaretRightOutlined
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.sourceText,
                                            word.phrase.sourceLanguage
                                          );
                                        }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                        paddingLeft: "10px",
                                        borderLeft: "1px solid #000",
                                      }}
                                    >
                                      <span style={{ fontWeight: 600 }}>
                                        {word.phrase.targetText}
                                      </span>
                                      <CaretRightOutlined
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.targetText,
                                            parseLocale(user.locale)
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <audio key="audio" ref={audioRef} />
                                  <div
                                    style={{
                                      textAlign: "left",
                                      width: "50%",
                                      marginBottom: 20,
                                    }}
                                    onClick={() => {
                                      togglePlay;
                                      handlePlayClick(
                                        word.phrase.targetText,
                                        parseLocale(user.locale)
                                      );
                                    }}
                                  >
                                    <Space>
                                      <Button
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleDeleteItem(
                                            word.phrase._id,
                                            word.phrase.sentenceId,
                                            word.phrase.startPosition,
                                            word.sentenceNo
                                          )
                                        }
                                      />
                                      {
                                        /* parseLocale(user.locale) !==
                                        word.phrase.targetLanguage && */
                                        (user.subscriptionType !==
                                          SubscriptionType.Free ||
                                          hasAccess ||
                                          !state.disableMeanings) && (
                                          <>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.meaning",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={
                                                  <QuestionCircleOutlined />
                                                }
                                                onClick={() =>
                                                  handleQuestionClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.sourceLanguage
                                                  )
                                                }
                                                {...pressQuestionHandlers}
                                                className={"noselect"}
                                              />
                                            </Tooltip>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.alternatives",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={<CommentOutlined />}
                                                onClick={() =>
                                                  handleAlternativesClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.sourceLanguage
                                                  )
                                                }
                                                {...pressAlternativesHandlers}
                                                className={"noselect"}
                                              />
                                            </Tooltip>
                                          </>
                                        )
                                      }
                                      {
                                        /* parseLocale(user.locale) !==
                                        word.phrase.targetLanguage && */
                                        (user.subscriptionType !==
                                          SubscriptionType.Free ||
                                          hasAccess ||
                                          !state.disableMeanings) && (
                                          <>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.meaning",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={
                                                  <QuestionCircleOutlined />
                                                }
                                                onClick={() =>
                                                  handleQuestionClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                                {...pressQuestionHandlers}
                                                className={"noselect"}
                                              />
                                            </Tooltip>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.alternatives",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={<CommentOutlined />}
                                                onClick={() =>
                                                  handleAlternativesClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                                {...pressAlternativesHandlers}
                                                className={"noselect"}
                                              />
                                            </Tooltip>
                                          </>
                                        )
                                      }
                                    </Space>
                                  </div>
                                </div>
                              }
                            />
                          )}
                        {(activeTab === "2" || activeTab === "1") &&
                          !onMobile && (
                            <List.Item.Meta
                              style={{ display: "flex", alignItems: "center" }}
                              title={
                                <div>
                                  <div
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    style={{
                                      fontWeight: "normal",
                                      cursor:
                                        activeTab === "2"
                                          ? "default"
                                          : "pointer",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Space>
                                      <Button
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleDeleteItem(
                                            word.phrase._id,
                                            word.phrase.sentenceId,
                                            word.phrase.startPosition,
                                            word.sentenceNo
                                          )
                                        }
                                      />
                                      {(user.subscriptionType !==
                                        SubscriptionType.Free ||
                                        hasAccess ||
                                        !state.disableMeanings) && (
                                        <>
                                          <Tooltip
                                            title={intl.formatMessage({
                                              id: "vocabulary.list.meaning",
                                            })}
                                          >
                                            <Button
                                              type="default"
                                              className="wordMeaning"
                                              icon={<QuestionCircleOutlined />}
                                              onClick={() =>
                                                handleQuestionClick(
                                                  word.phrase.sourceText,
                                                  word.phrase.sourceLanguage
                                                )
                                              }
                                            />
                                          </Tooltip>
                                          <Tooltip
                                            title={intl.formatMessage({
                                              id: "vocabulary.list.alternatives",
                                            })}
                                          >
                                            <Button
                                              type="default"
                                              icon={<CommentOutlined />}
                                              onClick={() =>
                                                handleAlternativesClick(
                                                  word.phrase.sourceText,
                                                  word.phrase.sourceLanguage
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        </>
                                      )}
                                    </Space>
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "right",
                                        paddingRight: "20px",
                                        paddingLeft: "5px",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                      }}
                                      onClick={() => {
                                        togglePlay;
                                        handlePlayClick(
                                          word.phrase.sourceText,
                                          word.phrase.sourceLanguage
                                        );
                                      }}
                                    >
                                      {word.phrase.sourceText}
                                      <CaretRightOutlined
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.sourceText,
                                            word.phrase.sourceLanguage
                                          );
                                        }}
                                        style={{ marginLeft: "5px" }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                        paddingLeft: "20px",
                                        borderLeft: "1px solid #000",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                      }}
                                      onClick={() => {
                                        togglePlay;
                                        handlePlayClick(
                                          word.phrase.targetText,
                                          word.phrase.targetLanguage
                                        );
                                      }}
                                    >
                                      {word.phrase.targetText}
                                      <CaretRightOutlined
                                        style={{ marginLeft: "5px" }}
                                        key="icon"
                                        onClick={() => {
                                          togglePlay;
                                          handlePlayClick(
                                            word.phrase.targetText,
                                            word.phrase.targetLanguage
                                          );
                                        }}
                                      />
                                    </div>
                                    <audio key="audio" ref={audioRef} />
                                    <Space>
                                      {
                                        /* parseLocale(user.locale) !==
                                        word.phrase.targetLanguage && */
                                        (user.subscriptionType !==
                                          SubscriptionType.Free ||
                                          hasAccess ||
                                          !state.disableMeanings) && (
                                          <>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.meaning",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={
                                                  <QuestionCircleOutlined />
                                                }
                                                onClick={() =>
                                                  handleQuestionClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                              />
                                            </Tooltip>
                                            <Tooltip
                                              title={intl.formatMessage({
                                                id: "vocabulary.list.alternatives",
                                              })}
                                            >
                                              <Button
                                                type="default"
                                                icon={<CommentOutlined />}
                                                onClick={() =>
                                                  handleAlternativesClick(
                                                    word.phrase.sourceText,
                                                    word.phrase.targetLanguage
                                                  )
                                                }
                                              />
                                            </Tooltip>
                                          </>
                                        )
                                      }
                                    </Space>
                                  </div>
                                </div>
                              }
                            />
                          )}
                      </List.Item>
                    );
                  }}
                />
              </div>
            </div>
          </TabPane>
        )}
        {(state.loadingFromWordMeaning || state.wordMeaningData) && (
          <TabPane
            tab={intl.formatMessage({ id: "vocabulary.list.tab.meaning" })}
            key="3"
          >
            <div
              className="vocabularyListScroll"
              style={{
                paddingRight: 25,
                paddingLeft: 25,
              }}
            >
              <CustomSpinnerComponent
                spinning={state.loadingFromWordMeaning}
                myStyle={{ left: "40%" }}
              >
                {state.wordMeaningData && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: state.wordMeaningData.data,
                    }}
                  />
                )}
              </CustomSpinnerComponent>
            </div>
          </TabPane>
        )}
        {(state.loadingFromWordAlternatives || state.wordAlternativesData) && (
          <TabPane
            tab={intl.formatMessage({ id: "vocabulary.list.tab.alternatives" })}
            key="4"
          >
            <div
              className="vocabularyListScroll"
              style={{
                paddingRight: 25,
                paddingLeft: 25,
              }}
            >
              <CustomSpinnerComponent
                spinning={state.loadingFromWordAlternatives}
                myStyle={{ left: "40%" }}
              >
                {state.wordAlternativesData && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: state.wordAlternativesData.data,
                    }}
                  />
                )}
              </CustomSpinnerComponent>
            </div>
          </TabPane>
        )}
      </Tabs>
    </Card>
  );
};

export default VocabularyList;
