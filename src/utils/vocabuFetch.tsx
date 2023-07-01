export async function vocabuFetch(
  url: string,
  options: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  options.signal = controller.signal;

  const fetchPromise = fetch(url, options);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort();
      reject(new Error("Request timed out"));
    }, 120000)
  );

  return await Promise.race([fetchPromise, timeoutPromise])
    .then((response: Response) => {
      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Session timeout");
      }
      return response;
    })
    .catch((error: Error) => {
      // Handle or throw the error up to the caller
      throw error;
    });
}
