import { useEffect, useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import React from "react";
import {
  getHighlightPositions,
  isWordInHighlightedPhrase,
} from "@/utils/getHighlightPosition";
import { UserSentence } from "@/models/userSentence.interface";
import { getHighlightedWords } from "@/utils/getHighlightedWords";
import { addUserPhrase } from "@/services/userService";
import { useParams } from "react-router-dom";
import { VocabularyListUserPhrase } from "@models/VocabularyListUserPhrase";

interface TranslateBoxProps {
  mode: string;
  sourceLanguage: "en" | "cz" | "sk";
  targetLanguage: "en" | "cz" | "sk";
  texts: {
    en: { text: string; sentence_no: number }[];
    cz: { text: string; sentence_no: number }[];
    sk: { text: string; sentence_no: number }[];
  };
  currentTextIndex: number;
  sentenceFrom: number;
  sentencesPerPage: number;
  userSentences: UserSentence[];
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
  onAddUserPhrase,
}) => {
  const { libraryId } = useParams();

  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<
    { word: string; wordIndexInSentence: number; sentenceNumber: number }[]
  >([]);
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
          const vocabularyListUserPhrase: VocabularyListUserPhrase = {
            phrase: {
              sourceText: selectedPhrase,
              targetText: selectedPhrase,
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

  const handleMouseDown = (
    word: string,
    sentenceNumber: number,
    wordIndexInSentence: number
  ) => {
    setMouseDown(true);
    setSelectedSentence(sentenceNumber);
    setSelectedWords([{ word, wordIndexInSentence, sentenceNumber }]);
  };

  const handleMouseEnter = (
    word: string,
    sentenceNumber: number,
    wordIndexInSentence: number
  ) => {
    if (mouseDown && selectedSentence == sentenceNumber) {
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
    let stopOnCollision = false;
    const phrase = sortedSelectedWords
      .map(({ word, wordIndexInSentence }) => {
        if (
          stopOnCollision ||
          getHighlightedWords(userSentences, sentenceNumber).includes(
            wordIndexInSentence
          )
        ) {
          stopOnCollision = true;
          return null;
        } else {
          return word;
        }
      })
      .filter((word) => word !== null)
      .join(" ");
    setSelectedPhrase(phrase);
    // Get the start and end positions
    if (sortedSelectedWords.length > 0) {
      const startPosition = sortedSelectedWords[0].wordIndexInSentence;
      const endPosition =
        sortedSelectedWords[sortedSelectedWords.length - 1].wordIndexInSentence;

      setStartPosition(startPosition);
      setEndPosition(endPosition);
    }
    console.log("Selected sentence from TranslateBox: ", selectedSentence);
    console.log("Selected phrase: ", phrase);
  };

  const getSourceTexts = () => {
    return texts[sourceLanguage];
  };

  const getTargetTexts = () => {
    return texts[targetLanguage];
  };

  const sourceTexts = getSourceTexts();
  const targetTexts = getTargetTexts();

  const visibleSourceTexts = sourceTexts.slice(
    currentTextIndex - sentenceFrom + 1,
    currentTextIndex - sentenceFrom + 1 + sentencesPerPage
  );
  const visibleTargetTexts = targetTexts.slice(
    currentTextIndex - sentenceFrom + 1,
    currentTextIndex - sentenceFrom + 1 + sentencesPerPage
  );

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

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
                //onClick={handleWordClick}
                mode={mode}
                highlightPositions={getHighlightPositions(
                  userSentences,
                  textObj.sentence_no,
                  index
                )}
              />
            </div>
          ))
        : visibleSourceTexts.map((sentence, index) => {
            const sentenceLines = sentence.text.split("\n");
            let wordCounter = 0;
            return (
              <div key={index} style={{ whiteSpace: "pre-wrap" }}>
                {sentenceLines.map((line, lineIndex) => (
                  <React.Fragment key={`${index}-${lineIndex}`}>
                    {line.split(" ").map((word, wordIndex) => {
                      const wordIndexInSentence = wordCounter++;

                      return (
                        <TranslateWord
                          key={`${index}-${lineIndex}-${wordIndex}`}
                          word={word}
                          translation={
                            visibleTargetTexts[index].text
                              .split("\n")
                              [lineIndex].split(" ")[wordIndex]
                          }
                          sentenceNumber={sentence.sentence_no}
                          mode={mode}
                          onMouseDown={(word: string, sentenceNumber: number) =>
                            handleMouseDown(
                              word,
                              sentenceNumber,
                              wordIndexInSentence
                            )
                          }
                          onMouseEnter={(
                            word: string,
                            sentenceNumber: number
                          ) =>
                            handleMouseEnter(
                              word,
                              sentenceNumber,
                              wordIndexInSentence
                            )
                          }
                          onMouseUp={handleMouseUp}
                          highlightPositions={getHighlightPositions(
                            userSentences,
                            sentence.sentence_no,
                            wordIndexInSentence
                          )}
                          isHighlighted={isWordInHighlightedPhrase(
                            userSentences, // Add this argument
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
