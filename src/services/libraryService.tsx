import { LibraryItem } from "@/models/libraryItem.interface";

export const getLibraryItems = async (
  accessToken: string | null
): Promise<LibraryItem[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/library`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.libraryItems;
  //onSuccess(data.libraryItems);
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

export const postLibraryVideo = async (input: string) => {
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
