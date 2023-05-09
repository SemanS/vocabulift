export enum LabelType {
  VIDEO = "video",
  BOOK = "book",
}

export interface SentenceResponse {
  sentences: SentenceData[];
  totalSentences: number;
  sentenceFrom: number;
  videoId?: string | undefined;
  label?: LabelType | undefined;
  title?: string | undefined;
}
export interface SentenceData {
  sentenceNo: number;
  language: string;
  sentenceText: string;
  sentenceWords: SentenceWordData[];
  start?: string;
  duration?: string;
}

export interface SentenceWordData {
  position: number;
  wordText: string;
}
