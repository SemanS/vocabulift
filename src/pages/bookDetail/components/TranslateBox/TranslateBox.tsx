import { useEffect, useRef, useState } from "react";
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
import { SentenceData } from "@/models/sentences.interfaces";
import { Snapshot } from "@/models/snapshot.interfaces";
import { SelectedWord } from "@/models/utils.interface";
import {
  getPhraseIfNotInHighlighted,
  isSingleWord,
  isWordInVocabularyList,
} from "@/utils/utilMethods";
import { notification } from "antd";
import MagnifyingGlass from "../MagnifyingGlass/MagnifyingGlass";
import Quiz from "react-quiz-component";
import QuizComponent from "../Quiz/QuizComponent";
import { targetLanguageState } from "@stores/language";
import { useMount, useSetState } from "react-use";
import Joyride, { CallBackProps, EVENTS, STATUS } from "react-joyride";

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
  onAddUserPhrase: (vocabularyListUserPhrase: VocabularyListUserPhrase) => void;
  selectedLanguageTo: string;
  onChangeMode: (mode: string) => void;
  magnifyingGlassRef: any;
}

interface State {
  run: boolean;
  steps: Step[];
  stepIndex: number;
  mainKey: number;
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
  onAddUserPhrase,
  selectedLanguageTo,
  onChangeMode,
  magnifyingGlassRef,
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

  const [{ run, stepIndex, steps, mainKey }, setState] = useSetState<State>({
    run: false,
    stepIndex: 0,
    steps: [],
    mainKey: 0,
  });

  useMount(() => {
    setState({
      run: true,
      steps: [
        {
          content: (
            <div>
              You can interact with your own components through the spotlight.
              <br />
              Click the menu above!
            </div>
          ),
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: true,
          placement: "bottom",
          spotlightClicks: true,
          target: ["#word-0-0", "#word-0-1"],
          /* styles: {
            options: {
              zIndex: 10000,
            },
          }, */
          //target: settingsTriggerRef.current,
          title: "Menu",
        },
      ],
    });
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    console.log({ run, steps, mainKey, type });

    if (type === EVENTS.TOUR_START) {
    }
  };

  const getCombinedRect = (elements) => {
    const rects = elements.map((element) => element.getBoundingClientRect());
    const combinedRect = rects.reduce(
      (acc, rect) => ({
        top: Math.min(acc.top, rect.top),
        right: Math.max(acc.right, rect.right) + 10,
        bottom: Math.max(acc.bottom, rect.bottom),
        left: Math.min(acc.left, rect.left),
      }),
      {
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity,
        left: Infinity,
      }
    );

    return {
      top: combinedRect.top + window.scrollY,
      left: combinedRect.left + window.scrollX,
      width: combinedRect.right - combinedRect.left,
      height: combinedRect.bottom - combinedRect.top,
    };
  };

  const createOverlay = (rect) => {
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.pointerEvents = "none"; // Allow clicks to pass through
    //overlay.style.border = "2px solid red"; // Example styling
    overlay.setAttribute("id", "joyride-overlay");

    document.body.appendChild(overlay);
  };

  const wrapMultiElements = (steps) => {
    steps.forEach((step, index) => {
      if (Array.isArray(step.target)) {
        const targets = step.target
          .map((selector) => document.querySelector(selector))
          .filter((el) => !!el);

        if (targets.length > 0) {
          const combinedRect = getCombinedRect(targets);
          createOverlay(combinedRect);

          // Update the step to target the overlay
          steps[index].target = "#joyride-overlay";
        }
      }
    });
  };

  useEffect(() => {
    setState((prevState) => {
      const newSteps = [...prevState.steps];
      wrapMultiElements(newSteps);
      return { ...prevState, steps: newSteps };
    });
  }, [mainKey]);

  return (
    <>
      <Joyride
        key={mainKey}
        continuous
        run={run}
        disableScrolling
        hideCloseButton
        showProgress
        showSkipButton
        steps={steps}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
      />
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
            <div key={index} style={{ whiteSpace: "pre-wrap" }}>
              {sourceSentence.sentenceWords.map((sourceWord, wordIndex) => {
                const translation =
                  targetSentence?.sentenceWords[wordIndex]?.wordText || "";
                return (
                  <TranslateWord
                    key={`${index}-${wordIndex}`}
                    id={`word-${index}-${wordIndex}`}
                    data-highlight={
                      wordIndex === 0 || wordIndex === 2 ? "true" : "false"
                    }
                    word={sourceWord.wordText}
                    translation={translation}
                    sentenceNumber={sourceSentence.sentenceNo}
                    sentenceText={sourceSentence.sentenceText}
                    mode={mode}
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
                    isHighlightedFromVideo={index === highlightedSentenceIndex}
                    wordIndex={wordIndex}
                    isSelecting={mouseDown || (isMobile && touchActive.current)}
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
            </div>
          );
        }
      })}
      {mode === "quiz" && (
        <QuizComponent sourceLanguage={sourceLanguage} libraryId={libraryId} />
      )}
    </>
  );
};

export default TranslateBox;
