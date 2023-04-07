export const getUserSentencesForVocabulary = async (
  sentenceFrom: number,
  countOfSentences: number,
  localSentenceFrom: number,
  sourceLanguage: string,
  targetLanguage: string,
  orderBy: string,
  libraryId?: string | undefined
) => {
  const requestBody = {
    sentenceFrom: localSentenceFrom ? localSentenceFrom : sentenceFrom,
    countOfSentences: countOfSentences,
    localSentenceFrom: localSentenceFrom,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    orderBy: orderBy,
    libraryId: libraryId,
  };

  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/user/vocabulary?offset=1&limit=100`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(requestBody),
    }
  );
  const data = await response.json();
  return data.results;
};
