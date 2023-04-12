import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./TranslateWord.module.less";

const { Text } = Typography;

interface TranslateWordProps {
  word?: string;
  translation?: string;
  sentenceNumber?: number;
  sentenceText?: string;
  mode: string;
  onMouseDown?: (
    word: string,
    sentenceNumber: number,
    sentenceText: string
  ) => void;
  onMouseEnter?: (
    word: string,
    sentenceNumber: number,
    sentenceText: string
  ) => void;
  onMouseUp?: (sentenceNumber: number, translation: string) => void;
  highlightPositions?: boolean;
  isHighlighted?: boolean;
  wordIndex?: number;
  isSelecting?: boolean;
  sentenceTranslation?: string;
}

const TranslateWord: React.FC<TranslateWordProps> = ({
  word,
  translation,
  sentenceNumber,
  sentenceText,
  mode,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  highlightPositions,
  isHighlighted,
  isSelecting,
  sentenceTranslation,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => {
    onMouseDown?.(word!, sentenceNumber!, sentenceText!);
  };

  const handleMouseEnter = () => {
    onMouseEnter?.(word!, sentenceNumber!, sentenceText!);
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false); // Set isHovered to false when the mouse leaves
  };

  const handleMouseUp = () => {
    onMouseUp?.(sentenceNumber!, translation!);
  };

  const renderTooltip = (children: React.ReactNode) => {
    if (isSelecting) {
      return children as React.ReactElement;
    }
    if (mode === "word") {
      return (
        <Tooltip
          arrow={false}
          mouseEnterDelay={0.15}
          mouseLeaveDelay={0}
          placement="top"
          overlayInnerStyle={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
            fontSize: "16px",
          }}
          title={translation}
        >
          {children}
        </Tooltip>
      );
    } else if (mode === "sentence") {
      return (
        <Tooltip
          arrow={false}
          mouseEnterDelay={0.15}
          mouseLeaveDelay={0}
          placement="top"
          overlayInnerStyle={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
            fontSize: "16px",
          }}
          title={sentenceTranslation}
        >
          {children}
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          arrow={false}
          mouseEnterDelay={0.15}
          mouseLeaveDelay={0}
          placement="top"
          align={{ offset: [0, -10] }}
          overlayInnerStyle={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "10px",
            fontSize: "16px",
          }}
          title={translation}
        >
          <Tooltip
            arrow={false}
            mouseEnterDelay={0.15}
            mouseLeaveDelay={0}
            placement="top"
            align={{ offset: [0, -50] }}
            overlayInnerStyle={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
              fontSize: "16px",
            }}
            title={sentenceTranslation}
          >
            {children}
          </Tooltip>
        </Tooltip>
      );
    }
  };

  return renderTooltip(
    <Text
      style={{
        cursor: "pointer",
        whiteSpace: "pre-wrap",
      }}
      className={classNames(
        isHovered || highlightPositions || isHighlighted
          ? styles.bubbleHovered
          : "",
        styles.textbox
      )}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    >
      {word + " "}
    </Text>
  );
};

export default TranslateWord;
