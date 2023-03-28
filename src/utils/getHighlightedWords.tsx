import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightedWords = (
  userSentences: UserSentence[],
  sentence_no: number
): number[] => {
  const sentence = userSentences.find(
    (userSentence) => userSentence.sentence_no === sentence_no
  );

  if (!sentence) return [];

  const highlightedWordPositions: number[] = [];

  /* sentence.words.forEach((userWord) => {
    highlightedWordPositions.push(userWord.position);
  }); */

  sentence.phrases.forEach((userPhrase) => {
    for (let i = userPhrase.positionStart; i <= userPhrase.positionEnd; i++) {
      highlightedWordPositions.push(i);
    }
  });
  return highlightedWordPositions;
};
