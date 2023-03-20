import { useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import React from "react";

interface TranslateBoxProps {
  mode: string;
  sourceLanguage: string;
  targetLanguage: string;
  texts_en: { text: string; sentence_no: number }[];
  texts_cz: { text: string; sentence_no: number }[];
  texts_sk: { text: string; sentence_no: number }[];
  currentTextIndex: number;
  sentenceFrom: number;
  sentencesPerPage: number;
  onClick: (word: string, sentenceNumber: number) => void;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  mode,
  sourceLanguage,
  targetLanguage,
  texts_en,
  texts_cz,
  texts_sk,
  currentTextIndex,
  sentenceFrom,
  sentencesPerPage,
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  //const [mode, setMode] = useState<"word" | "sentence">("word");

  const getSourceTexts = () => {
    switch (sourceLanguage) {
      case "en":
        return texts_en;
      case "cz":
        return texts_cz;
      case "sk":
        return texts_sk;
      default:
        return texts_en;
    }
  };

  const getTargetTexts = () => {
    switch (targetLanguage) {
      case "en":
        return texts_en;
      case "cz":
        return texts_cz;
      case "sk":
        return texts_sk;
      default:
        return texts_en;
    }
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

  const handleWordClick = (word: string, sentenceNumber: number) => {
    onClick(word, sentenceNumber);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <>
      {mode == "sentence"
        ? visibleSourceTexts.map((textObj, index) => (
            <TranslateWord
              key={index}
              word={textObj.text}
              translation={visibleTargetTexts[index].text}
              sentenceNumber={textObj.sentence_no}
              onClick={handleWordClick}
              mode={mode}
            />
          ))
        : visibleSourceTexts.map((sentence, index) =>
            sentence.text
              .split(" ")
              .map((word, wordIndex) => (
                <TranslateWord
                  key={`${index}-${wordIndex}`}
                  word={word}
                  translation={
                    visibleTargetTexts[index].text.split(" ")[wordIndex]
                  }
                  sentenceNumber={sentence.sentence_no}
                  onClick={handleWordClick}
                  mode={mode}
                />
              ))
          )}
    </>
  );
};

export default TranslateBox;
