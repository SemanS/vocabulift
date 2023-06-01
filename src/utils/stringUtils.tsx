import { Snapshot } from "@/models/snapshot.interfaces";

export function getRangeNumber(num: number) {
  if (num <= 100) {
    return 1;
  } else {
    const base = Math.floor((num - 1) / 100) * 100 + 1;
    return base;
  }
}

export function calculateFirstIndex(page: number, pageSize: number): number {
  const updatedPage = page % 10 === 0 ? 10 : page % 10;
  const firstIndex = (updatedPage - 1) * pageSize;
  return firstIndex;
}

export function calculatePage(
  newHighlightedIndex: number,
  sentencesPerPage: number,
  sentenceFrom: number
): number {
  let firstIndex =
    Math.floor((newHighlightedIndex + sentenceFrom) / sentencesPerPage) + 1;
  return firstIndex;
}
