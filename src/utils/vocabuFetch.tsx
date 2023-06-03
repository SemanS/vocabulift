export async function vocabuFetch(
  url: string,
  options: RequestInit
): Promise<Response> {
  return await fetch(url, options).then((response: Response) => {
    if (response.status === 401) {
      // assuming 401 is the status code for timeout
      window.location.href = "/login";
      return Promise.reject(new Error("Session timeout"));
    }
    return response;
  });
}
