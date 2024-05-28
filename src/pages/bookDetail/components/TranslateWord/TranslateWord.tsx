import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TranslateWord.module.less";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";
import { isSingleWord } from "@/utils/utilMethods";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//import { Select } from "antd";
import Select from "react-select";
import { SentenceWordData } from "@/models/sentences.interfaces";
import { WordData } from "@models/word.interface";
import { shuffleArray } from "@/utils/stringUtils";

interface TranslateWordProps {
  id?: string;
  word?: string;
  translation?: string;
  sentenceNumber?: number;
  sentenceText?: string;
  partOfSpeech?: any[];
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
  isWordHighlightedFromVideo?: boolean;
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
  selectedPartOfSpeech?: string;
  sentenceWord: SentenceWordData;
}

const TranslateWord: React.FC<TranslateWordProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [isWord, setIsWord] = useState(false);
  const [isPhrase, setIsPhrase] = useState(false);
  const [isWordPhrase, setIsWordPhrase] = useState(false);
  const [isLastInPhrase, setIsLastInPhrase] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [selectedValues, setSelectedValues] = useState({});

  const textRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef([]);

  useEffect(() => {
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

    if (props.mode === "phrases" || props.mode === "words") {
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

  function insertRandomly(shuffledArray, newItem) {
    let slicedArray = shuffledArray.slice(0, 3);

    const randomIndex = Math.floor(Math.random() * slicedArray.length);

    slicedArray.splice(randomIndex, 0, newItem);

    return slicedArray;
  }

  const getClassName = () => {
    let classes = [styles.textbox];
    if (props.isWordHighlightedFromVideo)
      classes.push(styles.fadeIn, styles.bubbleWordHovered);
    if (props.isHighlightedFromVideo) classes.push(styles.bubbleVideoHovered);
    if (isHovered || props.isHighlighted) {
      if (!isLastInPhrase) {
        classes.push(styles.bubbleHovered, styles.noMarginRight); // Add no margin right if not the last in phrase
      } else {
        classes.push(styles.bubbleHovered); // Normal hover state with margin
      }
    }

    if (isWord && (props.mode === "words" || props.mode === "all")) {
      classes.push(styles.bubbleWord);
    }

    if (isPhrase && (props.mode === "phrases" || props.mode === "all")) {
      classes.push(styles.bubblePhrase);
    }

    if (isWordPhrase && props.mode === "all") {
      classes.push(styles.bubbleWordPhrase);
    }

    if (isLastInPhrase) {
      classes.push(styles.lastInPhrase);
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
    if (!isPositionAndSentenceMatch) {
      props.onMouseDown?.(
        props.word!,
        props.sentenceNumber!,
        props.sentenceText!
      );
    }

    setIsTooltipVisible(false);
  };

  const handleMouseEnter = () => {
    if (!isPositionAndSentenceMatch) {
      props.onMouseEnter?.(
        props.word!,
        props.sentenceNumber!,
        props.sentenceText!
      );
      setIsHovered(true);
    }
  };

  const handleMouseUp = () => {
    if (!isPositionAndSentenceMatch) {
      props.onMouseUp?.(
        props.sentenceTranslation!,
        props.sentenceNumber!,
        props.translation!
      );
    }
  };

  const className = useMemo(getClassName, [
    isHovered,
    props.isHighlighted,
    props.isHighlightedFromVideo,
    props.isWordHighlightedFromVideo,
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
          placement="top"
          appendTo={() => document.body}
        >
          {/* <Tippy
            content={props.sentenceTranslation}
            visible={isHovered}
            placement="top"
          > */}
          {children}
          {/* </Tippy> */}
        </Tippy>
      );
    }

    const title =
      props.mode === "words" || props.mode === "phrases"
        ? props.translation
        : props.sentenceText;

    return (
      <Tippy
        content={title}
        visible={
          isHovered ||
          (props.isHighlightedFromVideo && props.mode === "sentences" && false)
        }
        placement={"top"}
        arrow={false}
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
    // Find if the word is part of any defined phrase
    const phraseWhereWordIs = userPhrases!.find(
      (p) =>
        props.wordIndex! >= p.phrase.startPosition &&
        props.wordIndex! <= p.phrase.endPosition
    );

    // Check if the word is the last in a found phrase
    const isEndOfFoundPhrase =
      phraseWhereWordIs &&
      props.wordIndex === phraseWhereWordIs.phrase.endPosition;

    // Check directly across all phrases and words
    const isEndOfAnyPhrase = userPhrases!.some(
      (p) => props.wordIndex === p.phrase.endPosition
    );
    const isEndOfAnyWord = userWords!.some(
      (w) => props.wordIndex === w.phrase.endPosition
    );

    // Set 'isLastInPhrase' based on if it's the end position in any phrase or word

    if (props.mode === "all") {
      setIsLastInPhrase(
        isEndOfFoundPhrase || (isEndOfAnyPhrase && isEndOfAnyWord)
      );
    }

    if (props.mode === "words") {
      setIsLastInPhrase(isEndOfAnyWord);
    }
  }, [userPhrases, userWords, props.wordIndex, props.mode]);

  useEffect(() => {
    if (isCorrect !== null) {
      // Perform any actions that depend on the updated value of isCorrect
    }
  }, [isCorrect]);

  const handleSelectChange = (value, wordIndex) => {
    const selectedText = value.value;
    const position = props.wordIndex;
    const sentenceNumber = props.sentenceNumber;

    // Finding the matching word in the part of speech array using current component props
    const matchingWord = props.partOfSpeech?.find(
      (word) =>
        word.position === position && word.sentenceNumber === sentenceNumber
    );

    const correctText = matchingWord ? matchingWord.text : "";
    const isSelectionCorrect =
      selectedText === correctText.replace(/[.,?]/g, "");
    setIsCorrect(isSelectionCorrect); // Update the correctness state

    const key = `${props.currentPage}_${props.wordIndex}`;

    setSelectedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getSelectedValue = () => {
    const key = `${props.currentPage}_${props.wordIndex}`;
    return selectedValues[key] || null;
  };

  // Check if the current position and sentence number match the word's properties
  const isPositionAndSentenceMatch = props.partOfSpeech?.some(
    (word: SentenceWordData) => {
      return (
        word.position === props.wordIndex &&
        word.sentenceNumber === props.sentenceNumber
      );
    }
  );

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const computeOptions = () => {
      if (!props.partOfSpeech || !props.sentenceWord) {
        return [{ label: "No Options", value: "" }];
      }

      const filteredOptions = props.partOfSpeech
        .filter(
          (wordObj) =>
            wordObj.partOfSpeech?.toLowerCase() ===
            props.sentenceWord.partOfSpeech?.toLowerCase()
        )
        .map((wordObj) => ({
          label: wordObj.text.replace(/[.,?]/g, ""),
          value: wordObj.text.replace(/[.,?]/g, ""),
        }));

      const uniqueOptions = filteredOptions.filter(
        (option, index, self) =>
          index ===
          self.findIndex(
            (t) => t.label.toLowerCase() === option.label.toLowerCase()
          )
      );

      const matchingWord = props.partOfSpeech.find(
        (word) =>
          word.position === props.wordIndex &&
          word.sentenceNumber === props.sentenceNumber
      );

      const correctText = matchingWord
        ? matchingWord.text.replace(/[.,?]/g, "")
        : null;
      let shuffledOptions = shuffleArray(uniqueOptions);

      if (correctText) {
        const isCorrectOptionIncluded = shuffledOptions.find(
          (option) => option.value === correctText
        );

        if (isCorrectOptionIncluded) {
          const correctIndex = shuffledOptions.findIndex(
            (option) => option.value === correctText
          );

          const [correctOption] = shuffledOptions.splice(correctIndex, 1);

          shuffledOptions.unshift(correctOption);
        } else {
          const randomIndex = Math.floor(
            Math.random() * (shuffledOptions.length + 1)
          );
          shuffledOptions.splice(randomIndex, 0, {
            label: correctText,
            value: correctText,
          });
        }
      }

      return shuffleArray(shuffledOptions.slice(0, 4));
    };

    if (!options.length) {
      // Ensuring options are recomputed only if they are empty
      const newOptions = computeOptions();
      optionsRef.current = newOptions;
      setOptions(newOptions);
    }
  }, [
    props.partOfSpeech,
    props.sentenceWord,
    props.wordIndex,
    props.sentenceNumber,
  ]);

  const getBackgroundColor = (wordIndex) => {
    const currentPageKey = `${props.currentPage}_${wordIndex}`;
    const selectedOption = selectedValues[currentPageKey];
    if (!selectedOption) return "white";

    const matchingWord = props.partOfSpeech?.find(
      (word) =>
        word.position === wordIndex &&
        word.sentenceNumber === props.sentenceNumber
    );

    const correctText = matchingWord ? matchingWord.text : "";
    const isSelectionCorrect =
      selectedOption.value === correctText.replace(/[.,?]/g, "");

    return isSelectionCorrect ? "green" : "red";
  };

  const customStyles = {
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    container: (provided) => ({
      ...provided,
      display: "inline-block",
    }),
    control: (provided) => ({
      ...provided,
      border: 0,
      boxShadow: "none",
      cursor: "pointer",
      paddingLeft: "10px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    valueContainer: (base) => ({
      ...base,
      background: getBackgroundColor(props.wordIndex),
      color: "white",
      width: "100%",
      padding: "0 8px",
    }),
  };

  const wordDisplay = isPositionAndSentenceMatch ? (
    <Select
      onChange={(value) => handleSelectChange(value, props.wordIndex)}
      className="nonInteractiveSelect"
      options={options}
      styles={customStyles}
      menuPortalTarget={document.body}
      value={getSelectedValue(props.wordIndex)}
      placeholder={"__________"}
      menuShouldScrollIntoView={false}
    />
  ) : (
    <span>{props.word}</span>
  );

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
      {wordDisplay}
      {props.mode === "sentences" ? "\n" : isLastInPhrase ? "" : " "}
    </span>
  );
};

export default TranslateWord;
