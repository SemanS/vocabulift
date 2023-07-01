import { vocabuFetch } from "@/utils/vocabuFetch";

export const getWorkSheet = async (
  sourceLanguage: string,
  targetLanguage: string,
  libraryId: string
) => {
  try {
    const response = await vocabuFetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/ai/generateWorkSheet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          libraryId,
          sourceLanguage,
          targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.text(); // Return HTML text instead of blob
  } catch (err: any) {
    throw err;
  }
};
