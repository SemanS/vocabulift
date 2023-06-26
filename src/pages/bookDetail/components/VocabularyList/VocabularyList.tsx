import React, { FC, useEffect, useRef, useState } from "react";
import { Button, Card, List, Space, Typography } from "antd";
import {
  CaretRightOutlined,
  CommentOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import "./VocabularyList.css";
import { textToSpeech } from "@/services/userService";
import { useLongPress } from "react-use";
import { notification } from "antd";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { parseLocale } from "@/utils/stringUtils";
import usePressHandlers from "@/hooks/userPressHandlers";

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

  const audioRef = useRef<HTMLAudioElement>(null);

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
    mode === "words" && onWordClick && onWordClick(word.phrase.sourceText);
    mode === "words" && setSelectedWord(word.phrase.sourceText);
    mode === "words" && setSelectedUserPhrase(word);
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
    <Card
      style={style}
      title={<span style={{ fontWeight: "normal" }}>{title}: </span>}
    >
      <List
        size="small"
        dataSource={phrases}
        renderItem={(word: VocabularyListUserPhrase, index: number) => {
          const isSelected =
            selectedUserPhrase?.phrase.sourceText === word.phrase.sourceText;

          return (
            <List.Item
              key={word.sentenceNo + word.phrase.startPosition}
              //className={isSelected ? "selected-word" : ""}
              style={{ padding: "4px 0" }}
              onClick={() => {
                mode === "words" &&
                  onWordClick &&
                  onWordClick(word.phrase.sourceText);
                mode === "words" && setSelectedWord(word.phrase.sourceText);
                mode === "words" && setSelectedUserPhrase(word);
              }}
            >
              {/* {mode === "words" && (
                <List.Item.Meta
                  className={mode === "words" ? "list-item-content" : ""}
                  style={{ display: "flex", alignItems: "center" }}
                  avatar={
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
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span
                        ref={(el) => (itemRefs.current[index] = el)}
                        style={{
                          fontWeight: "normal",
                          cursor: "default",
                        }}
                      >
                        {word.phrase.sourceText} - {word.phrase.targetText}
                      </span>
                      <audio key="audio" ref={audioRef} />
                      <CaretRightOutlined
                        key="icon"
                        onClick={() => {
                          togglePlay;
                          handlePlayClick(
                            word.phrase.targetText,
                            word.phrase.sourceLanguage
                          );
                        }}
                      />
                    </div>
                  }
                />
              )} */}
              {(mode === "phrases" || mode === "words") && onMobile && (
                <List.Item.Meta
                  style={{ display: "flex", alignItems: "center" }}
                  title={
                    <div>
                      <div
                        ref={(el) => (itemRefs.current[index] = el)}
                        style={{
                          fontWeight: "normal",
                          cursor: mode === "phrases" ? "default" : "pointer",
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
                          {/* <div> */}
                          {word.phrase.targetText}
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
                        {/* </div> */}
                      </div>
                      <audio key="audio" ref={audioRef} />
                      <div
                        style={{
                          textAlign: "left",
                          width: "50%",
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
                                  onQuestionClick(
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
                                  onAlternativesClick(word.phrase.sourceText)
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
                                onClick={() => {
                                  onQuestionClick(
                                    word.phrase.targetText,
                                    parseLocale(user.locale)
                                  );
                                }}
                                {...pressQuestionHandlers}
                                className={"noselect"}
                              />
                              <Button
                                type="default"
                                icon={<CommentOutlined />}
                                onClick={() =>
                                  onAlternativesClick(word.phrase.targetText)
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
              {(mode === "phrases" || mode === "words") && !onMobile && (
                <List.Item.Meta
                  style={{ display: "flex", alignItems: "center" }}
                  title={
                    <div>
                      <div
                        ref={(el) => (itemRefs.current[index] = el)}
                        style={{
                          fontWeight: "normal",
                          cursor: mode === "phrases" ? "default" : "pointer",
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
                                  onQuestionClick(
                                    word.phrase.sourceText,
                                    parseLocale(user.locale)
                                  )
                                }
                                {...pressQuestionHandlers}
                                className={"noselect"}
                              />
                              <CommentOutlined
                                onClick={() =>
                                  onAlternativesClick(word.phrase.sourceText)
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
                                  onQuestionClick(
                                    word.phrase.targetText,
                                    parseLocale(user.locale)
                                  )
                                }
                                {...pressQuestionHandlers}
                                className={"noselect"}
                              />
                              <CommentOutlined
                                onClick={() =>
                                  onAlternativesClick(word.phrase.sourceText)
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
    </Card>
  );
};

export default VocabularyList;
