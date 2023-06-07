import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightedWords = (
  userSentences: UserSentence[],
  sentenceNo: number,
  selectedLanguageTo: string
): number[] => {
  const sentence = userSentences.find(
    (userSentence) =>
      userSentence.sentenceNo === sentenceNo &&
      userSentence.targetLanguage === selectedLanguageTo
  );
  console.log("sentence" + JSON.stringify(sentence, null, 2));
  console.log(
    "selectedLanguageTo" + JSON.stringify(selectedLanguageTo, null, 2)
  );
  if (!sentence) return [];

  const highlightedWordPositions: number[] = [];

  sentence.phrases.forEach((userPhrase) => {
    for (let i = userPhrase.startPosition; i <= userPhrase.endPosition; i++) {
      if (userPhrase.targetLanguage === selectedLanguageTo) {
        highlightedWordPositions.push(i);
      }
    }
  });
  return highlightedWordPositions;
};
