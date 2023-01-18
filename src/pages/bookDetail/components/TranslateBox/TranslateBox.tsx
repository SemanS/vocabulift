import { useState, useEffect } from 'react';
import TranslateWord from "../TranslateWord/TranslateWord";
import { Switch } from "antd";
import React from 'react';

interface TranslateBoxProps {
  text: string;
  onClick: (word: string) => void;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({text, onClick}) => {
  const [translations, setTranslations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [mode, setMode] = useState<'word' | 'sentence'>('word'); // initial mode is 'word'
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
  const handleWordClick = (word: string) => {
      onClick(word);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data
        if(mode === "word"){
          data = text.split(" ");
        }else{
          data = text.match(/[^\.!?]+[\.!?]/g);
        }
        if(data) {
          setTranslations(data);
        } else {
          setTranslations([]);
        }
      } catch (err) {
        setError(err as Error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [text, mode]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
      <>
          <div style={{ marginBottom: 16 }}>
              <Switch
                  checked={mode === 'sentence'}
                  onChange={() => setMode(mode === 'word' ? 'sentence' : 'word')}
              />
              {' '}Translate by word or sentence
          </div>
          {translations.map((sentence, index) => (
                <TranslateWord key={index} word={sentence} translation={translations[index]} onClick={handleWordClick} />
                ))}
      </>
  );
}

export default TranslateBox;