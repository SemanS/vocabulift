import { UserSentence } from "@/models/userSentence.interface";

export const getHighlightPositions = (
  userSentences: UserSentence[],
  sentenceNo: number,
  selectedLanguageTo: string
): number[] => {
  const sentence = userSentences.find(
    (userSentence) =>
      userSentence.sentenceNo === sentenceNo &&
      userSentence.targetLanguage === selectedLanguageTo
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
  console.log("selectedWord" + JSON.stringify(selectedWords, null, 2));
  console.log(
    "wordIndexInSentence" + JSON.stringify(wordIndexInSentence, null, 2)
  );
  return selectedWords.some(
    (selectedWord) =>
      selectedWord.word === word &&
      selectedWord.wordIndexInSentence === wordIndexInSentence &&
      selectedWord.sentenceNumber === sentenceNumber
  );
};
