import { UserSentence } from "../models/userSentence.interface";
import { VocabularyListUserPhrase } from "../models/VocabularyListUserPhrase";

export const mapUserSentencesToVocabularyListUserPhrases = (
  userSentences: UserSentence[]
): VocabularyListUserPhrase[] => {
  return userSentences.flatMap((userSentence) => {
    return userSentence.phrases.map((userPhrase) => {
      const vocabularyListUserPhrase: VocabularyListUserPhrase = {
        phrase: userPhrase,
        sentenceNo: userPhrase.sentenceNo,
      };

      return vocabularyListUserPhrase;
    });
  });
};
