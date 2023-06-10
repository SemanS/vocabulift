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
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedSentenceText, setSelectedSentenceText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const prevLanguageRef = useRef(selectedLanguage);
  const [saveWordComplete, setSaveWordComplete] = useState(false);
  const [sentenceNo, setSentenceNo] = useState<number>();

  const removeSpecialChars = (input: string) => {
    const regex = /[.,?!“”„:]+/g;
    return input.replace(regex, "");
  };

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
        mode === "words" ? translation : null,
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
          (s) => s.sentenceNo === sentenceNumber
        );
        const sentenceFromText = sentenceObj!.sentenceText;
        const sentenceLines = sentenceFromText.split("\n");
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

  const handleMouseUp = async (
    sentenceTranslation: string,
    sentenceNumber: number,
    translation: string | null
  ) => {
    if (selectedWords.length > 1) {
      onChangeMode("phrases");
    }
    if (selectedWords.length === 1 && mode !== "all") {
      onChangeMode("words");
    }
    if (
      isWordInVocabularyList(
        selectedWords.length > 1 ? "phrases" : "words",
        selectedWords,
        vocabularyListUserPhrases
      )
    ) {
      notification.open({
        message: "Word Found",
        description: "The selected word is in the vocabulary list.",
        type: "info",
      });
    }
    setMouseDown(false);
    setSentenceNo(sentenceNumber);
    const sortedSelectedWords = selectedWords.sort(
      (a, b) => a.wordIndexInSentence - b.wordIndexInSentence
    );

    const phrase = getPhraseIfNotInHighlighted(
      vocabularyListUserPhrases!,
      sortedSelectedWords,
      sentenceNumber,
      mode
    );

    const startPosition = sortedSelectedWords[0].wordIndexInSentence;
    const endPosition =
      sortedSelectedWords[sortedSelectedWords.length - 1].wordIndexInSentence;

    const isPhraseInVocabulary = vocabularyListUserPhrases!.some(
      (item) =>
        item.phrase.startPosition === startPosition &&
        item.phrase.endPosition === endPosition &&
        item.phrase.sentenceNo === sentenceNumber
    );
    let savedPhrase;
    if (!isPhraseInVocabulary) {
      savedPhrase = await saveWord(
        phrase,
        startPosition,
        endPosition,
        sentenceTranslation,
        translation
      );
    } else {
      console.log("This phrase already exists in the vocabulary list");
    }

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
                    isHighlighted={isWordInHighlightedPhrase(
                      userSentences,
                      selectedWords,
                      sourceWord.wordText,
                      sourceWord.position,
                      sourceSentence.sentenceNo
                    )}
                    isHighlightedFromVideo={index === highlightedSentenceIndex}
                    wordIndex={wordIndex}
                    isSelecting={mouseDown}
                    sentenceTranslation={targetSentence?.sentenceText || ""}
                    vocabularyListUserPhrases={vocabularyListUserPhrases!}
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
