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
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);

  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseDown = (word: string, sentenceNumber: number) => {
    setMouseDown(true);
    setSelectedSentence(sentenceNumber);
    setSelectedWords([word]);
  };

  const handleMouseEnter = (word: string, sentenceNumber: number) => {
    if (mouseDown && selectedSentence === sentenceNumber) {
      setSelectedWords((prevWords) => {
        const wordIndex = prevWords.indexOf(word);
        if (wordIndex === -1) {
          return [...prevWords, word];
        } else {
          return prevWords.slice(0, wordIndex + 1);
        }
      });
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    console.log("Selected phrase:", selectedWords.join(" "));
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
        : visibleSourceTexts.map((sentence, index) => (
            <div key={index} style={{ whiteSpace: "pre-wrap" }}>
              {sentence.text.split(" ").map((word, wordIndex) => (
                <TranslateWord
                  key={`${index}-${wordIndex}`}
                  word={word}
                  translation={
                    visibleTargetTexts[index].text.split(" ")[wordIndex]
                  }
                  sentenceNumber={sentence.sentence_no}
                  mode={mode}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseUp={handleMouseUp}
                  highlightPositions={getHighlightPositions(
                    userSentences,
                    sentence.sentence_no,
                    wordIndex
                  )}
                  isHighlighted={
                    selectedWords.includes(word) &&
                    selectedSentence === sentence.sentence_no
                  }
                />
              ))}
            </div>
          ))}
    </>
  );
};

export default TranslateBox;
