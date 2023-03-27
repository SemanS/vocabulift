import { UserSentence } from "@models/userSentence.interface";

export const getHighlightPositions = (
  userSentences: UserSentence[],
  sentence_no: number,
  wordPosition: number
): boolean => {
  const sentence = userSentences.find((userSentence) => {
    return userSentence.sentence_no === sentence_no; // Added return statement
  });

  if (!sentence) return false;

  const isWordHighlighted = sentence.words.some((userWord) => {
    return userWord.position == wordPosition; // Added return statement
  });
  const isPhraseHighlighted = sentence.phrases.some(
    (userPhrase) => userPhrase.position === wordPosition
  );

  return isWordHighlighted || isPhraseHighlighted;
};
