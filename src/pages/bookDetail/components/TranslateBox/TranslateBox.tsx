import { useEffect, useMemo, useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import { useParams } from "react-router-dom";
import {
  getHighlightPositions,
  isWordInHighlightedPhrase,
} from "@/utils/getHighlightPosition";
import { UserSentence } from "@/models/userSentence.interface";
import { getHighlightedWords } from "@/utils/getHighlightedWords";
import { addUserPhrase } from "@/services/userService";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";
import React from "react";
import { SentenceWord } from "@/models/sentences.interfaces";

interface TranslateBoxProps {
  mode: string;
  sourceLanguage: "en" | "cz" | "sk";
  targetLanguage: "en" | "cz" | "sk";
  texts: Record<"en" | "cz" | "sk", { text: string; sentence_no: number }[]>;
  currentTextIndex: number;
  sentenceFrom: number;
  sentencesPerPage: number;
  userSentences: UserSentence[];
  vocabularyListUserPhrases: VocabularyListUserPhrase[];
  sentenceWords: SentenceWord[];
  onAddUserPhrase: (vocabularyListUserPhrase: VocabularyListUserPhrase) => void;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  mode,
  sourceLanguage,
  targetLanguage,
  texts,
  currentTextIndex,
  sentenceFrom,
  sentencesPerPage,
  userSentences,
  vocabularyListUserPhrases,
  sentenceWords,
  onAddUserPhrase,
}) => {
  const { libraryId } = useParams();
  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<any[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [startPosition, setStartPosition] = useState<number | null>(null);
  const [endPosition, setEndPosition] = useState<number | null>(null);

  useEffect(() => {
    if (selectedPhrase) {
      addUserPhrase(
        selectedPhrase,
        libraryId,
        selectedSentence,
        startPosition,
        endPosition,
        sourceLanguage,
        targetLanguage,
        sessionStorage.getItem("access_token")
      ).then((response) => {
        if (response.status === "success") {
          console.log(JSON.stringify(response.data));
          const vocabularyListUserPhrase: VocabularyListUserPhrase = {
            phrase: {
              sourceText: selectedPhrase,
              targetText:
                response.data.phrases[response.data.phrases.length - 1]
                  .targetText,
              startPosition: startPosition!,
              endPosition: endPosition!,
            },
            sentence_no: selectedSentence!,
          };
          onAddUserPhrase(vocabularyListUserPhrase);
        }
      });
    }
  }, [selectedPhrase]);

  useEffect(() => {
    // This effect will run whenever vocabularyListUserPhrases changes
    setSelectedWords([]);
  }, [vocabularyListUserPhrases]);

  const handleMouseEvent = (
    eventType: "down" | "enter",
    word: string,
    sentenceNumber: number,
    wordIndexInSentence: number
  ) => {
    if (eventType === "down") {
      setMouseDown(true);
      setSelectedSentence(sentenceNumber);
      setSelectedWords([{ word, wordIndexInSentence, sentenceNumber }]);
    } else if (
      eventType === "enter" &&
      mouseDown &&
      selectedSentence === sentenceNumber
    ) {
      setSelectedWords((prevWords: any) => {
        if (!prevWords || prevWords.length == 0) {
          return [];
        }
        const initialSelected = prevWords[0];
        const sentenceObj: any = visibleSourceTexts.find(
          (s) => s.sentence_no == sentenceNumber
        );
        const sentenceText = sentenceObj.text;
        const sentenceLines = sentenceText.split("\n");
        const wordsArray = sentenceLines.flatMap((line: any) =>
          line
            .split(" ")
            .map((word: string) => word.trim())
            .filter((word: string) => word !== "")
        );

        const highlightedWords = getHighlightedWords(
          userSentences,
          sentenceNumber
        );

        const newSelectedWords = [];
        const tempSelectedWords = [];

        const checkCollision = (index: number) => {
          return highlightedWords.includes(index);
        };

        let hasCollision = false;

        if (wordIndexInSentence >= initialSelected.wordIndexInSentence) {
          for (
            let i = initialSelected.wordIndexInSentence;
            i <= wordIndexInSentence;
            i++
          ) {
            if (checkCollision(i)) {
              hasCollision = true;
              break;
            }
            tempSelectedWords.push({
              word: wordsArray[i],
              wordIndexInSentence: i,
              sentenceNumber: sentenceNumber,
            });
          }
        } else {
          for (
            let i = wordIndexInSentence;
            i <= initialSelected.wordIndexInSentence;
            i++
          ) {
            if (checkCollision(i)) {
              hasCollision = true;
              break;
            }
            tempSelectedWords.unshift({
              word: wordsArray[i],
              wordIndexInSentence: i,
              sentenceNumber: sentenceNumber,
            });
          }
        }

        if (!hasCollision) {
          newSelectedWords.push(...tempSelectedWords);
        } else {
          newSelectedWords.push(...prevWords);
        }

        return newSelectedWords;
      });
    }
  };

  const handleMouseUp = (sentenceNumber: number) => {
    setMouseDown(false);
    const sortedSelectedWords = selectedWords.sort(
      (a, b) => a.wordIndexInSentence - b.wordIndexInSentence
    );
    const highlightedWords = getHighlightedWords(userSentences, sentenceNumber);
    const phrase = sortedSelectedWords
      .map(({ word, wordIndexInSentence }) =>
        !highlightedWords.includes(wordIndexInSentence) ? word : null
      )
      .filter((word) => word !== null)
      .join(" ");
    setSelectedPhrase(phrase);
    if (sortedSelectedWords.length > 0) {
      setStartPosition(sortedSelectedWords[0].wordIndexInSentence);
      setEndPosition(
        sortedSelectedWords[sortedSelectedWords.length - 1].wordIndexInSentence
      );
    }
  };

  const getTexts = (language: "en" | "cz" | "sk") => texts[language];

  const sourceTexts = getTexts(sourceLanguage);
  const targetTexts = getTexts(targetLanguage);

  const getVisibleTexts = (textArray: any[]) =>
    textArray.slice(
      currentTextIndex - sentenceFrom + 1,
      currentTextIndex - sentenceFrom + 1 + sentencesPerPage
    );

  const visibleSourceTexts = getVisibleTexts(sourceTexts);
  const visibleTargetTexts = getVisibleTexts(targetTexts);

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  interface MappedSentenceWord {
    sourceWord: string;
    targetWord: string;
  }

  interface MappedSentenceWords {
    [sentenceNo: number]: MappedSentenceWord[];
  }

  const mappedSentenceWords = useMemo(() => {
    const mapSentenceWords = (
      sentenceWords: SentenceWord[]
    ): MappedSentenceWords => {
      const mappedData: MappedSentenceWords = {};

      sentenceWords.forEach((sentenceWord) => {
        mappedData[sentenceWord.sentence_no] = sentenceWord.sentenceWord.map(
          (wordDetail) => ({
            sourceWord: wordDetail.sourceWordText,
            targetWord: wordDetail.targetWordText,
          })
        );
      });

      return mappedData;
    };

    return mapSentenceWords(sentenceWords);
  }, [sentenceWords]);

  return (
    <>
      {mode === "sentence"
        ? visibleSourceTexts.map((textObj, index) => (
            <div key={index} style={{ whiteSpace: "pre-wrap" }}>
              <TranslateWord
                key={index}
                word={textObj.text}
                translation={visibleTargetTexts[index].text}
                sentenceNumber={textObj.sentence_no}
                mode={mode}
              />
            </div>
          ))
        : visibleSourceTexts.map((sentence, index) => {
            const sentenceLines = sentence.text.split("\n");
            let wordCounter = 0;
            return (
              <div key={index} style={{ whiteSpace: "pre-wrap" }}>
                {sentenceLines.map((line: string, lineIndex: number) => (
                  <React.Fragment key={`${index}-${lineIndex}`}>
                    {line.split(" ").map((word, wordIndex) => {
                      const wordIndexInSentence = wordCounter++;
                      const currentSentenceMappedWords =
                        mappedSentenceWords[sentence.sentence_no] || [];
                      const translation = currentSentenceMappedWords.find(
                        (mappedWord) => mappedWord.sourceWord === word
                      )?.targetWord;

                      return (
                        <TranslateWord
                          key={`${index}-${lineIndex}-${wordIndex}`}
                          word={word}
                          translation={translation}
                          sentenceNumber={sentence.sentence_no}
                          mode={mode}
                          onMouseDown={(word: string, sentenceNumber: number) =>
                            handleMouseEvent(
                              "down",
                              word,
                              sentenceNumber,
                              wordIndexInSentence
                            )
                          }
                          onMouseEnter={(
                            word: string,
                            sentenceNumber: number
                          ) =>
                            handleMouseEvent(
                              "enter",
                              word,
                              sentenceNumber,
                              wordIndexInSentence
                            )
                          }
                          onMouseUp={handleMouseUp}
                          highlightPositions={getHighlightPositions(
                            userSentences,
                            vocabularyListUserPhrases, // Add this argument
                            sentence.sentence_no,
                            wordIndexInSentence
                          )}
                          isHighlighted={isWordInHighlightedPhrase(
                            userSentences,
                            selectedWords,
                            word,
                            wordIndexInSentence,
                            sentence.sentence_no
                          )}
                          wordIndex={wordIndexInSentence}
                        />
                      );
                    })}

                    {lineIndex < sentenceLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            );
          })}
    </>
  );
};

export default TranslateBox;
