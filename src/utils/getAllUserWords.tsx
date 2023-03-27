import { UserSentence, UserWord } from "@/models/userSentence.interface";

export const getAllUserWords = (userSentences: UserSentence[]): UserWord[] => {
  return userSentences.reduce(
    (allUserWords: UserWord[], userSentence: UserSentence) => {
      const wordsAndPhrases = [...userSentence.words, ...userSentence.phrases];
      return [...allUserWords, ...wordsAndPhrases];
    },
    []
  );
};
