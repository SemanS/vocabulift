import { LabelType, SentenceData } from "./sentences.interfaces";

export interface Snapshot {
  sentencesData: SentenceData[];
  libraryId: string;
  sentenceFrom: number;
  countOfSentences: number;
  start: number;
  end: number;
  sourceLanguage: string;
  targetLanguages: string[];
  videoId: string;
  title: string;
  label: LabelType;
  totalSentences: number;
}
