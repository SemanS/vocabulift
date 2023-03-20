import React, { FC } from "react";
import { Card, List } from "antd";

interface VocabularyListProps {
  clickedWords: string[];
}

const VocabularyList: FC<VocabularyListProps> = ({ clickedWords }) => {
  return (
    <Card>
      <List
        size="small"
        header={
          <div>
            <strong>Vocabulary</strong>
          </div>
        }
        dataSource={clickedWords}
        renderItem={(word: string, index: number) => (
          <List.Item>{word}</List.Item>
        )}
      />
    </Card>
  );
};

export default VocabularyList;
