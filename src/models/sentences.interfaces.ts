export interface SentenceResponse {
  sentences: SentenceData[];
  totalSentences: number;
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
