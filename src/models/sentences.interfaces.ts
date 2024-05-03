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
  start?: number;
  duration?: number;
  tense?: string;
}

export interface SentenceWordData {
  sentenceNumber: number;
  position: number;
  language: string;
  start: number;
  end: number;
  duration: number;
  wordText: string;
  wordTranslation: string;
  punctuatedWordText: string;
  confidence: number;
  partOfSpeech: string;
}
