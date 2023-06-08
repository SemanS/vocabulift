import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightedWords = (
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

  if (mode === "phrases")
    sentence.phrases.forEach((userPhrase) => {
      for (let i = userPhrase.startPosition; i <= userPhrase.endPosition; i++) {
        if (userPhrase.targetLanguage === selectedLanguageTo) {
          highlightedWordPositions.push(i);
        }
      }
    });
  return highlightedWordPositions;
};
