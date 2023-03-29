import { UserSentence } from "../models/userSentence.interface";
import { VocabularyListUserPhrase } from "../models/VocabularyListUserPhrase";

export const mapUserSentencesToVocabularyListUserPhrases = (
  userSentences: UserSentence[]
): VocabularyListUserPhrase[] => {
  const vocabularyListUserPhrases: VocabularyListUserPhrase[] = [];

  userSentences.forEach((userSentence) => {
    userSentence.phrases.forEach((userPhrase) => {
      const vocabularyListUserPhrase: VocabularyListUserPhrase = {
        phrase: userPhrase,
        sentence_no: userSentence.sentence_no,
      };

      vocabularyListUserPhrases.push(vocabularyListUserPhrase);
    });
  });

  return vocabularyListUserPhrases;
};
