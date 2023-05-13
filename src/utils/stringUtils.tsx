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
/* 
export function findSnapshotWindow(
  snapshot: Snapshot,
  sentencesPerPage: number,
  currentTime: number,
  pageIndex: number
): boolean {
  if (sentencesPerPage < 1 || sentencesPerPage > 100) {
    throw new Error("sentencesPerPage must be between 1 and 100");
  }

  const startIndex = pageIndex * sentencesPerPage;
  const endIndex = Math.min(
    (pageIndex + 1) * sentencesPerPage - 1,
    snapshot.sentencesData.length - 1
  );

  if (startIndex >= snapshot.sentencesData.length) {
    return false;
  }

  const windowStartTime = snapshot.sentencesData[startIndex].start;
  const windowEndTime =
    snapshot.sentencesData[endIndex].start! +
    snapshot.sentencesData[endIndex].duration!;
  if (!windowStartTime || !windowEndTime) {
    throw new Error("Start or end time is not available for some sentences");
  }

  return currentTime >= windowEndTime || currentTime <= windowStartTime;
}

export function findPageIndexByTime(
  snapshot: Snapshot,
  sentencesPerPage: number,
  currentTime: number
): number {
  if (sentencesPerPage < 1 || sentencesPerPage > 100) {
    throw new Error("sentencesPerPage must be between 1 and 100");
  }

  let pageIndex = -1;
  let currentIndex = 0;

  for (const sentenceData of snapshot.sentencesData) {
    if (sentenceData.start && sentenceData.start <= currentTime) {
      currentIndex++;
    } else {
      break;
    }
  }

  const sentenceNo = snapshot.sentencesData[currentIndex].sentenceNo;
  if (currentIndex > 0) {
    pageIndex = Math.floor(sentenceNo / sentencesPerPage) + 1;
  }

  return pageIndex;
} */
