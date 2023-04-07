import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightedWords = (
  userSentences: UserSentence[],
  sentenceNo: number
): number[] => {
  const sentence = userSentences.find(
    (userSentence) => userSentence.sentenceNo === sentenceNo
  );

  if (!sentence) return [];

  const highlightedWordPositions: number[] = [];

  /* sentence.words.forEach((userWord) => {
    highlightedWordPositions.push(userWord.position);
  }); */

  sentence.phrases.forEach((userPhrase) => {
    for (let i = userPhrase.startPosition; i <= userPhrase.endPosition; i++) {
      highlightedWordPositions.push(i);
    }
  });
  return highlightedWordPositions;
};
