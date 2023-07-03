import React from "react";
import VocabularyList from "./VocabularyList";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { UserPhrase } from "@/models/userSentence.interface";

interface FilteredVocabularyListProps {
  mode: string;
  phrases: VocabularyListUserPhrase[];
  title: string;
  style?: React.CSSProperties;
  onDeleteItem: (
    phraseId: string,
    sentenceId: string,
    startPosition: number,
    sentenceNo: number
  ) => void;
  onWordClick: (word: string) => void;
  selectedUserPhrase?: VocabularyListUserPhrase | null;
  setSelectedUserPhrase?: (
    vocabularyListUserPhrase: VocabularyListUserPhrase
  ) => void;
  selectedLanguageTo: string;
}

const FilteredVocabularyList: React.FC<FilteredVocabularyListProps> = ({
  mode,
  phrases,
  title,
  style,
  onDeleteItem,
  onWordClick,
  selectedUserPhrase,
  setSelectedUserPhrase,
  selectedLanguageTo,
}) => {
  let filteredPhrases = [];
  if (mode === "phrases") {
    filteredPhrases = phrases.filter(
      (phrase) => phrase.phrase.endPosition - phrase.phrase.startPosition > 0
    );
  } else {
    filteredPhrases = phrases.filter(
      (phrase) => phrase.phrase.endPosition - phrase.phrase.startPosition === 0
    );
  }

  return phrases.length > 0 ? (
    <VocabularyList
      mode={mode}
      title={title}
      style={style}
      phrases={phrases}
      onDeleteItem={onDeleteItem}
      onWordClick={onWordClick}
      selectedUserPhrase={selectedUserPhrase}
      setSelectedUserPhrase={setSelectedUserPhrase!}
      selectedLanguageTo={selectedLanguageTo}
    />
  ) : null;
};

export default FilteredVocabularyList;
