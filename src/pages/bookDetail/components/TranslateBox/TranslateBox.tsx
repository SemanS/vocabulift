import { useEffect, useMemo, useRef, useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import { useParams } from "react-router-dom";
import {
  getHighlightPositions,
  isWordInHighlightedPhrase,
} from "@/utils/getHighlightPosition";
import { UserSentence } from "@/models/userSentence.interface";
import { addUserPhrase } from "@/services/userService";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import React from "react";
import { SentenceData, SentenceWordData } from "@/models/sentences.interfaces";
import { Snapshot } from "@/models/snapshot.interfaces";
import { SelectedWord } from "@/models/utils.interface";
import { getPhraseIfNotInHighlighted, isSingleWord } from "@/utils/utilMethods";
import MagnifyingGlass from "../MagnifyingGlass/MagnifyingGlass";
import QuizComponent from "../Quiz/QuizComponent";
import { useIntl } from "react-intl";
import Select from "react-select";
import Tippy from "@tippyjs/react";
import styles from "./TranslateBox.module.less";
import { Button, Divider } from "antd";
import { shuffleArray } from "@/utils/stringUtils";

interface TenseSelection {
  sentenceNumber: number;
  tense: string | string[];
}

interface TranslateBoxProps {
  mode: string;
  sourceLanguage: string;
  snapshots: Snapshot[];
  currentTextIndex: number;
  sentenceFrom: number;
  sentencesPerPage: number;
  currentPage: number;
  libraryTitle: string | undefined;
  userSentences: UserSentence[];
  vocabularyListUserPhrases?: VocabularyListUserPhrase[] | null;
  highlightedSentenceIndex?: number | null;
  highlightedWordIndex?: number | null;
  onAddUserPhrase: (vocabularyListUserPhrase: VocabularyListUserPhrase) => void;
  selectedLanguageTo: string;
  onChangeMode: (mode: string) => void;
  magnifyingGlassRef: any;
  addSteps: any;
  partOfSpeech: string[];
  isTenseVisible: boolean;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  mode,
  sourceLanguage,
  snapshots,
  currentTextIndex,
  sentenceFrom,
  sentencesPerPage,
  currentPage,
  libraryTitle,
  userSentences,
  vocabularyListUserPhrases,
  highlightedSentenceIndex,
  highlightedWordIndex,
  onAddUserPhrase,
  selectedLanguageTo,
  onChangeMode,
  magnifyingGlassRef,
  addSteps,
  partOfSpeech,
  isTenseVisible,
}) => {
  const { libraryId } = useParams();
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedSentenceText, setSelectedSentenceText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const prevLanguageRef = useRef(selectedLanguage);
  const [saveWordComplete, setSaveWordComplete] = useState(false);
  const [sentenceNo, setSentenceNo] = useState<number>();
  const touchActive = useRef(false);
  const [magnifyingGlassStyle, setMagnifyingGlassStyle] = useState<any | null>(
    null
  );
  const intl = useIntl();

  const [tenses, setTenses] = useState<any[]>([]);

  useEffect(() => {
    const translateBoxSteps = [
      {
        content: (
          <div
            style={{ fontFamily: "Arial, sans-serif", color: "#333" }}
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({ id: "joyride.video.step.1" }),
            }}
          />
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        placement: "top",
        spotlightClicks: false,
        target: ["#word-0-0", "#word-0-1"],
        title: intl.formatMessage({ id: "joyride.video.step.1.title" }),
        showSkipButton: false,
      },
    ];

    addSteps(translateBoxSteps);
  }, [addSteps]);

  const removeSpecialChars = (input: string) => {
    const regex = /[.,?!“”„:]+/g;
    return input.replace(regex, "");
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(isMobile);
    };
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  useEffect(() => {
    setSelectedLanguage(selectedLanguageTo);
  }, [selectedLanguageTo]);

  useEffect(() => {
    prevLanguageRef.current = selectedLanguage;
  }, [selectedLanguageTo]);

  async function saveWord(
    phrase: string,
    startPosition: number,
    endPosition: number,
    sentenceTranslation: string,
    translation: string | null
  ): Promise<string | undefined> {
    let savedPhrase: string | undefined;
    let lastWord = sentenceTranslation.trim().split(" ").pop() as string;
    let lastIndex = selectedSentenceText.lastIndexOf(lastWord);
    if (phrase) {
      const response = await addUserPhrase(
        mode === "sentences"
          ? selectedSentenceText
          : isSingleWord(phrase)
          ? removeSpecialChars(phrase)
          : phrase,
        isSingleWord(phrase) ? translation : null,
        libraryId,
        selectedSentence,
        selectedSentenceText,
        sentenceTranslation,
        mode === "sentences" ? 0 : startPosition,
        mode === "sentences" ? lastIndex : endPosition,
        sourceLanguage,
        selectedLanguage,
        sentencesPerPage,
        currentPage,
        libraryTitle,
        sessionStorage.getItem("access_token")
      );
      if (response.status === "success") {
        const vocabularyListUserPhrase: VocabularyListUserPhrase = {
          phrase: response.data,
          sentenceNo: response.data.sentenceNo,
        };
        onAddUserPhrase(vocabularyListUserPhrase);
        savedPhrase = response.data;
      }
    }
    return savedPhrase;
  }

  useEffect(() => {
    setSelectedWords([]);
  }, [vocabularyListUserPhrases]);

  const checkCollision = (
    highlightedWords: any[],
    fromIndex: number,
    toIndex: number
  ) => {
    for (let i = fromIndex; i <= toIndex; i++) {
      if (highlightedWords.includes(i)) {
        return true;
      }
    }
    return false;
  };

  const buildWordObjects = (
    wordsArray: string[],
    fromIndex: number,
    toIndex: number,
    sentenceNumber: number
  ) => {
    let tempSelectedWords = [];
    for (let i = fromIndex; i <= toIndex; i++) {
      tempSelectedWords.push({
        word: wordsArray[i],
        wordIndexInSentence: i,
        sentenceNumber: sentenceNumber,
      });
    }
    return tempSelectedWords;
  };

  const handleMouseEvent = (
    eventType: "down" | "enter",
    word: string,
    sentenceNumber: number,
    sentenceText: string,
    wordIndexInSentence: number
  ) => {
    if (eventType === "down") {
      setMouseDown(true);
      touchActive.current = true;
      setSelectedSentence(sentenceNumber);
      setSelectedWords([
        { word, wordIndexInSentence, sentenceNumber, sentenceText },
      ]);
      setSelectedSentenceText(sentenceText);
    } else if (
      ((eventType === "enter" && mouseDown) ||
        (eventType === "enter" && touchActive.current)) &&
      selectedSentence === sentenceNumber
    ) {
      setSelectedWords((prevWords: any) => {
        if (!prevWords || prevWords.length == 0) {
          return [];
        }
        const initialSelected = prevWords[0];
        const sentenceObj: SentenceData | undefined = visibleSourceTexts.find(
          (s) => s.sentenceNo === sentenceNumber
        );
        const sentenceLines = sentenceObj!.sentenceText.split("\n");
        const wordsArray = sentenceLines.flatMap((line: any) =>
          line
            .split(" ")
            .map((word: string) => word.trim())
            .filter((word: string) => word !== "")
        );

        const highlightedWords = getHighlightPositions(
          userSentences,
          sentenceNumber,
          selectedLanguageTo,
          mode
        );

        let hasCollision = false;
        let tempSelectedWords;

        if (wordIndexInSentence >= initialSelected.wordIndexInSentence) {
          hasCollision = checkCollision(
            highlightedWords,
            initialSelected.wordIndexInSentence,
            wordIndexInSentence
          );
          tempSelectedWords = buildWordObjects(
            wordsArray,
            initialSelected.wordIndexInSentence,
            wordIndexInSentence,
            sentenceNumber
          );
        } else {
          hasCollision = checkCollision(
            highlightedWords,
            wordIndexInSentence,
            initialSelected.wordIndexInSentence
          );
          tempSelectedWords = buildWordObjects(
            wordsArray,
            wordIndexInSentence,
            initialSelected.wordIndexInSentence,
            sentenceNumber
          );
          tempSelectedWords.reverse();
        }

        return hasCollision ? prevWords : tempSelectedWords;
      });
    }
  };

  const handleMouseUp = async (
    sentenceTranslation: string,
    sentenceNumber: number,
    translation: string | null
  ) => {
    let blockMode = mode;
    if (selectedWords.length > 1) {
      onChangeMode("all");
    }

    if (selectedWords.length === 1 && mode !== "all") {
      onChangeMode("words");
    }

    if (selectedWords.length === 1 && mode === "phrases") {
      onChangeMode("all");
      blockMode = "all";
    }

    /* if (
      isWordInVocabularyList(
        blockMode,
        selectedWords,
        vocabularyListUserPhrases
      )
    ) {
      notification.open({
        message: "Word Found",
        description: "The selected word is in the vocabulary list.",
        type: "info",
      });
    } */

    setMouseDown(false);
    setSentenceNo(sentenceNumber);

    const sortedSelectedWords = selectedWords.sort(
      (a, b) => a.wordIndexInSentence - b.wordIndexInSentence
    );
    const startPosition = sortedSelectedWords[0].wordIndexInSentence;
    const endPosition =
      sortedSelectedWords[sortedSelectedWords.length - 1].wordIndexInSentence;

    const phrase = getPhraseIfNotInHighlighted(
      vocabularyListUserPhrases!,
      sortedSelectedWords,
      sentenceNumber,
      blockMode
    );

    const isPhraseInVocabulary = vocabularyListUserPhrases!.some(
      (item) =>
        item.phrase.startPosition === startPosition &&
        item.phrase.endPosition === endPosition &&
        item.phrase.sentenceNo === sentenceNumber
    );

    if (isPhraseInVocabulary) {
      return;
    }

    const savedPhrase = await saveWord(
      phrase,
      startPosition,
      endPosition,
      sentenceTranslation,
      translation
    );

    if (savedPhrase !== undefined) {
      setSaveWordComplete(true);
    }
  };

  const getVisibleTexts = (textArray: any[]) =>
    textArray.slice(
      currentTextIndex - sentenceFrom + 1,
      currentTextIndex - sentenceFrom + 1 + sentencesPerPage
    );

  const visibleSourceTexts: SentenceData[] = getVisibleTexts(
    getSentenceDataByLanguage(snapshots, sourceLanguage)
  );
  const visibleTargetTexts: SentenceData[] = getVisibleTexts(
    getSentenceDataByLanguage(snapshots, selectedLanguage)
  );

  useEffect(() => {
    if (saveWordComplete) {
      setSaveWordComplete(false);
    }
  }, [saveWordComplete]);

  function getSentenceDataByLanguage(
    snapshots: Snapshot[],
    language: string
  ): SentenceData[] {
    let sentences: SentenceData[] = [];

    for (let snapshot of snapshots) {
      if (snapshot.language === language) {
        sentences = sentences.concat(snapshot.sentencesData);
        break;
      }
    }
    if (sentences.length === 0 && snapshots.length > 0) {
      sentences = snapshots[0].sentencesData;
    }

    return sentences;
  }

  useEffect(() => {
    touchActive.current = true;
  }, [vocabularyListUserPhrases]);

  const handleTouchEvent = (
    type: "start" | "move" | "end",
    word: string,
    sentenceNumber: number,
    sentenceText: string,
    wordIndex: number,
    event: React.TouchEvent
  ) => {
    if (isMobile) {
      switch (type) {
        case "start":
          touchActive.current = true;
          handleMouseEvent(
            "down",
            word,
            sentenceNumber,
            sentenceText,
            wordIndex
          );
          const touch = event.touches[0];

          const elementUnderFinger = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );

          const newWordElement = elementUnderFinger!.closest(".translate-word");
          const newWordElementRect = newWordElement
            ? newWordElement.getBoundingClientRect()
            : null;
          if (newWordElement) {
            setMagnifyingGlassStyle({
              bottom: `${
                window.innerHeight -
                (newWordElementRect?.top || touch.clientY) +
                20
              }px`,
              left: `${newWordElementRect?.left || touch.clientX}px`,
              visibility: "visible",
            });
          }
          break;
        case "move":
          if (touchActive.current) {
            touchActive.current = true;
            const touch = event.touches[0];

            const elementUnderFinger = document.elementFromPoint(
              touch.clientX,
              touch.clientY
            );
            const newWordElement =
              elementUnderFinger!.closest(".translate-word");
            if (newWordElement) {
              const newWordIndexStr =
                newWordElement.getAttribute("data-word-index");
              if (newWordIndexStr === null) {
                console.error(
                  `Could not find "data-word-index" attribute in element`
                );
                return;
              }
              const newWordIndex = parseInt(newWordIndexStr, 10);
              if (newWordIndex !== wordIndex) {
                handleMouseEvent(
                  "enter",
                  word,
                  sentenceNumber,
                  sentenceText,
                  newWordIndex
                );
              }
            }
          }
          break;
        case "end":
          if (magnifyingGlassRef.current) {
            magnifyingGlassRef.current.style.visibility = "hidden";
          }
          touchActive.current = false;
          handleMouseUp(word, sentenceNumber, sentenceText);
          setMagnifyingGlassStyle({ visibility: "hidden" });
          break;
      }
    }
  };

  function extractUniqueVerbs(sentences, partsOfSpeechForExtract: string[]) {
    let usedVerbs = new Set(); // Track verbs that have already been used
    let results = [];

    sentences.forEach((sentence, index) => {
      if (
        !sentence ||
        !sentence.sentenceWords ||
        sentence.sentenceWords.length === 0
      ) {
        console.log(
          `No words or sentence is malformed at index ${index}:`,
          sentence
        );
        results.push({ error: "No valid words", index }); // Optionally handle no words scenario
        return;
      }

      // Filter words to find those with partOfSpeech marked as "verb"
      let matchingWords = sentence.sentenceWords
        .filter(
          (word) =>
            typeof word.partOfSpeech === "string" && // Ensure it's a string
            partsOfSpeechForExtract.includes(word.partOfSpeech.toLowerCase())
        )
        .map((word) => ({
          partOfSpeech: word.partOfSpeech,
          text: word.wordText,
          position: word.position,
          sentenceNumber: sentence.sentenceNo,
        }));

      // Find the first unique verb not already used
      let selectedWord = matchingWords.find(
        (verb) => !usedVerbs.has(verb.text)
      );

      // If all verbs in the sentence are already used, skip or handle specially
      if (!selectedWord && matchingWords.length > 0) {
        selectedWord = matchingWords[0]; // Optional: choose to use the first if all are used
      }

      if (selectedWord) {
        results.push(selectedWord);
        usedVerbs.add(selectedWord.text);
      } else {
        // Handle case where no verbs are found in the sentence
        results.push({
          error: "No verbs found",
          sentenceNumber: sentence.sentenceNo,
        });
      }
      results.push(...matchingWords);
    });

    return results;
  }

  function extractTenseAndSentenceNumber(sentences) {
    let results = [];

    sentences.forEach((sentence, index) => {
      if (!sentence || !sentence.sentenceNo || !sentence.tense) {
        /* console.log(`Malformed sentence at index ${index}:`, sentence); */
        results.push({ error: "Malformed sentence", index });
        return;
      }

      results.push({
        tense: sentence.tense,
        sentenceNumber: sentence.sentenceNo,
      });
    });

    return results;
  }

  const memoizedTenseAndSentenceNumber = useMemo(
    () => extractTenseAndSentenceNumber(visibleSourceTexts),
    [visibleSourceTexts]
  );

  const memoizedPartOfSpeech = useMemo(
    () => extractUniqueVerbs(visibleSourceTexts, partOfSpeech),
    [visibleSourceTexts, partOfSpeech]
  );

  const [selectedTenses, setSelectedTenses] = useState<TenseSelection[]>([]);

  const handleTenseChange = (selectedOption, sentenceNumber: number) => {
    // Check if the sentence number already exists in the array
    const index = selectedTenses.findIndex(
      (tense) => tense.sentenceNumber === sentenceNumber
    );

    if (index === -1) {
      // if it doesn't exist, add it
      setSelectedTenses([
        ...selectedTenses,
        { sentenceNumber, tense: selectedOption.value },
      ]);
    } else {
      // Optional: update the tense if it already exists
      const newTenses = [...selectedTenses];
      newTenses[index].tense = selectedOption.value;
      setSelectedTenses(newTenses);
    }
  };

  const customStyles = (sentenceNumber) => {
    const currentTenseInfo = memoizedTenseAndSentenceNumber.find((tense) => {
      return tense.sentenceNumber === sentenceNumber;
    });

    const isSelected = selectedTenses?.some(
      (tense) => sentenceNumber === tense.sentenceNumber
    );

    const isTenseMatch = (tense, currentTense) => {
      if (Array.isArray(currentTense)) {
        return currentTense.includes(tense);
      }
      return tense === currentTense;
    };

    const isCorrect =
      selectedTenses.find((tense) => tense.sentenceNumber === sentenceNumber) &&
      isTenseMatch(
        selectedTenses.find((tense) => tense.sentenceNumber === sentenceNumber)
          ?.tense,
        currentTenseInfo.tense
      );

    return {
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
        fontSize: "17px",
        fontWeight: 340,
        fontFamily: `"Open Sans", sans-serif`,
        color: "black",
        borderColor: isSelected ? (isCorrect ? "green" : "red") : "grey",
        boxShadow: "none",
        cursor: "pointer",
        paddingLeft: "10px",
        minHeight: "30px",
      }),
      valueContainer: (base) => ({
        ...base,
        background: isSelected ? (isCorrect ? "green" : "red") : "white",
        color: "white",
        width: "100%",
        padding: "0 8px",
      }),
    };
  };

  const tenseOptions = [
    { label: "Simple Present", value: "Simple Present" },
    { label: "Present Continuous", value: "Present Continuous" },
    { label: "Present Perfect", value: "Present Perfect" },
    {
      label: "Present Perfect Continuous",
      value: "Present Perfect Continuous",
    },
    { label: "Simple Past", value: "Simple Past" },
    { label: "Past Continuous", value: "Past Continuous" },
    { label: "Past Perfect", value: "Past Perfect" },
    { label: "Past Perfect Continuous", value: "Past Perfect Continuous" },
    { label: "Simple Future", value: "Simple Future" },
    { label: "Future Continuous", value: "Future Continuous" },
    { label: "Future Perfect", value: "Future Perfect" },
    { label: "Future Perfect Continuous", value: "Future Perfect Continuous" },
  ];

  const options = (input) => {
    // Ensure input is treated as a string
    const inputTenses = Array.isArray(input) ? input.join(",") : String(input);
    const tenses = inputTenses.split(",").map((t) => t.trim());

    // Validate each provided tense
    const validTenses = tenses.filter((t) =>
      tenseOptions.some((option) => option.label === t)
    );
    if (validTenses.length === 0) {
      throw new Error("Invalid tenses provided.");
    }

    // Start with the tense options that match the input tenses
    const selected = validTenses.map((t) => ({ label: t, value: t }));

    // Get other tenses, excluding the provided tenses
    const otherOptions = tenseOptions.filter(
      (option) => !validTenses.includes(option.label)
    );

    // Shuffle the array to randomize selection
    for (let i = otherOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherOptions[i], otherOptions[j]] = [otherOptions[j], otherOptions[i]];
    }

    // Calculate how many more options to select to make up 4 in total
    const moreOptionsNeeded = 4 - selected.length;
    if (moreOptionsNeeded > 0 && otherOptions.length >= moreOptionsNeeded) {
      selected.push(...otherOptions.slice(0, moreOptionsNeeded));
    } else if (moreOptionsNeeded > 0) {
      // In case there are not enough other options to fill up to 4
      throw new Error("Not enough different tenses available to select from.");
    }

    return shuffleArray(selected);
  };

  /*   const [selectedTenses, setSelectedTenses] = useState(() =>
    visibleSourceTexts.map((sentence) => ({
      sentenceNumber: sentence.sentenceNo,
      selectedTense: "", // Initialize with no selection
      correctTense: sentence.tense, // This should be defined based on your actual data structure
    }))
  ); */

  const [lastHighlighted, setLastHighlighted] = useState({
    wordIndex: -1,
    sentenceIndex: -1,
  });

  useEffect(() => {
    if (highlightedWordIndex !== -1 && highlightedSentenceIndex !== -1) {
      setLastHighlighted({
        wordIndex: highlightedWordIndex,
        sentenceIndex: highlightedSentenceIndex,
      });
    }
  }, [highlightedWordIndex, highlightedSentenceIndex]);

  const [isTippyVisible, setTippyVisible] = useState(true);

  const toggleTippyVisibility = () => {
    setTippyVisible((prevState) => !prevState);
  };

  console.log("visibleTargetTexts" + JSON.stringify(visibleTargetTexts));
  return (
    <>
      {isMobile && (
        <MagnifyingGlass
          style={magnifyingGlassStyle}
          words={selectedWords}
          sentence={selectedSentenceText}
        />
      )}
      {visibleSourceTexts.map((sourceSentence, index) => {
        const targetSentence = visibleTargetTexts.find(
          (target) => target.sentenceNo === sourceSentence.sentenceNo
        );
        if (mode === "sentences") {
          return (
            <TranslateWord
              key={index}
              word={sourceSentence.sentenceText}
              translation={targetSentence?.sentenceText || ""}
              sentenceNumber={sourceSentence.sentenceNo}
              sentenceText={sourceSentence.sentenceText}
              mode={mode}
              onMouseDown={(
                word: string,
                sentenceNumber: number,
                sentenceText: string
              ) =>
                handleMouseEvent("down", word, sentenceNumber, sentenceText, 0)
              }
              onMouseEnter={(
                word: string,
                sentenceNumber: number,
                sentenceText: string
              ) =>
                handleMouseEvent("enter", word, sentenceNumber, sentenceText, 0)
              }
              onMouseUp={handleMouseUp}
              isHighlighted={isWordInHighlightedPhrase(
                userSentences,
                selectedWords,
                sourceSentence.sentenceText,
                0,
                0
              )}
              isHighlightedFromVideo={index === highlightedSentenceIndex}
              isSelecting={mouseDown}
              sentenceTranslation={targetSentence?.sentenceText || ""}
              vocabularyListUserPhrases={vocabularyListUserPhrases!}
              currentPage={currentPage}
              sentencesPerPage={sentencesPerPage}
              selectedLanguageTo={selectedLanguageTo}
              onTouchStart={(
                word: string,
                sentenceNumber: number,
                sentenceText: string,
                event: React.TouchEvent
              ) =>
                handleTouchEvent(
                  "start",
                  word,
                  sentenceNumber,
                  sentenceText,
                  0,
                  event
                )
              }
              onTouchMove={(
                word: string,
                sentenceNumber: number,
                sentenceText: string,
                event: React.TouchEvent
              ) =>
                handleTouchEvent(
                  "move",
                  word,
                  sentenceNumber,
                  sentenceText,
                  0,
                  event
                )
              }
              onTouchEnd={(
                word: string,
                sentenceNumber: number,
                sentenceText: string,
                event: React.TouchEvent
              ) =>
                handleTouchEvent(
                  "end",
                  word,
                  sentenceNumber,
                  sentenceText,
                  0,
                  event
                )
              }
            />
          );
        } else if (mode === "words" || mode === "all") {
          return (
            <Tippy
              content={targetSentence?.sentenceText}
              visible={isTippyVisible && index === highlightedSentenceIndex}
              arrow={false}
              className={`${styles.tippy}`}
              placement={index === 0 || index === 1 ? "bottom" : "top"}
            >
              <div key={index} style={{ whiteSpace: "pre-wrap" }}>
                {sourceSentence.sentenceWords?.map((sourceWord, wordIndex) => {
                  const translation =
                    targetSentence?.sentenceWords[wordIndex]?.wordText || "";
                  console.log(
                    "targetSentence?.sentenceWords" +
                      targetSentence?.sentenceWords
                  );
                  console.log("wordIndex" + wordIndex);

                  console.log("translation" + translation);
                  const isCurrentlyHighlighted =
                    wordIndex === highlightedWordIndex &&
                    index === highlightedSentenceIndex;
                  const preserveHighlight =
                    wordIndex === lastHighlighted.wordIndex &&
                    index === lastHighlighted.sentenceIndex;

                  return (
                    <TranslateWord
                      key={`${index}-${wordIndex}`}
                      id={`word-${index}-${wordIndex}`}
                      data-highlight={
                        wordIndex === 0 || wordIndex === 2 ? "true" : "false"
                      }
                      partOfSpeech={memoizedPartOfSpeech}
                      selectedPartOfSpeech={partOfSpeech}
                      word={sourceWord.punctuatedWordText}
                      translation={translation}
                      sentenceNumber={sourceSentence.sentenceNo}
                      sentenceText={sourceSentence.sentenceText}
                      mode={mode}
                      sentenceWord={sourceWord}
                      onMouseDown={(
                        word: string,
                        sentenceNumber: number,
                        sentenceText: string
                      ) =>
                        handleMouseEvent(
                          "down",
                          word,
                          sentenceNumber,
                          sentenceText,
                          sourceWord.position
                        )
                      }
                      onMouseEnter={(
                        word: string,
                        sentenceNumber: number,
                        sentenceText: string
                      ) =>
                        handleMouseEvent(
                          "enter",
                          word,
                          sentenceNumber,
                          sentenceText,
                          sourceWord.position
                        )
                      }
                      onMouseUp={handleMouseUp}
                      isHighlighted={isWordInHighlightedPhrase(
                        userSentences,
                        selectedWords,
                        sourceWord.wordText,
                        sourceWord.position,
                        sourceSentence.sentenceNo
                      )}
                      isWordHighlightedFromVideo={
                        isCurrentlyHighlighted ||
                        (highlightedWordIndex === -1 && preserveHighlight)
                      }
                      isHighlightedFromVideo={
                        index === highlightedSentenceIndex
                      }
                      wordIndex={wordIndex}
                      isSelecting={
                        mouseDown || (isMobile && touchActive.current)
                      }
                      //isSelecting={mouseDown}
                      sentenceTranslation={targetSentence?.sentenceText || ""}
                      vocabularyListUserPhrases={vocabularyListUserPhrases!}
                      currentPage={currentPage}
                      sentencesPerPage={sentencesPerPage}
                      selectedLanguageTo={selectedLanguageTo}
                      onTouchStart={(
                        word: string,
                        sentenceNumber: number,
                        sentenceText: string,
                        event: React.TouchEvent
                      ) =>
                        handleTouchEvent(
                          "start",
                          word,
                          sentenceNumber,
                          sentenceText,
                          sourceWord.position,
                          event
                        )
                      }
                      onTouchMove={(
                        word: string,
                        sentenceNumber: number,
                        sentenceText: string,
                        event: React.TouchEvent
                      ) =>
                        handleTouchEvent(
                          "move",
                          word,
                          sentenceNumber,
                          sentenceText,
                          sourceWord.position,
                          event
                        )
                      }
                      onTouchEnd={(
                        word: string,
                        sentenceNumber: number,
                        translation: string,
                        event: React.TouchEvent
                      ) =>
                        handleTouchEvent(
                          "end",
                          word,
                          sentenceNumber,
                          translation,
                          sourceWord.position,
                          event
                        )
                      }
                    />
                  );
                })}
                {isTenseVisible && (
                  <>
                    <Select
                      options={options(sourceSentence.tense)}
                      value={
                        selectedTenses.some((tense) => {
                          return (
                            tense.sentenceNumber === sourceSentence.sentenceNo
                          );
                        })
                          ? tenseOptions.find((option) => {
                              const foundTense = selectedTenses.find(
                                (tense) =>
                                  tense.sentenceNumber ===
                                  sourceSentence.sentenceNo
                              );
                              return option.value === foundTense?.tense;
                            })
                          : ""
                      }
                      onChange={(option) =>
                        handleTenseChange(option, sourceSentence.sentenceNo)
                      }
                      styles={customStyles(sourceSentence.sentenceNo)}
                      placeholder="Select a tense"
                      menuShouldScrollIntoView={false}
                    />
                    <div className={styles.customDivider} />
                  </>
                )}
                <Button
                  onClick={toggleTippyVisibility}
                  className={`${styles.showHide}`}
                  size={"large"}
                  style={{
                    borderRadius: "15px",
                    backgroundColor: isTippyVisible && "#2C4E80",
                    color: isTippyVisible && "white",
                    height: "45px",
                  }}
                >
                  Show titles
                </Button>
              </div>
            </Tippy>
          );
        }
      })}
      {/* {mode === "quiz" && (
        <QuizComponent sourceLanguage={sourceLanguage} libraryId={libraryId} />
      )} */}
    </>
  );
};

export default TranslateBox;
