import { LibraryItem } from "@/models/libraryItem.interface";
import { debounce } from "lodash";

export const getLibraryItems = debounce(
  async (
    accessToken: string | null,
    onSuccess: (data: LibraryItem[]) => void
  ): Promise<void> => {
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
    onSuccess(data.libraryItems);
  },
  1000
);
