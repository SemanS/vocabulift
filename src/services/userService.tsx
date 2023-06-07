import { User, UserEntity } from "@/models/user";
import { vocabuFetch } from "@/utils/vocabuFetch";
import axios from "axios";

export const getSentences = async (
  libraryId: string | undefined,
  sentenceFrom: number,
  countOfSentences: number,
  localSentenceFrom: number,
  sourceLanguage: string,
  targetLanguage: string
) => {
  const response = await vocabuFetch(
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

export const getUserSentences = async (options: {
  sentenceFrom: number;
  countOfSentences: number;
  sourceLanguage: string;
  targetLanguage: string;
  orderBy?: string | null;
  libraryId?: string | undefined;
  localSentenceFrom?: number | null;
  dateFilter?: string | undefined;
}) => {
  const requestBody = {
    ...options,
  };
  // one method for vocabulary and for bookDetail
  const response = await vocabuFetch(
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
  if (options.dateFilter) {
    return {
      results: data.results.userSentences,
      countOfSentences: data.results.countOfSentences,
    };
  } else {
    return data.results;
  }
};

export const getUserPhrases = async (options: {
  nextCursor: number;
  countOfPhrases: number;
  sourceLanguage: string;
  targetLanguage: string;
  orderBy?: string | null;
  libraryId?: string | undefined;
  dateFilter?: string | undefined;
  filterBy?: any;
}) => {
  const requestBody = {
    ...options,
  };
  // one method for vocabulary and for bookDetail
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/phrases`,
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
  return {
    results: data.results.userPhrases,
    countOfPhrases: data.results.countOfPhrases,
    nextCursor: data.results.nextCursor,
  };
};

export const updateUser = async (userEntity: Partial<User>): Promise<any> => {
  const requestBody = { userEntity };
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const addUserPhrase = async (
  word: string,
  selectedWordTranslation: string | null,
  libraryId: string | undefined,
  sentenceNo: number | null,
  sentenceText: string | null,
  sentenceTextTranslation: string | null,
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
    sentenceTextTranslation: sentenceTextTranslation,
    startPosition: startPosition,
    endPosition: endPosition,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    sentencesPerPage: sentencesPerPage,
    currentPage: currentPage,
    libraryTitle: libraryTitle,
  };
  const response = await vocabuFetch(
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

export const deleteUserPhrases = async (phraseIds: string[]): Promise<void> => {
  const requestBody = {
    phraseIds: phraseIds,
  };

  await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/delete-phrases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
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

export const getUser = async (
  accessToken: string
): Promise<User | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/current`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.body;
  } catch (error) {
    console.error(error);
  }
};
