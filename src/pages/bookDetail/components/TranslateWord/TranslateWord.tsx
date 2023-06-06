import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
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
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);

  useEffect(() => {
    // If the word is highlighted from video on mobile, show the tooltip
    if (
      isMobileDevice ||
      (props.isHighlightedFromVideo && props.mode === "sentence")
    ) {
      setIsTooltipVisible(true);
    } else {
      setIsTooltipVisible(false);
    }
  }, [isMobileDevice, props.isHighlightedFromVideo]);

  useEffect(() => {
    return () => {
      if (hoverTimeout) window.clearTimeout(hoverTimeout);
    };
  }, []);

  useEffect(() => {
    // Check if the user is on a mobile device
    const userAgent = window.navigator.userAgent;
    const isMobile = !!userAgent.match(/Android|iPhone/i);
    setIsMobileDevice(isMobile);
  }, []);

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

    // Clear any existing timeouts to prevent rapid firing
    if (hoverTimeout) window.clearTimeout(hoverTimeout);

    // Set a timeout before setting isHovered to true
    const timeoutId = window.setTimeout(() => setIsHovered(true), 150);
    setHoverTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    // Clear any existing timeouts to prevent rapid firing
    if (hoverTimeout) window.clearTimeout(hoverTimeout);

    // Set a timeout before setting isHovered to false
    const timeoutId = window.setTimeout(() => setIsHovered(false), 0);
    setHoverTimeout(timeoutId);
  };

  const handleMouseUp = () => {
    props.onMouseUp?.(
      props.sentenceTranslation!,
      props.sentenceNumber!,
      props.translation!
    );
  };

  const commonTooltipProps = {
    open: isTooltipVisible || !props.isHighlightedFromVideo || isHovered,
    arrow: false,
    mouseEnterDelay: 100,
    mouseLeaveDelay: 100,
    placement: "top" as const,
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

    const shouldShowTooltip =
      props.highlightPositions ||
      props.isHighlighted ||
      props.isHighlightedFromVideo ||
      isHovered;

    if (!shouldShowTooltip) {
      return children as React.ReactElement;
    }

    if (props.mode === "all") {
      return (
        <Tooltip
          {...commonTooltipProps}
          title={props.translation}
          open={isHovered}
        >
          <Tooltip
            {...commonTooltipProps}
            align={{ offset: [0, -50] }}
            title={props.sentenceTranslation}
            open={isHovered}
          >
            {children}
          </Tooltip>
        </Tooltip>
      );
    }

    const title =
      props.mode === "word" ? props.translation : props.sentenceTranslation;

    return (
      <Tooltip {...commonTooltipProps} title={title} /* open={isHovered} */>
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
