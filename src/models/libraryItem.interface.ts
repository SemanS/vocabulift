export interface LibraryItem {
  eventId: string | null;
  _id: string;
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
  duration: string;
  worksheet: string;
}

export interface SnapshotInfo {
  snapshotId: string;
  language: string;
  start: number;
  end: number;
  sentenceFrom: number;
}
