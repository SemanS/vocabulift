import { Snapshot } from "@models/snapshot.interfaces";
import { vocabuFetch } from "@/utils/vocabuFetch";

export const getSnapshots = async (
  libraryId: string,
  sourceLanguage: string,
  targetLanguages: string[],
  time?: number,
  sentenceFrom?: number
): Promise<Snapshot[]> => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/snapshots`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        libraryId: libraryId,
        sourceLanguage: sourceLanguage,
        targetLanguages: targetLanguages,
        time: time,
        sentenceFrom: sentenceFrom,
      }),
    }
  );
  const data = await response.json();
  return data.snapshots;
};

export const getPageNumber = async (
  libraryId: string,
  time?: number
): Promise<Snapshot[]> => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/pageNumber`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        time: time,
        libraryId: libraryId,
      }),
    }
  );
  const data = await response.json();
  return data.snapshots;
};
