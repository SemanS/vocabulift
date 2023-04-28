import { UserSentence } from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";

export const getHighlightPositions = (
  userSentences: UserSentence[],
  vocabularyListUserPhrases: VocabularyListUserPhrase[], // Add this parameter
  sentenceNo: number,
  wordPosition: number
): boolean => {
  const sortedSentences = userSentences.sort(
    (a, b) => a.sentenceNo - b.sentenceNo
  );

  const sentence = sortedSentences.find((userSentence: UserSentence) => {
    return userSentence.sentenceNo === sentenceNo; // Use strict equality operator
  });

  if (!sentence) return false;

  const isPhraseHighlighted =
    sentence.phrases &&
    sentence.phrases.some(
      (userPhrase) =>
        userPhrase.startPosition <= wordPosition &&
        userPhrase.endPosition >= wordPosition
    );

  const isInVocabularyListUserPhrases = vocabularyListUserPhrases.some(
    (phraseObj) => {
      if (phraseObj.sentenceNo !== sentenceNo) {
        return false;
      }
      const startPosition = phraseObj.phrase.startPosition;
      const endPosition = phraseObj.phrase.endPosition;
      return wordPosition >= startPosition && wordPosition <= endPosition;
    }
  );

  return isPhraseHighlighted || isInVocabularyListUserPhrases;
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
