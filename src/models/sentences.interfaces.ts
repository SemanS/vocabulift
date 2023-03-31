export interface SentenceResponse {
  sentences: SentenceData[];
  sentenceWords: SentenceWord[];
  totalSentences: number;
}

export interface SentenceData {
  content_en: string;
  content_cz: string;
  content_sk: string;
  sentence_no: number;
}

export interface SentenceWord {
  id: string;
  sentenceId: string;
  sentence_no: number;
  librariId: string;
  sentenceWord: SentenceWordDetail[];
}

interface SentenceWordDetail {
  sourceLanguage: string;
  targetLanguage: string;
  sourceWordText: string;
  targetWordText: string;
}
