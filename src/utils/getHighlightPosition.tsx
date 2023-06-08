import { UserSentence } from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";

export const getHighlightPositions = (
  selectedLanguageTo: string,
  userSentences: UserSentence[],
  vocabularyListUserPhrases: VocabularyListUserPhrase[],
  sentenceNo: number,
  mode: string
): number[] => {
  const highlightPositions: number[] = [];

  vocabularyListUserPhrases.forEach((phraseObj) => {
    if (phraseObj.sentenceNo !== sentenceNo) {
      return;
    }
    const startPosition = phraseObj.phrase.startPosition;
    const endPosition = phraseObj.phrase.endPosition;

    if (
      (mode === "phrases" &&
        phraseObj.phrase.targetLanguage === selectedLanguageTo &&
        startPosition !== endPosition) ||
      mode === "words"
    ) {
      for (let position = startPosition; position <= endPosition; position++) {
        highlightPositions.push(position);
      }
    }
  });
  return highlightPositions;
};

export const isWordInHighlightedPhrase = (
  userSentences: UserSentence[],
  selectedWords: Array<{
    word: string;
    wordIndexInSentence: number;
    sentenceNumber: number;
  }>,
  word: string,
  wordIndexInSentence: number,
  sentenceNumber: number
): boolean => {
  return selectedWords.some(
    (selectedWord) =>
      selectedWord.word == word &&
      selectedWord.wordIndexInSentence == wordIndexInSentence &&
      selectedWord.sentenceNumber == sentenceNumber
  );
};
