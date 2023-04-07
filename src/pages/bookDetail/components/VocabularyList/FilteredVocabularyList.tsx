import React from "react";
import VocabularyList from "./VocabularyList";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";

interface FilteredVocabularyListProps {
  mode: string;
  phrases: VocabularyListUserPhrase[];
  title: string;
  style?: React.CSSProperties;
  onDeleteItem: (startPosition: number, sentenceNo: number) => void;
  onWordClick: (word: string) => void;
}

const FilteredVocabularyList: React.FC<FilteredVocabularyListProps> = ({
  mode,
  phrases,
  title,
  style,
  onDeleteItem,
  onWordClick,
}) => {
  // Filter phrases with more than one word
  let filteredPhrases = []; // Define filteredPhrases outside if/else blocks
  if (mode === "phrases") {
    filteredPhrases = phrases.filter(
      (phrase) => phrase.phrase.endPosition - phrase.phrase.startPosition > 0
    );
  } else {
    filteredPhrases = phrases.filter(
      (phrase) => phrase.phrase.endPosition - phrase.phrase.startPosition === 0
    );
  }

  return (
    <VocabularyList
      mode={mode}
      title={title}
      style={style}
      phrases={filteredPhrases}
      onDeleteItem={onDeleteItem}
      onWordClick={onWordClick}
    />
  );
};

export default FilteredVocabularyList;
