import { Snapshot } from "@models/snapshot.interfaces";

export const getSnapshots = async (
  sourceLanguage: string,
  targetLanguages: string[],
  time?: number,
  sentenceFrom?: number
): Promise<Snapshot[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/snapshots`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
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
