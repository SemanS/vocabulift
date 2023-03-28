import { UserSentence } from "@models/userSentence.interface";

export const getHighlightPositions = (
  userSentences: UserSentence[],
  sentence_no: number,
  wordPosition: number
): boolean => {
  const sentence = userSentences.find((userSentence) => {
    return userSentence.sentence_no == sentence_no; // Added return statement
  });

  if (!sentence) return false;

  const isWordHighlighted = sentence.words.some((userWord) => {
    return userWord.position == wordPosition; // Added return statement
  });
  const isPhraseHighlighted = sentence.phrases.some(
    (userPhrase) =>
      userPhrase.positionStart <= wordPosition &&
      userPhrase.positionEnd >= wordPosition
  );

  return isPhraseHighlighted;
};

// New function isWordInHighlightedPhrase
export const isWordInHighlightedPhrase = (
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
