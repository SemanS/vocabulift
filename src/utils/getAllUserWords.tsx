import { UserSentence } from "@/models/userSentence.interface";
import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";

export const getAllUserWords = (
  userSentences: UserSentence[] | undefined
): VocabularyListUserPhrase[] => {
  return userSentences!.reduce(
    (
      allUserPhrases: VocabularyListUserPhrase[],
      userSentence: UserSentence
    ) => {
      const phrasesWithSentenceNo = userSentence.phrases.map((phrase) => ({
        phrase,
        sentence_no: userSentence.sentence_no,
      }));
      return [...allUserPhrases, ...phrasesWithSentenceNo];
    },
    []
  );
};
