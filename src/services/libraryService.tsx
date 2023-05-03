import { LibraryItem } from "@/models/libraryItem.interface";
import { LabelType } from "@/models/sentences.interfaces";
import { UserEntity } from "@/models/user";

export const getLibraryItems = async (
  userEntity: UserEntity
): Promise<Record<LabelType, LibraryItem[]>> => {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/library`,
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
  const response = await fetch(
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
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/library/video`,
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
  return response;
};
