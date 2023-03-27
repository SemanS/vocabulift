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
    { word: string; globalIndex: number; sentenceNumber: number }[]
  >([]);

  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);

  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseDown = (
    word: string,
    sentenceNumber: number,
    globalIndex: number
  ) => {
    setMouseDown(true);
    setSelectedSentence(sentenceNumber);
    setSelectedWords([{ word, globalIndex, sentenceNumber }]);
  };

  const handleMouseEnter = (
    word: string,
    sentenceNumber: number,
    globalIndex: number
  ) => {
    if (mouseDown && selectedSentence === sentenceNumber) {
      setSelectedWords((prevWords) => {
        const wordIndexInSelected = prevWords.findIndex(
          (w) =>
            w.globalIndex === globalIndex && w.sentenceNumber === sentenceNumber
        );

        if (wordIndexInSelected === -1) {
          return [...prevWords, { word, globalIndex, sentenceNumber }];
        } else {
          return prevWords.slice(0, wordIndexInSelected + 1);
        }
      });
    }
  };

  const handleMouseUp = (sentenceNumber: number) => {
    setMouseDown(false);
    const sortedSelectedWords = selectedWords.sort(
      (a, b) => a.globalIndex - b.globalIndex
    );
    const selectedPhrase = sortedSelectedWords
      .map(({ word }) => word)
      .join(" ");
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
            return (
              <div key={index} style={{ whiteSpace: "pre-wrap" }}>
                {sentenceLines.map((line, lineIndex) => (
                  <React.Fragment key={`${index}-${lineIndex}`}>
                    {line.split(" ").map((word, wordIndex) => {
                      const globalIndex =
                        wordIndex +
                        lineIndex *
                          visibleSourceTexts[index].text
                            .split("\n")
                            [lineIndex].split(" ").length;
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
                            handleMouseDown(word, sentenceNumber, globalIndex)
                          }
                          onMouseEnter={(
                            word: string,
                            sentenceNumber: number
                          ) =>
                            handleMouseEnter(word, sentenceNumber, globalIndex)
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
                              selectedWord.globalIndex === globalIndex &&
                              selectedWord.sentenceNumber ===
                                sentence.sentence_no
                          )}
                          wordIndex={wordIndex}
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
