import React, { FC, useState } from "react";
import { Card, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import "./VocabularyList.css";

interface VocabularyListProps {
  phrases: VocabularyListUserPhrase[] | undefined;
  onDeleteItem: (startPosition: number, sentence_no: number) => void;
  onWordClick?: (word: string) => void;
}

const VocabularyList: FC<VocabularyListProps> = ({
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
    <Card>
      <List
        size="small"
        dataSource={phrases}
        renderItem={(word: VocabularyListUserPhrase, index: number) => {
          const isSelected = selectedWord === word.phrase.sourceText;

          return (
            <div
              key={word.sentence_no + word.phrase.startPosition}
              className={isSelected ? "selected-word" : ""}
            >
              <List.Item
                className="list-item-content"
                style={{ padding: "3px 0" }}
                onClick={() => {
                  onWordClick && onWordClick(word.phrase.sourceText);
                  setSelectedWord(word.phrase.sourceText);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <List.Item.Meta
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
                  />
                  <span>
                    {word.phrase.sourceText} - {word.phrase.targetText}
                  </span>
                </div>
              </List.Item>
            </div>
          );
        }}
      />
    </Card>
  );
};

export default VocabularyList;
