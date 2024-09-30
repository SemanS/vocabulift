import { FeatureType } from "@/pages/webLayout/shared/common/types";

export interface LibraryItem {
  eventId: string | null;
  _id: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  label: string;
  image: string;
  description: string;
  totalSentences: number;
  videoThumbnail?: string | undefined;
  videoId: string;
  category: string;
  level: string[];
  snapshotsInfo: SnapshotInfo[];
  duration: string;
  worksheet: string;
  enrichedFeatures: FeatureType[];
}

export interface SnapshotInfo {
  snapshotId: string;
  language: string;
  start: number;
  end: number;
  sentenceFrom: number;
}
