import React, { FC, useEffect, useRef, useState } from "react";
import { Card, List, Space } from "antd";
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
  onQuestionClick: (phrase: string) => void;
  onAlternativesClick: (phrase: string) => void;
}

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
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [prevPhrasesLength, setPrevPhrasesLength] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  const longPressOptions = {
    isPreventDefault: true,
    delay: 500, // duration of long press in ms
  };

  const onLongPressComment = useLongPress(() => {
    notification.info({
      message: "Information",
      description: "This is a comment icon.",
    });
  }, longPressOptions);

  const onLongPressQuestion = useLongPress(() => {
    notification.info({
      message: "Information",
      description: "This is a question icon.",
    });
  }, longPressOptions);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleWordClick = async (word: VocabularyListUserPhrase) => {
    mode === "words" && onWordClick && onWordClick(word.phrase.sourceText);
    mode === "words" && setSelectedWord(word.phrase.sourceText);
    mode === "words" && setSelectedUserPhrase(word);

    const audioUrl = await textToSpeech(word.phrase.targetText, "sk-SK");

    const audio = audioRef.current;
    if (audio) {
      audio.src = audioUrl!;
      audio.play();
    }
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
              className={isSelected ? "selected-word" : ""}
              style={{ padding: "4px 0" }}
              onClick={() => {
                mode === "words" &&
                  onWordClick &&
                  onWordClick(word.phrase.sourceText);
                mode === "words" && setSelectedWord(word.phrase.sourceText);
                mode === "words" && setSelectedUserPhrase(word);
              }}
            >
              {mode === "words" && (
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
                          handleWordClick(word);
                        }}
                      />
                    </div>
                  }
                />
              )}
              {mode === "phrases" && (
                <List.Item.Meta
                  style={{ display: "flex", alignItems: "center" }}
                  title={
                    <div>
                      <div
                        ref={(el) => (itemRefs.current[index] = el)}
                        style={{
                          fontWeight: "normal",
                          cursor: mode === "phrases" ? "default" : "pointer",
                        }}
                      >
                        {word.phrase.sourceText} - {word.phrase.targetText}
                      </div>
                      <audio key="audio" ref={audioRef} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
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
                        <Space>
                          <QuestionCircleOutlined
                            onClick={() =>
                              onQuestionClick(word.phrase.sourceText)
                            }
                            {...onLongPressQuestion}
                          />
                          <CommentOutlined
                            onClick={() =>
                              onAlternativesClick(word.phrase.sourceText)
                            }
                            {...onLongPressComment}
                          />
                          <CaretRightOutlined
                            key="icon"
                            onClick={() => {
                              togglePlay;
                              handleWordClick(word);
                            }}
                          />
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
