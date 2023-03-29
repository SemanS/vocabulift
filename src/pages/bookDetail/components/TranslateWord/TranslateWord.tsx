import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./TranslateWord.module.less";

const { Text } = Typography;

interface TranslateWordProps {
  word: string;
  translation: string;
  sentenceNumber: number;
  mode: string;
  onMouseDown?: (word: string, sentenceNumber: number) => void;
  onMouseEnter?: (word: string, sentenceNumber: number) => void;
  onMouseUp?: (sentenceNumber: number) => void;
  highlightPositions?: boolean;
  isHighlighted?: boolean;
  wordIndex: number;
  isInUserPhrases: boolean;
}

const TranslateWord: React.FC<TranslateWordProps> = ({
  word,
  translation,
  sentenceNumber,
  mode,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  highlightPositions,
  isHighlighted,
  isInUserPhrases,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (event: React.MouseEvent) => {
    //  event.stopPropagation();
    onMouseDown?.(word, sentenceNumber);
  };

  const handleMouseEnter = () => {
    onMouseEnter?.(word, sentenceNumber);
  };

  const handleMouseUp = () => {
    onMouseUp?.(sentenceNumber);
  };

  highlightPositions;

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
        isHovered || highlightPositions || isHighlighted || isInUserPhrases
          ? styles.bubbleHovered
          : "",
        styles.textbox
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    >
      {word + " "}
    </Text>
  );
};

export default TranslateWord;
