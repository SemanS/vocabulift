import React, { useRef } from "react";
import { List, Card, Typography } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { WordData } from "@models/word.interface";

interface WordDefinitionCardProps {
  wordData: WordData | undefined;
}

const WordDefinitionCard: React.FC<WordDefinitionCardProps> = ({
  wordData,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <Card
      title={
        <span>
          <span style={{ fontWeight: "normal" }}>Definitions of: </span>
          <strong style={{ fontWeight: "bold" }}>{wordData?.word}</strong>
        </span>
      }
      extra={[
        <Typography.Text>{wordData?.phonetics[0].text} </Typography.Text>,
        <audio ref={audioRef} src={wordData?.phonetics[0].audio} />,
        <CaretRightOutlined onClick={togglePlay} />,
      ]}
    >
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
    </Card>
  );
};

export default WordDefinitionCard;
