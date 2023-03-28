import { UserLibraryItem } from "@/models/userLibraryItem.interface";

export const getUserLibraryItems = async (
  accessToken: string | null,
  onSuccess: (data: UserLibraryItem[]) => void
): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/library`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  onSuccess(data.results);
};

export const getSentences = async (
  id: string | undefined,
  sentenceFrom: number,
  countOfSentences: number,
  localSentenceFrom: number
) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/sentence/${id}?sentenceFrom=${
      localSentenceFrom ? localSentenceFrom : sentenceFrom
    }&countOfSentences=${countOfSentences}`,
    {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getUserSentences = async (
  libraryId: string | undefined,
  sentenceFrom: number,
  countOfSentences: number,
  localSentenceFrom: number,
  sourceLanguage: string,
  targetLanguage: string
) => {
  const requestBody = {
    libraryId: libraryId,
    sentenceFrom: localSentenceFrom ? localSentenceFrom : sentenceFrom,
    countOfSentences: countOfSentences,
    localSentenceFrom: localSentenceFrom,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  };

  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/sentences`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(requestBody),
    }
  );
  const data = await response.json();
  return data.results;
};
