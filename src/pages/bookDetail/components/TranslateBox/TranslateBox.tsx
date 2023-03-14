import { useState, useEffect } from "react";
import TranslateWord from "../TranslateWord/TranslateWord";
import React from "react";

interface TranslateBoxProps {
  mode: string;
  text_en: { text: string; sentence_no: number }[];
  text_cz: { text: string; sentence_no: number }[];
  text_sk: { text: string; sentence_no: number }[];
  onClick: (word: string) => void;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({
  mode,
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
  //const [mode, setMode] = useState<"word" | "sentence">("word");

  const handleWordClick = (word: string) => {
    onClick(word);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let dataEn;
        let dataCz;
        let dataSk;

        if (mode === "word") {
          dataEn = text_en
            .map((textObj) => textObj.text)
            .join(" ")
            .split(" ");
          dataCz = text_cz
            .map((textObj) => textObj.text)
            .join(" ")
            .split(" ");
          //dataSk = text_sk.map((textObj) => textObj.text).join(" ");
        } else {
          const sentencesByNo: {
            [no: number]: { en: string[]; cz: string[] };
          } = {};
          for (const { text, sentence_no } of text_en) {
            if (!sentencesByNo[sentence_no]) {
              sentencesByNo[sentence_no] = { en: [], cz: [] };
            }
            sentencesByNo[sentence_no].en.push(text);
          }
          for (const { text, sentence_no } of text_cz) {
            if (!sentencesByNo[sentence_no]) {
              sentencesByNo[sentence_no] = { en: [], cz: [] };
            }
            sentencesByNo[sentence_no].cz.push(text);
          }
          const data = Object.values(sentencesByNo).map(({ en, cz }) => ({
            en: en.join(" "),
            cz: cz.join(" "),
          }));
          dataEn = data.map(({ en }) => en);
          dataCz = data.map(({ cz }) => cz);
        }
        setTranslationsEn(Array.isArray(dataEn) ? dataEn : [dataEn]);
        setTranslationsCz(Array.isArray(dataCz) ? dataCz : [dataCz]);
        //setTranslationsSk(Array.isArray(dataSk) ? dataSk : [dataSk]);
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
      {/* <div style={{ marginBottom: 16 }}>
        <Switch
          checked={mode === "sentence"}
          onChange={() => setMode(mode === "word" ? "sentence" : "word")}
        />
        Translate by word or sentence
      </div> */}
      {mode == "sentence"
        ? translationsEn.map((sentence_en, index) => (
            <TranslateWord
              key={index}
              word={sentence_en}
              translation={translationsCz[index]}
              onClick={handleWordClick}
              mode={mode}
            />
          ))
        : translationsEn.map((sentence_en, index) => (
            <TranslateWord
              key={index}
              word={sentence_en}
              translation={translationsSk[index]}
              onClick={handleWordClick}
              mode={mode}
            />
          ))}
    </>
  );
};

const split_text = (text: string) => {
  let sentences = [];
  text = text.replace(/([.?!])\s+(“)/g, "$1$2");
  text = text.replace(/([.?!])\s+(”)/g, "$1$2");
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (".?!“”".includes(text[i])) {
      if (
        (i > 2 && ["Mr", "Dr"].includes(text.slice(i - 2, i))) ||
        (i > 3 && ["Mrs", "Rev"].includes(text.slice(i - 3, i)))
      ) {
        continue;
      }
      let next_char = i + 1 < text.length ? text[i + 1] : null;
      if (next_char && next_char !== " " && !next_char.match(/\d/)) {
        continue;
      }
      let sentence = text.slice(start, i + 1).trim();
      if (sentence) {
        sentences.push(sentence);
      }
      start = i + 1;
    }
  }
  if (start < text.length) {
    let sentence = text.slice(start).trim();
    if (sentence) {
      sentences.push(sentence);
    }
  }
  return sentences;
};

export default TranslateBox;
