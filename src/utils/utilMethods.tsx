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
  sentenceNo: number,
  mode: string
) => {
  const phrase = sortedSelectedWords
    .map(({ word, wordIndexInSentence }) => {
      if (mode === "words" || mode === "all") {
        // In words mode, don't take into account highlighted phrases
        return !vocabularyListUserPhrases.some(
          ({ phrase }) =>
            phrase.sentenceNo === sentenceNo &&
            phrase.startPosition <= wordIndexInSentence &&
            phrase.endPosition >= wordIndexInSentence &&
            phrase.startPosition === phrase.endPosition // ignore multi-word phrases
        )
          ? word
          : null;
      } else if (mode === "phrases") {
        // In phrases mode, don't take into account highlighted words
        return !vocabularyListUserPhrases.some(
          ({ phrase }) =>
            phrase.sentenceNo === sentenceNo &&
            phrase.startPosition <= wordIndexInSentence &&
            phrase.endPosition >= wordIndexInSentence &&
            phrase.startPosition !== phrase.endPosition // ignore single-word phrases
        )
          ? word
          : null;
      }
    })
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

export function isSingleWord(text: string) {
  // Check if the text contains any whitespace characters
  return !/\s/.test(text);
}
