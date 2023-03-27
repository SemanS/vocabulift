import React, { FC } from "react";
import { Card, List } from "antd";
import { UserWord } from "@models/userSentence.interface";

interface VocabularyListProps {
  clickedWords: UserWord[];
  sourceLanguage: "en" | "cz" | "sk";
  targetLanguage: "en" | "cz" | "sk";
}

const VocabularyList: FC<VocabularyListProps> = ({ clickedWords }) => {
  return (
    <Card style={{ backgroundColor: "rgb(253, 222, 184)" }}>
      <List
        size="small"
        header={
          <div>
            <strong>Vocabulary</strong>
          </div>
        }
        dataSource={clickedWords}
        renderItem={(word: UserWord, index: number) => (
          <List.Item>
            {word.sourceText} - {word.targetText}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default VocabularyList;
