export enum LabelType {
  VIDEO = "video",
  BOOK = "book",
  TEXT = "text",
  ARTICLE = "article",
}

export interface SentenceResponse {
  sentences: SentenceData[];
  totalSentences: number;
  videoId?: string | undefined;
  label?: LabelType | undefined;
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
