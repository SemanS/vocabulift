export interface UserSentence {
  _id: string;
  userId: string;
  libraryId: string;
  sentenceNo: number;
  countOfPhrases: number;
  sentenceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  phrases: UserPhrase[];
  title: string;
  sentencesPerPage: number;
  currentPage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPhrase {
  _id: string;
  userId: string;
  libraryId: string;
  sentenceId: string;
  sentenceNo: number;
  sourceLanguage: string;
  targetLanguage: string;
  sentenceText: string;
  sourceText: string;
  targetText: string;
  startPosition: number;
  endPosition: number;
  createdAt: Date;
  updatedAt: Date;
}
