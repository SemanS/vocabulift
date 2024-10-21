import { vocabuFetch } from "@/utils/vocabuFetch";

export const getSnapshots = async (
  sourceLanguage: string,
  targetLanguage: string,
  input: string
) => {
  const response = await vocabuFetch(
    `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/new/generateSnapshots`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        sourceLanguage,
        targetLanguage,
        input,
      }),
    }
  );
  const data = await response.json();
  return data.snapshots;
};
