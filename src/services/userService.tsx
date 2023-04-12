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
  libraryId: string | undefined,
  sentenceFrom: number,
  countOfSentences: number,
  localSentenceFrom: number,
  sourceLanguage: string,
  targetLanguage: string
) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/sentence/${libraryId}?sentenceFrom=${
      localSentenceFrom ? localSentenceFrom : sentenceFrom
    }&countOfSentences=${countOfSentences}&languages=${encodeURIComponent(
      [sourceLanguage, targetLanguage].join(",")
    )}`,
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
  sentenceFrom: number,
  countOfSentences: number,
  localSentenceFrom: number,
  sourceLanguage: string,
  targetLanguage: string,
  orderBy: string,
  libraryId?: string | undefined
) => {
  const requestBody = {
    sentenceFrom: localSentenceFrom ? localSentenceFrom : sentenceFrom,
    countOfSentences: countOfSentences,
    localSentenceFrom: localSentenceFrom,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    orderBy: orderBy,
    libraryId: libraryId,
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

export const addUserPhrase = async (
  word: string,
  selectedWordTranslation: string | null,
  libraryId: string | undefined,
  sentenceNo: number | null,
  sentenceText: string | null,
  startPosition: number | null,
  endPosition: number | null,
  sourceLanguage: string,
  targetLanguage: string,
  sentencesPerPage: number,
  currentPage: number,
  libraryTitle: string | undefined,
  accessToken: string | null
): Promise<any> => {
  const requestBody = {
    word: word,
    selectedWordTranslation: selectedWordTranslation,
    libraryId: libraryId,
    sentenceNo: sentenceNo,
    sentenceText: sentenceText,
    startPosition: startPosition,
    endPosition: endPosition,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    sentencesPerPage: sentencesPerPage,
    currentPage: currentPage,
    title: libraryTitle,
  };
  console.log("ss" + sentenceText);
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/add-phrase`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const deleteUserPhrase = async (
  libraryId: string | undefined,
  sentenceNo: number | null,
  startPosition: number | null,
  sourceLanguage: string,
  targetLanguage: string,
  accessToken: string | null
): Promise<void> => {
  const requestBody = {
    libraryId: libraryId,
    sentenceNo: sentenceNo,
    startPosition: startPosition,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  };
  await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/delete-phrase`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    }
  );
};

export const updateReadingProgress = async (
  book: string | undefined,
  page: number,
  pageSize: number
) => {
  // Update the book state in the backend
  /* await fetch(
    `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/user/update-reading-progress`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        book,
        page,
        pageSize,
      }),
    }
  ); */
};
