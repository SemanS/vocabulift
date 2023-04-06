import React, { FC, useState } from "react";
import { Card, List, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import "./VocabularyList.css";
import classNames from "classnames";

interface VocabularyListProps {
  mode: string;
  title: string;
  style: React.CSSProperties | undefined;
  phrases: VocabularyListUserPhrase[] | undefined;
  onDeleteItem: (startPosition: number, sentence_no: number) => void;
  onWordClick?: (word: string) => void;
}

const VocabularyList: FC<VocabularyListProps> = ({
  mode,
  title,
  style,
  phrases,
  onDeleteItem,
  onWordClick,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleDeleteItem = async (
    startPosition: number,
    sentence_no: number
  ) => {
    onDeleteItem(startPosition, sentence_no);
  };

  return (
    <Card
      style={style}
      title={<span style={{ fontWeight: "normal" }}>{title}: </span>}
    >
      <List
        size="small"
        dataSource={phrases}
        renderItem={(word: VocabularyListUserPhrase, index: number) => {
          const isSelected = selectedWord === word.phrase.sourceText;

          return (
            <List.Item
              key={word.sentence_no + word.phrase.startPosition}
              className={isSelected && mode === "words" ? "selected-word" : ""}
              style={{ padding: "4px 0" }}
              onClick={() => {
                mode === "words" &&
                  onWordClick &&
                  onWordClick(word.phrase.sourceText);
                setSelectedWord(word.phrase.sourceText);
              }}
            >
              <List.Item.Meta
                className={mode === "words" ? "list-item-content" : ""}
                style={{ display: "flex", alignItems: "center" }}
                avatar={
                  <DeleteOutlined
                    onClick={() =>
                      handleDeleteItem(
                        word.phrase.startPosition,
                        word.sentence_no
                      )
                    }
                  />
                }
                title={
                  <Space>
                    <span
                      style={{
                        fontWeight: "normal",
                        cursor: mode === "phrases" ? "default" : "pointer",
                      }}
                    >
                      {word.phrase.sourceText} - {word.phrase.targetText}
                    </span>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default VocabularyList;
