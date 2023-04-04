export interface SentenceResponse {
  sentences: SentenceData[];
  totalSentences: number;
}
export interface SentenceData {
  sentenceNo: number;
  language: string;
  sentenceText: string;
  sentenceWords: SentenceWordData[];
}

export interface SentenceWordData {
  position: number;
  wordText: string;
}
