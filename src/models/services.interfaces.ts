export interface SentenceData {
  content_en: string;
  content_cz: string;
  content_sk: string;
  sentence_no: number;
}

export interface FetchDataResponse {
  sentences: SentenceData[];
  totalSentences: number;
}
