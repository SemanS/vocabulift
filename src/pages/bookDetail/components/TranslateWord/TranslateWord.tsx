import { Tooltip, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styles from "./TranslateWord.module.less";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";
import { isSingleWord } from "@/utils/utilMethods";

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
  isHighlighted?: boolean;
  isHighlightedFromVideo?: boolean;
  wordIndex?: number;
  isSelecting?: boolean;
  sentenceTranslation?: string;
  vocabularyListUserPhrases?: VocabularyListUserPhrase[];
}

const TranslateWord: React.FC<TranslateWordProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [isWord, setIsWord] = useState(false);
  const [isPhrase, setIsPhrase] = useState(false);
  const [isWordPhrase, setIsWordPhrase] = useState(false);

  const mouseLeaveDelay = 0.1;

  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, []);

  const hoverTimeout = useRef<number | null>(null);

  const clearHoverTimeout = () => {
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  useEffect(() => {
    if (props.mode === "words") {
      const userWords = props.vocabularyListUserPhrases?.filter(
        ({ phrase }) => {
          const inSentence = phrase.sentenceNo === props.sentenceNumber;
          const inPosition =
            phrase.startPosition <= props.wordIndex! &&
            phrase.endPosition >= props.wordIndex! &&
            isSingleWord(phrase.sourceText);
          return inSentence && inPosition;
        }
      );
      if (userWords)
        userWords.forEach((userWord) => {
          setIsWord(true);
        });
    }

    if (props.mode === "phrases") {
      const userPhrases = props.vocabularyListUserPhrases?.filter(
        ({ phrase }) => {
          const inSentence = phrase.sentenceNo === props.sentenceNumber;
          const inPosition =
            phrase.startPosition <= props.wordIndex! &&
            phrase.endPosition >= props.wordIndex! &&
            !isSingleWord(phrase.sourceText);
          return inSentence && inPosition;
        }
      );
      if (userPhrases)
        userPhrases.forEach((userPhrase) => {
          setIsPhrase(true);
        });
    }
    if (props.mode === "all") {
      const userWords = props.vocabularyListUserPhrases?.filter(
        ({ phrase }) => {
          const inSentence = phrase.sentenceNo === props.sentenceNumber;
          const inPosition =
            phrase.startPosition <= props.wordIndex! &&
            phrase.endPosition >= props.wordIndex! &&
            isSingleWord(phrase.sourceText);
          return inSentence && inPosition;
        }
      );

      const userPhrases = props.vocabularyListUserPhrases?.filter(
        ({ phrase }) => {
          const inSentence = phrase.sentenceNo === props.sentenceNumber;
          const inPosition =
            phrase.startPosition <= props.wordIndex! &&
            phrase.endPosition >= props.wordIndex! &&
            !isSingleWord(phrase.sourceText);
          return inSentence && inPosition;
        }
      );
      if (userPhrases)
        userPhrases.forEach((userPhrase) => {
          setIsPhrase(true);
        });

      if (userWords && userPhrases) {
        userWords.forEach((userWord) => {
          userPhrases.forEach((userPhrase) => {
            if (
              userWord.phrase.startPosition >=
                userPhrase.phrase.startPosition &&
              userWord.phrase.endPosition <= userPhrase.phrase.endPosition
            ) {
              setIsWordPhrase(true);
            }
          });
        });
      }
    }
  }, [
    props.vocabularyListUserPhrases,
    /* props.sentenceNumber,
    props.wordIndex, */
    isWord,
    isPhrase,
    props.mode,
  ]);

  const shouldShowTooltip =
    //isWordHighlighted ||
    props.isHighlighted || props.isHighlightedFromVideo || isHovered;

  const getClassName = () => {
    /* console.log(
      `isWord: ${isWord}, isPhrase: ${isPhrase}, isWordPhrase: ${isWordPhrase}, props.mode: ${props.mode}, props.word: ${props.word}`
    ); */

    let result = styles.textbox;
    if (isHovered || props.isHighlighted) result += ` ${styles.bubbleHovered}`;
    else if (props.isHighlightedFromVideo)
      result += ` ${styles.bubbleVideoHovered}`;
    if ((isWord && props.mode === "words") || (isWord && props.mode === "all"))
      result += ` ${styles.bubbleWord}`;
    if (
      (isPhrase && props.mode === "phrases") ||
      (isPhrase && props.mode === "all")
    )
      result += ` ${styles.bubblePhrase}`;
    if (isWordPhrase && props.mode === "all")
      result += ` ${styles.bubbleWordPhrase}`;
    return result;
  };

  /* const getClassName = () => {
    //console.log(`isWord: ${isWord}, isPhrase: ${isPhrase}, isWordPhrase: ${isWordPhrase}, props.mode: ${props.mode}, props.word: ${props.word}`);

    let result = styles.textbox;
    if (isHovered || props.isHighlighted) result += ` ${styles.bubbleHovered}`;
    else if (props.isHighlightedFromVideo)
      result += ` ${styles.bubbleVideoHovered}`;
    if ((isWord && props.mode === "words") || (isWord && props.mode === "all"))
      result += ` ${styles.bubbleWord}`;
    if (
      (isPhrase && props.mode === "phrases") ||
      (isWordPhrase && props.mode === "phrases") ||
      (isPhrase && props.mode === "all")
    )
      result += ` ${styles.bubblePhrase}`;
    if (isWordPhrase && props.mode === "all")
      result += ` ${styles.bubbleWordPhrase}`;
    return result;
  }; */

  useEffect(() => {
    if (
      isMobileDevice ||
      (props.isHighlightedFromVideo && props.mode === "sentences")
    ) {
      setIsTooltipVisible(true);
    } else {
      setIsTooltipVisible(false);
    }
  }, [isMobileDevice, props.isHighlightedFromVideo]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
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
    setIsTooltipVisible(false);
  };

  const handleMouseEnter = () => {
    props.onMouseEnter?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!
    );
    clearHoverTimeout();
    hoverTimeout.current = window.setTimeout(() => setIsHovered(true), 300);
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    hoverTimeout.current = window.setTimeout(
      () => setIsHovered(false),
      mouseLeaveDelay * 1500
    );
  };

  const handleMouseUp = () => {
    props.onMouseUp?.(
      props.sentenceTranslation!,
      props.sentenceNumber!,
      props.translation!
    );
  };

  const commonTooltipProps = {
    //open: isTooltipVisible || !props.isHighlightedFromVideo || isHovered,
    open: isTooltipVisible || isHovered,
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
      //props.highlightPositions?.includes(props.wordIndex!) ||
      //props.isHighlighted ||
      props.isHighlightedFromVideo || isHovered;

    if (!shouldShowTooltip) {
      return children as React.ReactElement;
    }

    if (props.mode === "all") {
      return (
        <Tooltip
          {...commonTooltipProps}
          title={props.translation}
          open={isHovered}
          mouseLeaveDelay={mouseLeaveDelay}
        >
          <Tooltip
            {...commonTooltipProps}
            align={{ offset: [0, -50] }}
            title={props.sentenceTranslation}
            open={isHovered}
            mouseLeaveDelay={mouseLeaveDelay}
          >
            {children}
          </Tooltip>
        </Tooltip>
      );
    }

    const title =
      props.mode === "words" || props.mode === "phrases"
        ? props.translation
        : props.sentenceTranslation;

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
      className={getClassName()}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    >
      {props.mode === "sentences" ? props.word + "\n" : props.word + " "}
    </Text>
  );
};

export default TranslateWord;
