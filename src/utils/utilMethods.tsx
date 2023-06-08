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
  highlightPositionsPerSentenceForWords: Record<number, number[]>,
  sortedSelectedWords: { word: string; wordIndexInSentence: number }[],
  sentenceNo: number
) => {
  const phrase = sortedSelectedWords
    .map(({ word, wordIndexInSentence }) =>
      !highlightPositionsPerSentenceForWords[sentenceNo]?.includes(
        wordIndexInSentence
      )
        ? word
        : null
    )
    .filter((word) => word !== null)
    .join(" ");

  return phrase;
};

export function isWordInVocabularyList(
  selectedWords: SelectedWord[],
  vocabularyListUserPhrases: VocabularyListUserPhrase[] | null | undefined
): boolean {
  if (selectedWords.length === 0) return false;

  const firstSelectedWord = selectedWords[0].word;

  if (vocabularyListUserPhrases)
    for (let i = 0; i < vocabularyListUserPhrases.length; i++) {
      const userPhrase = vocabularyListUserPhrases[i].phrase;
      if (userPhrase.sourceText.includes(firstSelectedWord)) {
        return true;
      }
    }

  return false;
}
