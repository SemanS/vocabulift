export interface UserSentence {
  libraryId: string;
  sentenceNo: number;
  sentenceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  words: UserWord[];
  phrases: UserPhrase[];
  title: string;
  sentencesPerPage: number;
  currentPage: number;
}

export interface UserWord {
  sourceText: string;
  targetText: string;
  position: number;
}

export interface UserPhrase {
  sourceText: string;
  targetText: string;
  startPosition: number;
  endPosition: number;
}
