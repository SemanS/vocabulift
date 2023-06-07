import { UserSentence } from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";

export const getHighlightPositions = (
  selectedLanguageTo: string,
  userSentences: UserSentence[],
  vocabularyListUserPhrases: VocabularyListUserPhrase[],
  sentenceNo: number,
  wordPosition: number,
  mode: string
): boolean => {
  const sortedSentences = userSentences.sort(
    (a, b) => a.sentenceNo - b.sentenceNo
  );

  const sentence = sortedSentences.find((userSentence: UserSentence) => {
    return userSentence.sentenceNo === sentenceNo;
  });

  let isPhraseHighlighted = false;

  if (sentence) {
    isPhraseHighlighted =
      sentence.phrases &&
      sentence.phrases.some(
        (userPhrase) =>
          userPhrase.startPosition <= wordPosition &&
          userPhrase.endPosition >= wordPosition &&
          userPhrase.targetLanguage === selectedLanguageTo
      );
  }

  const isInVocabularyListUserPhrases = vocabularyListUserPhrases.some(
    (phraseObj) => {
      if (phraseObj.sentenceNo !== sentenceNo) {
        return false;
      }
      const startPosition = phraseObj.phrase.startPosition;
      const endPosition = phraseObj.phrase.endPosition;
      return mode === "phrases"
        ? wordPosition >= startPosition &&
            wordPosition <= endPosition &&
            phraseObj.phrase.targetLanguage === selectedLanguageTo
        : mode === "words"
        ? wordPosition === startPosition && startPosition === endPosition
        : false;
    }
  );

  return isPhraseHighlighted || isInVocabularyListUserPhrases;
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
      selectedWord.word == word &&
      selectedWord.wordIndexInSentence == wordIndexInSentence &&
      selectedWord.sentenceNumber == sentenceNumber
  );
};
