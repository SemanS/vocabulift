import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { SelectedWord } from "@/models/utils.interface";

function calculateBookPercentage(
  page: number,
  sentencesPerPage: number,
  totalSentences: number
) {
  const totalPages = Math.ceil(totalSentences / sentencesPerPage);
  const percentage = (Math.min(page, totalPages) / totalPages) * 100;
  return Math.floor(percentage) === 99 && page < totalSentences
    ? 99
    : Math.ceil(percentage);
}

export const getPhraseIfNotInHighlighted = (
  vocabularyListUserPhrases: Array<{
    phrase: {
      sentenceNo: number;
      startPosition: number;
      endPosition: number;
    };
  }>,
  sortedSelectedWords: { word: string; wordIndexInSentence: number }[],
  sentenceNo: number
) => {
  const phrase = sortedSelectedWords
    .map(({ word, wordIndexInSentence }) =>
      !vocabularyListUserPhrases.some(
        ({ phrase }) =>
          phrase.sentenceNo === sentenceNo &&
          phrase.startPosition <= wordIndexInSentence &&
          phrase.endPosition >= wordIndexInSentence
      )
        ? word
        : null
    )
    .filter((word) => word !== null)
    .join(" ");

  return phrase;
};

export function isWordInVocabularyList(
  mode: string,
  selectedWords: SelectedWord[],
  vocabularyListUserPhrases: VocabularyListUserPhrase[] | null | undefined
): boolean {
  if (selectedWords.length === 0) return false;

  const firstSelectedWord = selectedWords[0].word;

  console.log(
    "vocabularyListUserPhrases" +
      JSON.stringify(vocabularyListUserPhrases, null, 2)
  );
  if (vocabularyListUserPhrases)
    for (let i = 0; i < vocabularyListUserPhrases.length; i++) {
      const userPhrase = vocabularyListUserPhrases[i].phrase;

      if (
        mode === "words" &&
        userPhrase.startPosition === userPhrase.endPosition &&
        userPhrase.sourceText.includes(firstSelectedWord)
      ) {
        return true;
      }

      if (
        mode === "phrases" &&
        userPhrase.startPosition !== userPhrase.endPosition &&
        userPhrase.sourceText.includes(firstSelectedWord)
      ) {
        return true;
      }
    }

  return false;
}
