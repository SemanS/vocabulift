import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./TranslateWord.module.less";

const { Text } = Typography;

interface TranslateWordProps {
  word?: string;
  translation?: string;
  sentenceNumber?: number;
  mode: string;
  onMouseDown?: (word: string, sentenceNumber: number) => void;
  onMouseEnter?: (word: string, sentenceNumber: number) => void;
  onMouseUp?: (sentenceNumber: number, translation: string) => void;
  highlightPositions?: boolean;
  isHighlighted?: boolean;
  wordIndex?: number;
  isSelecting?: boolean;
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
  isSelecting,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => {
    onMouseDown?.(word!, sentenceNumber!);
  };

  const handleMouseEnter = () => {
    onMouseEnter?.(word!, sentenceNumber!);
  };

  const handleMouseUp = () => {
    onMouseUp?.(sentenceNumber!, translation!);
  };

  const renderTooltip = (children: React.ReactNode) => {
    if (isSelecting) {
      return children as React.ReactElement;
    }
    return (
      <Tooltip
        arrow={false}
        mouseEnterDelay={0.15}
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
    );
  };

  return renderTooltip(
    <Text
      style={{
        cursor: mode === "word" ? "pointer" : "default",
        whiteSpace: "pre-wrap",
      }}
      className={classNames(
        isHovered || highlightPositions || isHighlighted
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
