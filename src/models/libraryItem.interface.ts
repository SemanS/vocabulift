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
}
