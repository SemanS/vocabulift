export interface UserSentence {
  libraryId: string;
  sentence_no: number;
  sourceLanguage: string;
  targetLanguage: string;
  words: UserWord[];
  phrases: UserPhrase[];
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
