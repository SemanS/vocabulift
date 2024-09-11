import { vocabuFetch } from "@/utils/vocabuFetch";

export const getTriples = async (
  libraryIds: Array<{ libraryId: string; speaker: number }>
) => {
  try {
    const response = await vocabuFetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/analytic/triplestagcloud`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          libraryIds, // Pass array of libraryIds and speakers
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.text();
  } catch (err: any) {
    throw err;
  }
};
