import { LibraryItem } from "./libraryItem.interface";

export interface ApiResponse {
  video: LibraryItem[];
  book: LibraryItem[];
}
