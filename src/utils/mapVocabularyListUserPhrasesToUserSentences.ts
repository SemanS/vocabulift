import { VocabularyListUserPhrase } from "@/models/VocabularyListUserPhrase";
import { UserPhrase, UserSentence } from "@/models/userSentence.interface";

export function mapVocabularyListUserPhrasesToUserSentences(
  vocabularyListUserPhrases: VocabularyListUserPhrase[],
  userSentences: UserSentence[]
): UserSentence[] {
  // First, group VocabularyListUserPhrase objects by their sentence_no
  const phrasesBySentenceNo: { [key: number]: UserPhrase[] } = {};

  vocabularyListUserPhrases.forEach((item) => {
    if (!phrasesBySentenceNo[item.sentence_no]) {
      phrasesBySentenceNo[item.sentence_no] = [];
    }
    phrasesBySentenceNo[item.sentence_no].push(item.phrase);
  });

  // Then, update the UserSentence objects with the grouped phrases
  const updatedUserSentences = userSentences.map((userSentence) => {
    const updatedPhrases = phrasesBySentenceNo[userSentence.sentence_no] || [];
    return {
      ...userSentence,
      phrases: updatedPhrases,
    };
  });

  return updatedUserSentences;
}
