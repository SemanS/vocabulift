import { useState } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import React from "react";

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
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleMouseDown = (word: string) => {
    if (mode === "word") {
      console.log(word);
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleMouseEnter = (word: string) => {
    if (mode === "word" && selectedWords.length > 0) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleMouseUp = () => {
    if (mode === "word") {
      const separator = " "; // Space character as a separator
      const selectedWord = selectedWords.join(separator);
      console.log(selectedWords);
      onClick && onClick(selectedWord);
      setSelectedWords([]);
    }
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
                />
              ))}
            </div>
          ))}
    </>
  );
};

export default TranslateBox;
