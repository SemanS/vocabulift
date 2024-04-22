import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TranslateWord.module.less";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";
import { isSingleWord } from "@/utils/utilMethods";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface TranslateWordProps {
  id?: string;
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
  const [isLastInPhrase, setIsLastInPhrase] = useState(false);

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

  const getClassName = () => {
    let classes = [`translate-word ${styles.textbox}`];
    if (props.isHighlightedFromVideo) classes.push(styles.bubbleVideoHovered);
    if (isHovered || props.isHighlighted) classes.push(styles.bubbleHovered);

    if (
      (isWord || isWordPhrase) &&
      (props.mode === "words" || props.mode === "all")
    ) {
      classes.push(styles.bubbleWord); // Apply word specific style
    }
    if (isPhrase && (props.mode === "phrases" || props.mode === "all")) {
      classes.push(styles.bubblePhrase); // Apply phrase specific style
    }

    if (isLastInPhrase) {
      classes.push(styles.lastInPhrase); // Specific handling for last in phrase
    }
    return classes.join(" ");
  };

  useEffect(() => {
    if (props.isHighlightedFromVideo && textRef.current) {
      textRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [props.isHighlightedFromVideo]);

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
    if (props.mode === "sentences") return;
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
    isLastInPhrase,
  ]);

  const renderTooltip = (children: React.ReactNode) => {
    if (props.isSelecting || !React.isValidElement(children)) {
      return children as React.ReactElement;
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
    if (props.mode === "sentences") return;
    props.onTouchStart?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!,
      event
    );
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (props.mode === "sentences") return;
    props.onTouchMove?.(
      props.word!,
      props.sentenceNumber!,
      props.sentenceText!,
      event
    );
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (props.mode === "sentences") return;
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

  useEffect(() => {
    const isLastWord = userWords!.some(
      (word) => props.wordIndex === word.phrase.endPosition
    );
    const isLastInPhraseForPhrases = userPhrases!.some(
      (phrase) => props.wordIndex === phrase.phrase.endPosition
    );
    if (props.mode === "words") {
      setIsLastInPhrase(isLastWord);
    } else if (props.mode === "phrases") {
      setIsLastInPhrase(isLastInPhraseForPhrases);
    } else if (props.mode === "all") {
      setIsLastInPhrase(isLastWord || isLastInPhraseForPhrases);
    }
  }, [userPhrases, userWords, props.wordIndex, props.mode]);

  return renderTooltip(
    <span
      id={props.id}
      style={{
        cursor: props.mode !== "sentences" ? "pointer" : "",
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
      {props.word}
      {props.mode === "sentences"
        ? "\n"
        : isLastInPhrase || isHovered
        ? ""
        : " "}
    </span>
  );
};

export default TranslateWord;
