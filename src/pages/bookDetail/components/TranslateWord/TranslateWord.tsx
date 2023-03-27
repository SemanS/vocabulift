import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./TranslateWord.module.less";

const { Text } = Typography;

interface TranslateWordProps {
  word: string;
  translation: string;
  sentenceNumber: number;
  //onClick: (word: string, sentenceNumber: number) => void;
  mode: string;
  onMouseDown?: (word: string) => void;
  onMouseEnter?: (word: string) => void;
  onMouseUp?: (sentenceNumber: number) => void;
}

const TranslateWord: React.FC<TranslateWordProps> = ({
  word,
  translation,
  sentenceNumber,
  //onClick,
  mode,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderTooltip = (children: React.ReactNode) => {
    return mode === "sentence" ? (
      <Tooltip
        arrow={false}
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        overlayInnerStyle={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "10px",
          fontSize: "14px",
        }}
        getPopupContainer={(trigger) => {
          return trigger;
        }}
        title={translation}
      >
        {children}
      </Tooltip>
    ) : (
      <>{children}</>
    );
  };

  return renderTooltip(
    <Text
      style={{
        cursor: mode === "word" ? "pointer" : "default",
        whiteSpace: "pre-wrap",
      }}
      className={classNames(
        isHovered ? styles.bubbleHovered : "",
        styles.textbox
      )}
      //onClick={() => onClick(word, sentenceNumber)}
      onMouseDown={() => onMouseDown && onMouseDown(word)}
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter && onMouseEnter(word);
      }}
      onMouseUp={() => {
        console.log("triggered");
        setIsHovered(false);
        onMouseUp && onMouseUp(sentenceNumber);
      }}
    >
      {word + " "}
    </Text>
  );
};

export default TranslateWord;
