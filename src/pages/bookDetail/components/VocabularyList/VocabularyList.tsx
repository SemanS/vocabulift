import React, { FC, useEffect, useState } from "react";
import { Card, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { UserSentence } from "@/models/userSentence.interface";

interface VocabularyListProps {
  phrases: VocabularyListUserPhrase[] | undefined;
  onDeleteItem: (startPosition: number, sentence_no: number) => void;
}

const VocabularyList: FC<VocabularyListProps> = ({ phrases, onDeleteItem }) => {
  const handleDeleteItem = async (
    startPosition: number,
    sentence_no: number
  ) => {
    onDeleteItem(startPosition, sentence_no);
  };

  return (
    <Card style={{ backgroundColor: "rgb(253, 222, 184)" }}>
      <List
        size="small"
        header={
          <div>
            <strong>Vocabulary</strong>
          </div>
        }
        dataSource={phrases}
        renderItem={(word: VocabularyListUserPhrase, index: number) => (
          <List.Item
            key={word.sentence_no + word.phrase.startPosition}
            style={{ padding: "8px 0" }}
            onClick={() =>
              handleDeleteItem(word.phrase.startPosition, word.sentence_no)
            }
          >
            <List.Item.Meta avatar={<DeleteOutlined />} />
            {word.phrase.sourceText} - {word.phrase.targetText} -{" "}
            {word.sentence_no}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default VocabularyList;
