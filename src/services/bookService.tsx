import { vocabuFetch } from "@/utils/vocabuFetch";
import { debounce } from "lodash";

export const addWordToUser = debounce(
  async (
    word: string,
    sourceLanguage: string,
    targetLanguage: string,
    accessToken: string | null
  ): Promise<void> => {
    await vocabuFetch(
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
