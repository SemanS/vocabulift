export interface UserSentence {
  libraryId: string;
  sentenceNo: number;
  sentenceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  phrases: UserPhrase[];
  title: string;
  sentencesPerPage: number;
  currentPage: number;
  createdAt: Date;
}

export interface UserWord {
  sourceText: string;
  targetText: string;
  position: number;
}

export interface UserPhrase {
  sentenceNo: number;
  sourceText: string;
  targetText: string;
  startPosition: number;
  endPosition: number;
  createdAt: Date;
}
