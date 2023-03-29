import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightPositions = (
  userSentences: UserSentence[],
  sentence_no: number,
  wordPosition: number
): boolean => {
  const sortedSentences = userSentences.sort(
    (a, b) => a.sentence_no - b.sentence_no
  );
  const sentence = sortedSentences.find((userSentence) => {
    return userSentence.sentence_no === sentence_no; // Use strict equality operator
  });

  if (!sentence) return false;

  const isWordHighlighted =
    sentence.words &&
    sentence.words.some((userWord) => {
      return userWord.position == wordPosition;
    });
  const isPhraseHighlighted =
    sentence.phrases &&
    sentence.phrases.some(
      (userPhrase) =>
        userPhrase.startPosition <= wordPosition &&
        userPhrase.endPosition >= wordPosition
    );

  return isPhraseHighlighted || isWordHighlighted;
};

// New function isWordInHighlightedPhrase
export const isWordInHighlightedPhrase = (
  userSentences: UserSentence[], // Add this parameter
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
