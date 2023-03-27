import { debounce } from "lodash";

export const addWordToUser = debounce(
  async (
    word: string,
    sourceLanguage: string,
    targetLanguage: string,
    accessToken: string | null
  ): Promise<void> => {
    await fetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/add-word`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sourceLanguage,
          targetLanguage,
          word,
        }),
      }
    );
  },
  1000
);

export const updateBookState = debounce(
  async (book: string | undefined, page: number, pageSize: number) => {
    // Update the book state in the backend
    await fetch(
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
    );
  },
  1000 // Debounce delay in milliseconds
);

/* 
export const updateUserReadingProgress = async (
  book: string | undefined,
  page: number,
  pageSize: number,
  accessToken: string | null
): Promise<void> => {
  await fetch(
    `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/user/update-reading-progress`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        book,
        page,
        pageSize,
      }),
    }
  );
}; */
