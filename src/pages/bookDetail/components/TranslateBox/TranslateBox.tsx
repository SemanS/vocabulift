import { useEffect, useState } from "react";
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
  targetLanguage: string;
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
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  mode,
  sourceLanguage,
  targetLanguage,
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
}) => {
  const { libraryId } = useParams();
  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<any[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [startPosition, setStartPosition] = useState<number | null>(null);
  const [endPosition, setEndPosition] = useState<number | null>(null);
  const [selectedWordTranslation, setSelectedWordTranslation] = useState<
    string | null
  >(null);
  const [selectedSentenceText, setSelectedSentenceText] = useState<string>("");
  const [selectedUserPhrase, setSelectedUserPhrase] =
    useState<VocabularyListUserPhrase | null>(null);

  const removeSpecialChars = (input: string) => {
    const regex = /[.,?!“”„:]+/g;
    return input.replace(regex, "");
  };

  function isSingleWord(text: string) {
    // Check if the text contains any whitespace characters
    return !/\s/.test(text);
  }

  useEffect(() => {
    let lastWord = selectedSentenceText.trim().split(" ").pop() as string;
    let lastIndex = selectedSentenceText.lastIndexOf(lastWord);

    if (selectedPhrase) {
      addUserPhrase(
        mode === "sentence"
          ? selectedSentenceText
          : isSingleWord(selectedPhrase)
          ? removeSpecialChars(selectedPhrase)
          : selectedPhrase,
        selectedWordTranslation,
        libraryId,
        selectedSentence,
        selectedSentenceText,
        mode === "sentence" ? 0 : startPosition,
        mode === "sentence" ? lastIndex : endPosition,
        sourceLanguage,
        targetLanguage,
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
          console.log(
            "vocabularyListUserPhrase" +
              JSON.stringify(vocabularyListUserPhrase, null, 2)
          );
          onAddUserPhrase(vocabularyListUserPhrase);
          setSelectedWordTranslation(null);
        }
      });
    }
  }, [selectedPhrase]);

  useEffect(() => {
    // This effect will run whenever vocabularyListUserPhrases changes
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
          sentenceNumber
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
  };

  useEffect(() => {
    const handleDocumentMouseUp = () => {
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

        handleMouseUp(sentenceNumber, translation);
      }
    };

    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [selectedWords]);

  const handleMouseUp = (sentenceNumber: number, translation?: string) => {
    setMouseDown(false);
    const sortedSelectedWords = selectedWords.sort(
      (a, b) => a.wordIndexInSentence - b.wordIndexInSentence
    );
    if (sortedSelectedWords.length === 1) {
      setSelectedWordTranslation(translation!);
    }
    const highlightedWords = getHighlightedWords(userSentences, sentenceNumber);
    const phrase = sortedSelectedWords
      .map(({ word, wordIndexInSentence }) =>
        !highlightedWords.includes(wordIndexInSentence) ? word : null
      )
      .filter((word) => word !== null)
      .join(" ");
    setSelectedPhrase(phrase);
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
    getSentenceDataByLanguage(snapshots, targetLanguage)
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
        if (mode === "sentence") {
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
              highlightPositions={getHighlightPositions(
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
                      userSentences,
                      vocabularyListUserPhrases!,
                      sourceSentence.sentenceNo,
                      sourceWord.position
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
