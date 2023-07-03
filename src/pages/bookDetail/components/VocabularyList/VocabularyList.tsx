import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import { Button, Card, List, Space, Tabs, Spin } from "antd";
import {
  CaretRightOutlined,
  CommentOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import "./VocabularyList.css";
import { getPhraseMeaning, textToSpeech } from "@/services/userService";
import { notification } from "antd";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { parseLocale } from "@/utils/stringUtils";
import usePressHandlers from "@/hooks/userPressHandlers";

const TabPane = Tabs.TabPane;

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoadingFromWordMeaning":
      return { ...state, loading: action.payload };
    case "setWordMeaningData":
      return { ...state, wordMeaningData: action.payload };
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
  onQuestionClick: (phrase: string, language: string) => void;
  onAlternativesClick: (phrase: string) => void;
  selectedLanguageTo: string;
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
  onQuestionClick,
  onAlternativesClick,
  selectedLanguageTo,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [prevPhrasesLength, setPrevPhrasesLength] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [onMobile, setOnMobile] = useState(isMobile());
  const [user, setUser] = useRecoilState(userState);
  const [activeTab, setActiveTab] = useState("1");

  const audioRef = useRef<HTMLAudioElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    wordMeaningData: null,
  });

  const shortPressQuestionAction = (word) =>
    onQuestionClick(word.phrase.sourceText, parseLocale(user.locale));

  const shortPressAlternativesAction = (word) =>
    onAlternativesClick(word.phrase.sourceText);

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

  const pressQuestionHandlers = usePressHandlers(
    shortPressQuestionAction,
    longPressQuestionAction,
    500
  );

  const pressAlternativesHandlers = usePressHandlers(
    shortPressQuestionAction,
    longPressQuestionAction,
    500
  );

  const handleQuestionClick = async (phrase: string, language: string) => {
    try {
      setActiveTab("3");
      dispatch({ type: "setLoadingFromWordMeaning", payload: true });
      const meaning = await getPhraseMeaning(phrase, language);
      dispatch({ type: "setLoadingFromWordMeaning", payload: false });
      dispatch({ type: "setWordMeaningData", payload: meaning });
    } catch (error) {
      console.error("Error occurred:", error);
      dispatch({ type: "setWordMeaningData", payload: "An error occurred." });
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
  };

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

  return (
    <Card style={style} bodyStyle={{ padding: 0 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarStyle={{ paddingLeft: 25, paddingRight: 25 }}
      >
        <TabPane tab={"Words"} key="1">
          <div className="vocabularyListScroll">
            <div style={{ paddingTop: 10, paddingRight: 25, paddingLeft: 25 }}>
              <List
                size="small"
                dataSource={phrases.filter(
                  (phrase) =>
                    phrase.phrase.endPosition - phrase.phrase.startPosition ===
                    0
                )}
                renderItem={(word: VocabularyListUserPhrase, index: number) => {
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
                        activeTab === "1" && setSelectedUserPhrase(word);
                      }}
                    >
                      {(activeTab === "2" || activeTab === "1") && onMobile && (
                        <List.Item.Meta
                          style={{ display: "flex", alignItems: "center" }}
                          title={
                            <div>
                              <div
                                ref={(el) => (itemRefs.current[index] = el)}
                                style={{
                                  fontWeight: "normal",
                                  cursor:
                                    activeTab === "2" ? "default" : "pointer",
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
                                  {parseLocale(user.locale) !==
                                    word.phrase.sourceLanguage && (
                                    <>
                                      <Button
                                        type="default"
                                        icon={<QuestionCircleOutlined />}
                                        onClick={() =>
                                          handleQuestionClick(
                                            word.phrase.sourceText,
                                            parseLocale(user.locale)
                                          )
                                        }
                                        {...pressQuestionHandlers}
                                        className={"noselect"}
                                      />
                                      <Button
                                        type="default"
                                        icon={<CommentOutlined />}
                                        onClick={() =>
                                          onAlternativesClick(
                                            word.phrase.sourceText
                                          )
                                        }
                                        {...pressAlternativesHandlers}
                                        className={"noselect"}
                                      />
                                    </>
                                  )}
                                  {parseLocale(user.locale) !==
                                    word.phrase.targetLanguage && (
                                    <>
                                      <Button
                                        type="default"
                                        icon={<QuestionCircleOutlined />}
                                        onClick={() =>
                                          handleQuestionClick(
                                            word.phrase.sourceText,
                                            parseLocale(user.locale)
                                          )
                                        }
                                        {...pressQuestionHandlers}
                                        className={"noselect"}
                                      />
                                      <Button
                                        type="default"
                                        icon={<CommentOutlined />}
                                        onClick={() =>
                                          onAlternativesClick(
                                            word.phrase.targetText
                                          )
                                        }
                                        {...pressAlternativesHandlers}
                                        className={"noselect"}
                                      />
                                    </>
                                  )}
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
                                      activeTab === "2" ? "default" : "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Space>
                                    <DeleteOutlined
                                      onClick={() =>
                                        handleDeleteItem(
                                          word.phrase._id,
                                          word.phrase.sentenceId,
                                          word.phrase.startPosition,
                                          word.sentenceNo
                                        )
                                      }
                                    />
                                    {parseLocale(user.locale) !==
                                      word.phrase.sourceLanguage && (
                                      <>
                                        <QuestionCircleOutlined
                                          onClick={() =>
                                            handleQuestionClick(
                                              word.phrase.sourceText,
                                              parseLocale(user.locale)
                                            )
                                          }
                                          {...pressQuestionHandlers}
                                          className={"noselect"}
                                        />
                                        <CommentOutlined
                                          onClick={() =>
                                            onAlternativesClick(
                                              word.phrase.sourceText
                                            )
                                          }
                                          {...pressAlternativesHandlers}
                                          className={"noselect"}
                                        />
                                      </>
                                    )}
                                  </Space>
                                  <div
                                    style={{
                                      width: "50%",
                                      textAlign: "right",
                                      paddingRight: "20px",
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
                                    {parseLocale(user.locale) !==
                                      word.phrase.targetLanguage && (
                                      <>
                                        <QuestionCircleOutlined
                                          onClick={() =>
                                            handleQuestionClick(
                                              word.phrase.sourceText,
                                              parseLocale(user.locale)
                                            )
                                          }
                                          {...pressQuestionHandlers}
                                          className={"noselect"}
                                        />
                                        <CommentOutlined
                                          onClick={() =>
                                            onAlternativesClick(
                                              word.phrase.sourceText
                                            )
                                          }
                                          {...pressAlternativesHandlers}
                                          className={"noselect"}
                                        />
                                      </>
                                    )}
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
        <TabPane tab={"Phrases"} key="2">
          <div className="vocabularyListScroll">
            <div style={{ paddingTop: 10, paddingRight: 25, paddingLeft: 25 }}>
              <List
                size="small"
                dataSource={phrases.filter(
                  (phrase) =>
                    phrase.phrase.endPosition - phrase.phrase.startPosition > 0
                )}
                renderItem={(word: VocabularyListUserPhrase, index: number) => {
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
                        activeTab === "1" && setSelectedUserPhrase(word);
                      }}
                    >
                      {(activeTab === "2" || activeTab === "1") && onMobile && (
                        <List.Item.Meta
                          style={{ display: "flex", alignItems: "center" }}
                          title={
                            <div>
                              <div
                                ref={(el) => (itemRefs.current[index] = el)}
                                style={{
                                  fontWeight: "normal",
                                  cursor:
                                    activeTab === "2" ? "default" : "pointer",
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
                                  {parseLocale(user.locale) !==
                                    word.phrase.sourceLanguage && (
                                    <>
                                      <Button
                                        type="default"
                                        icon={<QuestionCircleOutlined />}
                                        onClick={() =>
                                          handleQuestionClick(
                                            word.phrase.sourceText,
                                            parseLocale(user.locale)
                                          )
                                        }
                                        {...pressQuestionHandlers}
                                        className={"noselect"}
                                      />
                                      <Button
                                        type="default"
                                        icon={<CommentOutlined />}
                                        onClick={() =>
                                          onAlternativesClick(
                                            word.phrase.sourceText
                                          )
                                        }
                                        {...pressAlternativesHandlers}
                                        className={"noselect"}
                                      />
                                    </>
                                  )}
                                  {parseLocale(user.locale) !==
                                    word.phrase.targetLanguage && (
                                    <>
                                      <Button
                                        type="default"
                                        icon={<QuestionCircleOutlined />}
                                        onClick={() =>
                                          handleQuestionClick(
                                            word.phrase.sourceText,
                                            parseLocale(user.locale)
                                          )
                                        }
                                        {...pressQuestionHandlers}
                                        className={"noselect"}
                                      />
                                      <Button
                                        type="default"
                                        icon={<CommentOutlined />}
                                        onClick={() =>
                                          onAlternativesClick(
                                            word.phrase.targetText
                                          )
                                        }
                                        {...pressAlternativesHandlers}
                                        className={"noselect"}
                                      />
                                    </>
                                  )}
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
                                      activeTab === "2" ? "default" : "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Space>
                                    <DeleteOutlined
                                      onClick={() =>
                                        handleDeleteItem(
                                          word.phrase._id,
                                          word.phrase.sentenceId,
                                          word.phrase.startPosition,
                                          word.sentenceNo
                                        )
                                      }
                                    />
                                    {parseLocale(user.locale) !==
                                      word.phrase.sourceLanguage && (
                                      <>
                                        <QuestionCircleOutlined
                                          onClick={() =>
                                            handleQuestionClick(
                                              word.phrase.sourceText,
                                              parseLocale(user.locale)
                                            )
                                          }
                                          {...pressQuestionHandlers}
                                          className={"noselect"}
                                        />
                                        <CommentOutlined
                                          onClick={() =>
                                            onAlternativesClick(
                                              word.phrase.sourceText
                                            )
                                          }
                                          {...pressAlternativesHandlers}
                                          className={"noselect"}
                                        />
                                      </>
                                    )}
                                  </Space>
                                  <div
                                    style={{
                                      width: "50%",
                                      textAlign: "right",
                                      paddingRight: "20px",
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
                                    {parseLocale(user.locale) !==
                                      word.phrase.targetLanguage && (
                                      <>
                                        <QuestionCircleOutlined
                                          onClick={() =>
                                            handleQuestionClick(
                                              word.phrase.sourceText,
                                              parseLocale(user.locale)
                                            )
                                          }
                                          {...pressQuestionHandlers}
                                          className={"noselect"}
                                        />
                                        <CommentOutlined
                                          onClick={() =>
                                            onAlternativesClick(
                                              word.phrase.sourceText
                                            )
                                          }
                                          {...pressAlternativesHandlers}
                                          className={"noselect"}
                                        />
                                      </>
                                    )}
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
        {(state.loading || state.wordMeaningData) && (
          <TabPane tab="Meaning" key="3">
            <div
              className="vocabularyListScroll"
              style={{ paddingRight: 25, paddingLeft: 25 }}
            >
              <Spin
                spinning={state.loading}
                size="large"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {state.wordMeaningData && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: state.wordMeaningData.data,
                    }}
                  />
                )}
              </Spin>
            </div>
          </TabPane>
        )}
        {/* <TabPane tab="Alternatives" key="3"></TabPane> */}
      </Tabs>
    </Card>
  );
};

export default VocabularyList;
