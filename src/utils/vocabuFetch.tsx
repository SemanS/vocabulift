export async function vocabuFetch(
  url: string,
  options: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    console.log("response.status" + JSON.stringify(response.status, null, 2));
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Session timeout");
    }

    return response;
  } catch (error) {
    throw error;
  }
}
