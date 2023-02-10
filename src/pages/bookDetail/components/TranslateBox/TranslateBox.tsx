import { useState, useEffect } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import { Switch } from "antd";
import React from "react";

interface TranslateBoxProps {
  text_en: string;
  text_cz: string;
  text_sk: string;
  onClick: (word: string) => void;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  text_en,
  text_cz,
  text_sk,
  onClick,
}) => {
  const [translationsEn, setTranslationsEn] = useState<string[]>([]);
  const [translationsCz, setTranslationsCz] = useState<string[]>([]);
  const [translationsSk, setTranslationsSk] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [mode, setMode] = useState<"word" | "sentence">("word");

  const handleWordClick = (word: string) => {
    onClick(word);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let dataEn;
        let dataCz;
        let dataSk = ["", ""];

        if (mode === "word") {
          dataEn = text_en.split(" ");
          dataCz = text_cz.split(" ");
          dataSk = text_sk.split(" ");
        } else {
          dataEn = text_en.split(/(?<!Mr\.)(?<!Mrs\.)(?<=[.!?])\s/g);
          dataCz = text_cz.split(/(?<!Mr\.)(?<!Mrs\.)(?<=[.!?])\s/g);
        }
        setTranslationsEn(dataEn);
        setTranslationsCz(dataCz);
        setTranslationsSk(dataSk);
      } catch (err) {
        setError(err as Error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [text_en, mode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={mode === "sentence"}
          onChange={() => setMode(mode === "word" ? "sentence" : "word")}
        />
        Translate by word or sentence
      </div>
      {mode == "sentence"
        ? translationsEn.map((sentence_en, index) => (
            <TranslateWord
              key={index}
              word={sentence_en}
              translation={translationsCz[index]}
              onClick={handleWordClick}
            />
          ))
        : translationsEn.map((sentence_en, index) => (
            <TranslateWord
              key={index}
              word={sentence_en}
              translation={translationsSk[index]}
              onClick={handleWordClick}
            />
          ))}
    </>
  );
};

export default TranslateBox;
