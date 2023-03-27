import { useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import React from "react";
import { getHighlightPositions } from "@/utils/getHighlightPosition";
import { UserSentence } from "@/models/userSentence.interface";

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
  onClick?: (word: string) => void;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  mode,
  sourceLanguage,
  targetLanguage,
  texts,
  currentTextIndex,
  sentenceFrom,
  sentencesPerPage,
  onClick,
  userSentences,
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<
    { word: string; wordIndexInSentence: number; sentenceNumber: number }[]
  >([]);

  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);

  const [mouseDown, setMouseDown] = useState(false);

  const mergeHighlightedWords = (
    selectedWords: Array<{
      word: string;
      wordIndexInSentence: number;
      sentenceNumber: number;
    }>,
    userSentences: UserSentence[],
    visibleSourceTexts: { text: string; sentence_no: number }[]
  ) => {
    const mergedWords = [...selectedWords];
    const sentence_no = selectedWords[0].sentenceNumber;

    const userSentence = userSentences.find((userSentence) => {
      return userSentence.sentence_no === sentence_no;
    });

    const sentenceObj = visibleSourceTexts.find(
      (sourceText) => sourceText.sentence_no === sentence_no
    );

    if (userSentence && sentenceObj) {
      // Merge words from userSentences
      userSentence.words.forEach((userWord: any) => {
        if (
          !mergedWords.some(
            (mergedWord) =>
              mergedWord.wordIndexInSentence === userWord.position &&
              mergedWord.sentenceNumber === sentence_no
          )
        ) {
          mergedWords.push({
            word: userWord.sourceText,
            wordIndexInSentence: userWord.position,
            sentenceNumber: sentence_no,
          });
        }
      });

      // Merge phrases from userSentences
      userSentence.phrases.forEach((userPhrase: any) => {
        for (
          let position = userPhrase.positionStart;
          position <= userPhrase.positionEnd;
          position++
        ) {
          if (
            !mergedWords.some(
              (mergedWord) =>
                mergedWord.wordIndexInSentence === position &&
                mergedWord.sentenceNumber === sentence_no
            )
          ) {
            const word = sentenceObj.text.split(" ")[position];
            mergedWords.push({
              word: word,
              wordIndexInSentence: position,
              sentenceNumber: sentence_no,
            });
          }
        }
      });
    }

    return mergedWords.sort(
      (a, b) => a.wordIndexInSentence - b.wordIndexInSentence
    );
  };

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
    if (mouseDown && selectedSentence === sentenceNumber) {
      setSelectedWords((prevWords: any) => {
        const initialSelected = prevWords[0];

        // Find the sentence object based on the sentenceNumber
        const sentenceObj: any = visibleSourceTexts.find(
          (s) => s.sentence_no === sentenceNumber
        );

        // Get the text of the sentence
        const sentenceText = sentenceObj.text;

        // Split the sentence into lines
        const sentenceLines = sentenceText.split("\n");

        // Flatten the lines into a single array of words
        const wordsArray = sentenceLines.flatMap((line: any) =>
          line
            .split(" ")
            .map((word: string) => word.trim())
            .filter((word: string) => word !== "")
        );

        const newSelectedWords = [];
        if (wordIndexInSentence >= initialSelected.wordIndexInSentence) {
          // User is selecting to the right of the initial word
          for (
            let i = initialSelected.wordIndexInSentence;
            i <= wordIndexInSentence;
            i++
          ) {
            newSelectedWords.push({
              word: wordsArray[i],
              wordIndexInSentence: i,
              sentenceNumber: sentenceNumber,
            });
          }
        } else {
          // User is selecting to the left of the initial word
          for (
            let i = wordIndexInSentence;
            i <= initialSelected.wordIndexInSentence;
            i++
          ) {
            newSelectedWords.unshift({
              word: wordsArray[i],
              wordIndexInSentence: i,
              sentenceNumber: sentenceNumber,
            });
          }
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

    // Check if any of the words in the userSentences match the sentenceNumber
    const highlightInSameSentence = userSentences.some(
      (userSentence) => userSentence.sentence_no === sentenceNumber
    );

    let mergedWords = sortedSelectedWords;

    if (highlightInSameSentence) {
      mergedWords = mergeHighlightedWords(sortedSelectedWords, userSentences);
    }

    // Find the phrases in the same sentence
    const phrasesInSameSentence = userSentences
      .filter((sentence) => sentence.sentence_no === sentenceNumber)
      .flatMap((sentence) => sentence.phrases || []);

    // Check if the highlighted word(s) are neighbors with the phrases
    const isNeighbor = (phrase: any, selectedWord: any) => {
      const phrasePositions = phrase.words.map((word: any) => word.position);
      return (
        phrasePositions.includes(selectedWord.wordIndexInSentence - 1) ||
        phrasePositions.includes(selectedWord.wordIndexInSentence + 1)
      );
    };

    // Merge the highlighted word(s) and phrases
    mergedWords.forEach((selectedWord) => {
      const neighboringPhrase = phrasesInSameSentence.find((phrase) =>
        isNeighbor(phrase, selectedWord)
      );

      if (neighboringPhrase) {
        neighboringPhrase.words.push({
          word: selectedWord.word,
          position: selectedWord.wordIndexInSentence,
        });
        neighboringPhrase.words.sort((a, b) => a.position - b.position);
      }
    });

    const selectedPhrase = mergedWords.map(({ word }) => word).join(" ");
    console.log("Selected phrase:", selectedPhrase);
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
                            wordIndex
                          )}
                          isHighlighted={selectedWords.some(
                            (selectedWord) =>
                              selectedWord.word === word &&
                              selectedWord.wordIndexInSentence ===
                                wordIndexInSentence &&
                              selectedWord.sentenceNumber ===
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
