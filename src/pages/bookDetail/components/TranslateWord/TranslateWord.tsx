import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TranslateWord.module.less";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";
import { isSingleWord } from "@/utils/utilMethods";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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
      if (userWords)
        userWords.forEach((userWord) => {
          setIsWord(true);
        });

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

  /* const getClassName = () => {
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
  }; */

  const getClassName = () => {
    if (props.isHighlightedFromVideo) {
      return `${styles.textbox} ${styles.bubbleVideoHovered}`;
    }

    let result = styles.textbox;

    if (isHovered || props.isHighlighted) {
      result += ` ${styles.bubbleHovered}`;
    }

    if (
      (isWord && props.mode === "words") ||
      (isWord && props.mode === "all")
    ) {
      result += ` ${styles.bubbleWord}`;
    }

    if (
      (isPhrase && props.mode === "phrases") ||
      (isPhrase && props.mode === "all")
    ) {
      result += ` ${styles.bubblePhrase}`;
    }

    if (isWordPhrase && props.mode === "all") {
      result += ` ${styles.bubbleWordPhrase}`;
    }

    return result;
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isMobile = !!userAgent.match(/Android|iPhone/i);
    setIsMobileDevice(isMobile);

    const handleContextMenu = (event: Event) => {};

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
    if (isMobileDevice || props.isHighlightedFromVideo) {
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
    setIsHovered(true);
    console.log("isHovered" + JSON.stringify(isHovered, null, 2));
  };

  const handleMouseUp = () => {
    props.onMouseUp?.(
      props.sentenceTranslation!,
      props.sentenceNumber!,
      props.translation!
    );
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
    if (props.isSelecting || !React.isValidElement(children)) {
      return children as React.ReactElement;
    }

    const shouldShowTooltip = props.isHighlightedFromVideo || isHovered;

    if (!shouldShowTooltip) {
      return children;
    }

    if (props.mode === "all") {
      return (
        <Tippy
          content={props.translation}
          visible={isHovered}
          placement="bottom"
        >
          <Tippy
            content={props.sentenceTranslation}
            visible={isHovered}
            placement="top"
          >
            {children}
          </Tippy>
        </Tippy>
      );
    }

    const title =
      props.mode === "words" || props.mode === "phrases"
        ? props.translation
        : props.sentenceTranslation;

    return (
      <Tippy
        content={title}
        visible={
          isHovered ||
          (props.isHighlightedFromVideo && props.mode === "sentences")
        }
      >
        {children}
      </Tippy>
    );
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    props.onTouchStart?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!,
      event
    );
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    props.onTouchMove?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!,
      event
    );
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    props.onTouchEnd?.(
      props.sentenceTranslation!,
      props.sentenceNumber!,
      props.translation!,
      event
    );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return renderTooltip(
    <span
      style={{
        cursor: "pointer",
        whiteSpace: "pre-wrap",
        touchAction: props.isSelecting ? "none" : "auto",
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
