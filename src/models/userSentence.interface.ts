export interface UserSentence {
  libraryId: string;
  sentence_no: number;
  words: UserWord[];
  phrases: UserWord[];
}

export interface UserWord {
  sourceText: string;
  targetText: string;
}
