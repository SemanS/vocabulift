/* import { Word } from "@/pages/vocabulary";
import { Card, List, Typography } from "antd";
import React from "react";

interface WordDetailProps {
  word: Word;
}

const WordDetail: React.FC<WordDetailProps> = ({ word }) => {
  return (
    <List
      grid={{ gutter: 0, column: 1 }}
      dataSource={wordData?.meanings}
      renderItem={({ partOfSpeech, definitions }, index) => (
        <List.Item key={index}>
          {definitions.map((definition, subIndex) => (
            <>
              <div key={`${index}-${subIndex}`}>
                <Typography.Text strong>{partOfSpeech}</Typography.Text>
                <Typography.Text>: {definition.definition}</Typography.Text>
              </div>
              {definition.example ? (
                <div key={`example-${index}-${subIndex}`}>
                  <Typography.Text italic>
                    Example: {definition.example}
                  </Typography.Text>
                </div>
              ) : (
                ""
              )}
            </>
          ))}
        </List.Item>
      )}
    />
  );
};

export default WordDetail;
 */
