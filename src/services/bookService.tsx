export const addWordToUser = async (
  word: string,
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
        language: "en",
        word,
      }),
    }
  );
};

export const updateUserReadingProgress = async (
  book: string,
  page: string,
  pageSize: string,
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
        language: "en",
        word,
      }),
    }
  );
};
