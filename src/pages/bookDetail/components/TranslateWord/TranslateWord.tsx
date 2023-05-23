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
  onMouseUp?: (
    sentenceTranslation: string,
    sentenceNumber: number,
    translation: string
  ) => void;
  highlightPositions?: boolean;
  isHighlighted?: boolean;
  isHighlightedFromVideo?: boolean;
  wordIndex?: number;
  isSelecting?: boolean;
  sentenceTranslation?: string;
}

const TranslateWord: React.FC<TranslateWordProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => {
    props.onMouseDown?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!
    );
  };

  const handleMouseEnter = () => {
    props.onMouseEnter?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!
    );
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    props.onMouseUp?.(
      props.sentenceTranslation!,
      props.sentenceNumber!,
      props.translation!
    );
  };

  const commonTooltipProps = {
    arrow: false,
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0,
    placement: "top",
    overlayInnerStyle: {
      backgroundColor: "white",
      color: "black",
      borderRadius: "10px",
      fontSize: "16px",
    },
  };

  const renderTooltip = (children: React.ReactNode) => {
    if (props.isSelecting) {
      return children as React.ReactElement;
    }

    if (props.mode === "all") {
      return (
        <Tooltip {...commonTooltipProps} title={props.translation}>
          <Tooltip
            {...commonTooltipProps}
            align={{ offset: [0, -50] }}
            title={props.sentenceTranslation}
          >
            {children}
          </Tooltip>
        </Tooltip>
      );
    }

    const title =
      props.mode === "word" ? props.translation : props.sentenceTranslation;

    return (
      <Tooltip {...commonTooltipProps} title={title}>
        {children}
      </Tooltip>
    );
  };

  return renderTooltip(
    <Text
      style={{
        cursor: "pointer",
        whiteSpace: "pre-wrap",
      }}
      className={classNames(
        styles.textbox,
        isHovered || props.highlightPositions || props.isHighlighted
          ? styles.bubbleHovered
          : props.isHighlightedFromVideo
          ? styles.bubbleVideoHovered
          : ""
      )}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    >
      {props.mode === "sentence" ? props.word + "\n" : props.word + " "}
    </Text>
  );
};

export default TranslateWord;
