import { Snapshot } from "@models/snapshot.interfaces";

export const getSnapshot = async (
  sourceLanguage: string,
  targetLanguages: string[],
  time?: number,
  sentenceFrom?: number
): Promise<Snapshot> => {
  console.log("time" + time);
  console.log("sentenceFrom" + sentenceFrom);
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/snapshot`,
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
  return data.snapshot;
};
