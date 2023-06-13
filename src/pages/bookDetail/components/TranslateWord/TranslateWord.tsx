import { Tooltip } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TranslateWord.module.less";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";
import { isSingleWord } from "@/utils/utilMethods";

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
  currentPage: number;
  sentencesPerPage: number;
  selectedLanguageTo: string;
  onTouchStart?: (
    word: string,
    sentenceNumber: number,
    sentenceText: string,
    event: React.TouchEvent
  ) => void;
  onTouchMove?: (
    word: string,
    sentenceNumber: number,
    sentenceText: string,
    event: React.TouchEvent
  ) => void;
  onTouchEnd?: (
    sentenceTranslation: string,
    sentenceNumber: number,
    translation: string,
    event: React.TouchEvent
  ) => void;
}

const TranslateWord: React.FC<TranslateWordProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [isWord, setIsWord] = useState(false);
  const [isPhrase, setIsPhrase] = useState(false);
  const [isWordPhrase, setIsWordPhrase] = useState(false);

  const textRef = useRef<HTMLDivElement | null>(null);

  const mouseLeaveDelay = 0.1;

  useEffect(() => {
    // Reset all the highlight-related states whenever currentPage changes.
    setIsHovered(false);
    setIsWord(false);
    setIsPhrase(false);
    setIsWordPhrase(false);
  }, [
    props.currentPage,
    props.sentencesPerPage,
    props.selectedLanguageTo,
    props.vocabularyListUserPhrases,
  ]);

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

  const userWords = useMemo(() => {
    return props.vocabularyListUserPhrases?.filter(({ phrase }) => {
      const inSentence = phrase.sentenceNo === props.sentenceNumber;
      const inPosition =
        phrase.startPosition <= props.wordIndex! &&
        phrase.endPosition >= props.wordIndex! &&
        phrase.targetLanguage === props.selectedLanguageTo &&
        isSingleWord(phrase.sourceText);
      return inSentence && inPosition;
    });
  }, [
    props.vocabularyListUserPhrases,
    props.sentenceNumber,
    props.wordIndex,
    props.selectedLanguageTo,
  ]);

  const userPhrases = useMemo(() => {
    return props.vocabularyListUserPhrases?.filter(({ phrase }) => {
      const inSentence = phrase.sentenceNo === props.sentenceNumber;
      const inPosition =
        phrase.startPosition <= props.wordIndex! &&
        phrase.endPosition >= props.wordIndex! &&
        phrase.targetLanguage === props.selectedLanguageTo &&
        !isSingleWord(phrase.sourceText);
      return inSentence && inPosition;
    });
  }, [
    props.vocabularyListUserPhrases,
    props.sentenceNumber,
    props.wordIndex,
    props.selectedLanguageTo,
  ]);

  useEffect(() => {
    if (props.mode === "words") {
      props.vocabularyListUserPhrases?.filter(({ phrase, sentenceNo }) => {
        const inSentence = sentenceNo === props.sentenceNumber;
        const inPosition =
          phrase.startPosition <= props.wordIndex! &&
          phrase.endPosition >= props.wordIndex! &&
          phrase.targetLanguage === props.selectedLanguageTo &&
          isSingleWord(phrase.sourceText);
        return inSentence && inPosition && setIsWord(true);
      });
    }

    if (props.mode === "phrases") {
      props.vocabularyListUserPhrases?.filter(({ phrase }) => {
        const inSentence = phrase.sentenceNo === props.sentenceNumber;
        const inPosition =
          phrase.startPosition <= props.wordIndex! &&
          phrase.endPosition >= props.wordIndex! &&
          phrase.targetLanguage === props.selectedLanguageTo &&
          !isSingleWord(phrase.sourceText);
        return inSentence && inPosition && setIsPhrase(true);
      });
    }
    if (props.mode === "all") {
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
    props.sentenceNumber,
    props.wordIndex,
    isWord,
    isPhrase,
    props.mode,
    props.currentPage,
    props.sentencesPerPage,
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

  useEffect(() => {
    // Check if the user is on a mobile device
    const userAgent = window.navigator.userAgent;
    const isMobile = !!userAgent.match(/Android|iPhone/i);
    setIsMobileDevice(isMobile);

    const handleContextMenu = (event: Event) => {
      //event.preventDefault();
    };

    if (isMobile) {
      window.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, []);

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
  }, [isHovered]);

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
    hoverTimeout.current = window.setTimeout(() => setIsHovered(true), 200);
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    //handleTouchEnd();
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

  const className = useMemo(getClassName, [
    isHovered,
    props.isHighlighted,
    props.isHighlightedFromVideo,
    isWord,
    isPhrase,
    isWordPhrase,
    props.mode,
  ]);

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

  const handleTouchStart = (event: React.TouchEvent) => {
    //event.preventDefault();
    props.onTouchStart?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!,
      event
    );

    setIsTooltipVisible(false);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    //event.preventDefault();
    props.onTouchMove?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!,
      event
    );

    clearHoverTimeout();
    hoverTimeout.current = window.setTimeout(() => setIsHovered(true), 300);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    //event.preventDefault();
    props.onTouchEnd?.(
      props.sentenceTranslation!,
      props.sentenceNumber!,
      props.translation!,
      event
    );

    clearHoverTimeout();
    hoverTimeout.current = window.setTimeout(
      () => setIsHovered(false),
      mouseLeaveDelay * 1500
    );
  };

  return renderTooltip(
    <span
      style={{
        cursor: "pointer",
        whiteSpace: "pre-wrap",
        touchAction: "none",
      }}
      ref={textRef}
      className={`${className} ${styles.disableSelection} translate-word`}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-word-index={props.wordIndex}
    >
      {props.mode === "sentences" ? props.word + "\n" : props.word + " "}
    </span>
  );
};

export default TranslateWord;
