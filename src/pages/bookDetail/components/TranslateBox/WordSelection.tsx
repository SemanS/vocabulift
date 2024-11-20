import React, { useState, useRef, useEffect } from "react";
import {
  checkCollision,
  buildWordObjects,
  getPhraseIfNotInHighlighted,
  isWordInVocabularyList,
} from "@/utils/utilMethods";
import { notification } from "antd";
import { SelectedWord, SentenceData } from "@/models/utils.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";

interface WordSelectionProps {
  mode: string;
  userSentences: any[];
  selectedLanguageTo: string;
  vocabularyListUserPhrases?: VocabularyListUserPhrase[] | null;
  onChangeMode: (mode: string) => void;
  saveWord: (
    phrase: string,
    startPosition: number,
    endPosition: number,
    sentenceTranslation: string,
    translation: string | null
  ) => Promise<string | undefined>;
  visibleSourceTexts: SentenceData[];
  setSaveWordComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const WordSelection: React.FC<WordSelectionProps> = ({
  mode,
  userSentences,
  selectedLanguageTo,
  vocabularyListUserPhrases,
  onChangeMode,
  saveWord,
  visibleSourceTexts,
  setSaveWordComplete,
}) => {
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedSentenceText, setSelectedSentenceText] = useState<string>("");
  const touchActive = useRef(false);

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

    if (
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
    }

    setMouseDown(false);

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

  return (
    <div>
      {/* Implement the UI for word selection here */}
    </div>
  );
};

export default WordSelection;
