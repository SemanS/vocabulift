import { User } from "@/models/user";
import { vocabuFetch } from "@/utils/vocabuFetch";
import { UserPhrase } from "@/models/userSentence.interface";
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
  console.log(requestBody);

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

export const getPhraseMeaning = async (
  phrase: string,
  language: string,
  targetLanguage: string
): Promise<string> => {
  const requestBody = {
    phrase: phrase,
    language: language,
    targetLanguage: targetLanguage,
  };
  try {
    const response = await vocabuFetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/ai/wordMeaning`,
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
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export const getPhraseAlternatives = async (
  phrase: string,
  language: string,
  targetLanguage: string
): Promise<string> => {
  const requestBody = {
    phrase: phrase,
    language: language,
    targetLanguage: targetLanguage,
  };

  try {
    const response = await vocabuFetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/ai/phraseAlternatives`,
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
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
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

export const textToSpeech = async (
  text: string,
  language: string
): Promise<string | undefined> => {
  const requestBody = {
    text,
    language,
  };

  try {
    const response = await vocabuFetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/textToSpeech`,
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
      throw new Error(`Server responded with status ${response.status}`);
    }

    const audioBlob = await response.blob();

    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;

    /* const audio = new Audio(audioUrl);
    await audio.play(); */
  } catch (error) {
    console.error("Error with text to speech request:", error);
  }
};

export const postLanguages = async (
  sourceLanguage: string,
  targetLanguage: string
) => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/setLanguages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      }),
    }
  );
  return response.json();
};
