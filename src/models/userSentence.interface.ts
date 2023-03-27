export interface UserSentence {
  libraryId: string;
  sentence_no: number;
  sourceLanguage: string;
  targetLanguage: string;
  words: UserWord[];
  phrases: UserWord[];
}

export interface UserWord {
  sourceText: string;
  targetText: string;
  position: number;
}
