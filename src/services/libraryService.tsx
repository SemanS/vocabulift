import { LibraryItem } from "@/models/libraryItem.interface";
import { LabelType } from "@/models/sentences.interfaces";
import { UserEntity } from "@/models/user";
import { vocabuFetch } from "@/utils/vocabuFetch";

export const getLibraryItem = async (
  libraryId: string
): Promise<LibraryItem> => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/library/${libraryId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    }
  );
  const data = await response.json();
  return data.library;
};

export const getVocabularyLibraryItems = async (
  userEntity: UserEntity
): Promise<LibraryItem[]> => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/vocabulary/libraries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ userEntity }),
    }
  );
  const data = await response.json();
  return data.libraryItems;
};

export const getLibraryItems = async (
  userEntity: UserEntity
): Promise<Record<LabelType, LibraryItem[]>> => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/libraries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ userEntity }),
    }
  );
  const data = await response.json();
  return data.libraryItems;
};

export const postLibraryInputVideoLanguages = async (input: string) => {
  const response = await vocabuFetch(
    `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/library/input/video/languages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ input }),
    }
  );

  return response;
};

export const postLibraryVideo = async (
  sourceLanguage: string,
  targetLanguage: string,
  input: string
) => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/library/add/video`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        input: input,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      }),
    }
  );
  return response.json();
};

export const postPauseNotified = async () => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/notify-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    }
  );
  return response.json();
};
