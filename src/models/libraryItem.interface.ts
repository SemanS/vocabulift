export interface LibraryItem {
  eventId: string | null;
  id: string;
  title: string;
  label: string;
  image: string;
  description: string;
  totalSentences: number;
  videoThumbnail?: string | undefined;
  videoId: string;
  category: string;
  level: string[];
  snapshotsInfo: SnapshotInfo[];
}

export interface SnapshotInfo {
  snapshotId: string;
  language: string;
  start: number;
  end: number;
  sentenceFrom: number;
}
