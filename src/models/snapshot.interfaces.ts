import { LabelType, SentenceData } from "./sentences.interfaces";

export interface Snapshot {
  _id: string;
  createdAt: string;
  updatedAt: string;
  sentencesData: SentenceData[];
  libraryId: string;
  sentenceFrom: number;
  countOfSentences: number;
  start: number;
  end: number;
  language: string;
  targetLanguage: string;
  videoId: string;
  title: string;
  label: LabelType;
  totalSentences: number;
  processed: boolean;
  quizzes: any[];
}
