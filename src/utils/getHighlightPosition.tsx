import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightPositions = (
  userSentences: UserSentence[],
  sentenceNo: number,
  selectedLanguageTo: string,
  mode: string
): number[] => {
  const sentence = userSentences.find(
    (userSentence) =>
      userSentence.sentenceNo === sentenceNo &&
      userSentence.targetLanguage === selectedLanguageTo
  );

  if (!sentence) return [];

  const highlightedWordPositions: number[] = [];

  sentence.phrases.forEach((userPhrase) => {
    const isSingleWord = userPhrase.startPosition === userPhrase.endPosition;
    const isPhrase = userPhrase.startPosition !== userPhrase.endPosition;

    if (
      mode === "words" ||
      (mode === "all" && isSingleWord) ||
      (mode === "phrases" && isPhrase)
    ) {
      for (let i = userPhrase.startPosition; i <= userPhrase.endPosition; i++) {
        if (userPhrase.targetLanguage === selectedLanguageTo) {
          highlightedWordPositions.push(i);
        }
      }
    }
  });

  return highlightedWordPositions;
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
      selectedWord.word === word &&
      selectedWord.wordIndexInSentence === wordIndexInSentence &&
      selectedWord.sentenceNumber === sentenceNumber
  );
};
