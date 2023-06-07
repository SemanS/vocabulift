import { useEffect, useRef, useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import { useParams } from "react-router-dom";
import {
  getHighlightPositions,
  isWordInHighlightedPhrase,
} from "@/utils/getHighlightPosition";
import { UserSentence } from "@/models/userSentence.interface";
import { getHighlightedWords } from "@/utils/getHighlightedWords";
import { addUserPhrase } from "@/services/userService";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import React from "react";
import { SentenceData } from "@/models/sentences.interfaces";
import { Snapshot } from "@/models/snapshot.interfaces";

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
}) => {
  const { libraryId } = useParams();
  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<any[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [sentenceText, setSentenceText] = useState<string | null>(null);
  const [sentenceTextTranslated, setSentenceTextTranslated] = useState<
    string | null
  >(null);
  const [startPosition, setStartPosition] = useState<number | null>(null);
  const [endPosition, setEndPosition] = useState<number | null>(null);
  const [selectedWordTranslation, setSelectedWordTranslation] = useState<
    string | null
  >(null);
  const [selectedSentenceText, setSelectedSentenceText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const prevLanguageRef = useRef(selectedLanguage);
  const sentenceTextRef = useRef(sentenceText);
  const [trigger, setTrigger] = useState(false);

  const removeSpecialChars = (input: string) => {
    const regex = /[.,?!“”„:]+/g;
    return input.replace(regex, "");
  };

  function isSingleWord(text: string) {
    // Check if the text contains any whitespace characters
    return !/\s/.test(text);
  }

  useEffect(() => {
    setSelectedLanguage(selectedLanguageTo);
  }, [selectedLanguageTo]);

  useEffect(() => {
    prevLanguageRef.current = selectedLanguage;
  }, [selectedLanguageTo]);

  useEffect(() => {
    let lastWord = selectedSentenceText.trim().split(" ").pop() as string;
    let lastIndex = selectedSentenceText.lastIndexOf(lastWord);
    if (sentenceText) {
      addUserPhrase(
        mode === "sentences"
          ? selectedSentenceText
          : isSingleWord(sentenceText)
          ? removeSpecialChars(sentenceText)
          : sentenceText,
        selectedWordTranslation,
        libraryId,
        selectedSentence,
        selectedSentenceText,
        sentenceTextTranslated,
        mode === "sentences" ? 0 : startPosition,
        mode === "sentences" ? lastIndex : endPosition,
        sourceLanguage,
        selectedLanguage,
        sentencesPerPage,
        currentPage,
        libraryTitle,
        sessionStorage.getItem("access_token")
      ).then((response) => {
        if (response.status === "success") {
          const vocabularyListUserPhrase: VocabularyListUserPhrase = {
            phrase: response.data,
            sentenceNo: response.data.sentenceNo,
          };
          onAddUserPhrase(vocabularyListUserPhrase);
          setSelectedWordTranslation(null);
        }
      });
    }
    setTrigger(false);
  }, [sentenceText]);

  useEffect(() => {
    setSelectedWords([]);
  }, [vocabularyListUserPhrases]);

  const handleMouseEvent = (
    eventType: "down" | "enter",
    word: string,
    sentenceNumber: number,
    sentenceText: string,
    wordIndexInSentence: number
  ) => {
    if (eventType === "down") {
      setMouseDown(true);
      setSelectedSentence(sentenceNumber);
      setSelectedWords([{ word, wordIndexInSentence, sentenceNumber }]);
      setSelectedSentenceText(sentenceText);
    } else if (
      eventType === "enter" &&
      mouseDown &&
      selectedSentence === sentenceNumber
    ) {
      setSelectedWords((prevWords: any) => {
        if (!prevWords || prevWords.length == 0) {
          return [];
        }
        const initialSelected = prevWords[0];
        const sentenceObj: SentenceData | undefined = visibleSourceTexts.find(
          (s) => s.sentenceNo == sentenceNumber
        );
        const sentenceFromText = sentenceObj!.sentenceText;
        const sentenceLines = sentenceFromText.split("\n");
        const wordsArray = sentenceLines.flatMap((line: any) =>
          line
            .split(" ")
            .map((word: string) => word.trim())
            .filter((word: string) => word !== "")
        );

        const highlightedWords = getHighlightedWords(
          userSentences,
          sentenceNumber,
          selectedLanguage
        );

        const newSelectedWords = [];
        const tempSelectedWords = [];

        const checkCollision = (index: number) => {
          return highlightedWords.includes(index);
        };

        let hasCollision = false;

        if (wordIndexInSentence >= initialSelected.wordIndexInSentence) {
          for (
            let i = initialSelected.wordIndexInSentence;
            i <= wordIndexInSentence;
            i++
          ) {
            if (checkCollision(i)) {
              hasCollision = true;
              break;
            }
            tempSelectedWords.push({
              word: wordsArray[i],
              wordIndexInSentence: i,
              sentenceNumber: sentenceNumber,
            });
          }
        } else {
          for (
            let i = wordIndexInSentence;
            i <= initialSelected.wordIndexInSentence;
            i++
          ) {
            if (checkCollision(i)) {
              hasCollision = true;
              break;
            }
            tempSelectedWords.unshift({
              word: wordsArray[i],
              wordIndexInSentence: i,
              sentenceNumber: sentenceNumber,
            });
          }
        }

        if (!hasCollision) {
          newSelectedWords.push(...tempSelectedWords);
        } else {
          newSelectedWords.push(...prevWords);
        }
        return newSelectedWords;
      });
    }
    /* if (selectedLanguage !== prevLanguageRef.current) {
      setTrigger((prevTrigger) => !prevTrigger);
    } */
  };

  useEffect(() => {
    const handleDocumentMouseUp = () => {
      if (selectedWords.length > 1) {
        onChangeMode("phrases");
      }
      if (selectedWords.length === 1) {
        onChangeMode("words");
      }
      if (selectedWords.length > 0) {
        const { sentenceNumber, wordIndexInSentence } =
          selectedWords[selectedWords.length - 1];

        const targetSentence = visibleTargetTexts.find(
          (target) => target.sentenceNo === sentenceNumber
        );

        const translation = selectedWords
          .map(
            ({ wordIndexInSentence }) =>
              targetSentence?.sentenceWords[wordIndexInSentence]?.wordText || ""
          )
          .join(" ");

        handleMouseUp(
          targetSentence?.sentenceText!,
          sentenceNumber,
          translation
        );
      }
    };

    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [selectedWords]);

  const handleMouseUp = (
    sentenceTranslation: string,
    sentenceNumber: number,
    translation?: string
  ) => {
    setMouseDown(false);
    const sortedSelectedWords = selectedWords.sort(
      (a, b) => a.wordIndexInSentence - b.wordIndexInSentence
    );
    if (sortedSelectedWords.length === 1) {
      setSelectedWordTranslation(translation!);
    }
    const highlightedWords = getHighlightedWords(
      userSentences,
      sentenceNumber,
      selectedLanguage
    );
    const phrase = sortedSelectedWords
      .map(({ word, wordIndexInSentence }) =>
        !highlightedWords.includes(wordIndexInSentence) ? word : null
      )
      .filter((word) => word !== null)
      .join(" ");
    setSentenceText(phrase);
    setSentenceTextTranslated(sentenceTranslation);
    if (sortedSelectedWords.length > 0) {
      setStartPosition(sortedSelectedWords[0].wordIndexInSentence);
      setEndPosition(
        sortedSelectedWords[sortedSelectedWords.length - 1].wordIndexInSentence
      );
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

  function getSentenceDataByLanguage(
    snapshots: Snapshot[],
    language: string
  ): SentenceData[] {
    let sentences: SentenceData[] = [];

    for (let snapshot of snapshots) {
      if (snapshot.language === language) {
        sentences = sentences.concat(snapshot.sentencesData);
      }
    }

    return sentences;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <>
      {visibleSourceTexts.map((sourceSentence, index) => {
        const targetSentence = visibleTargetTexts.find(
          (target) => target.sentenceNo === sourceSentence.sentenceNo
        );
        console.log("mode" + JSON.stringify(mode, null, 2));
        if (mode === "sentences") {
          // Just return one TranslateWord for the entire sentence
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
              highlightPositionsForPhrases={getHighlightPositions(
                selectedLanguage,
                userSentences,
                vocabularyListUserPhrases!,
                sourceSentence.sentenceNo,
                0
              )}
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
            />
          );
        } else {
          return (
            <div key={index} style={{ whiteSpace: "pre-wrap" }}>
              {sourceSentence.sentenceWords.map((sourceWord, wordIndex) => {
                const translation =
                  targetSentence?.sentenceWords[wordIndex]?.wordText || "";
                return (
                  <TranslateWord
                    key={`${index}-${wordIndex}`}
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
                    highlightPositions={getHighlightPositions(
                      selectedLanguage,
                      userSentences,
                      vocabularyListUserPhrases!,
                      sourceSentence.sentenceNo,
                      sourceWord.position,
                      mode
                    )}
                    isHighlighted={isWordInHighlightedPhrase(
                      userSentences,
                      selectedWords,
                      sourceWord.wordText,
                      sourceWord.position,
                      sourceSentence.sentenceNo
                    )}
                    isHighlightedFromVideo={index === highlightedSentenceIndex}
                    wordIndex={sourceWord.position}
                    isSelecting={mouseDown}
                    sentenceTranslation={targetSentence?.sentenceText || ""}
                  />
                );
              })}
            </div>
          );
        }
      })}
    </>
  );
};

export default TranslateBox;
