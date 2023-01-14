import { Switch } from 'antd';
import { useState, useEffect } from 'react';

import TranslateWord from '../TranslateWord/TranslateWord';

interface TranslateBoxProps {
  text: string;
}

const TranslateBox: React.FC<TranslateBoxProps> = ({text}) => {
    const [translations, setTranslations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [mode, setMode] = useState<'word' | 'sentence'>('word'); // initial mode is 'word'
    const [clickedWords, setClickedWords] = useState<string[]>([]);
  
    const handleWordClick = (word: string) => {
      if(!clickedWords.includes(word)){
          setClickedWords([...clickedWords, word]);
      }
  }

  const dummyFetch = async (text: string, mode: 'word' | 'sentence') => {
    return {
        translations: mode === 'word' ? 
            text.split(" ").map((word) => `${word}_translated`) : 
            [`${text}_translated`]
    };
};
useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          let data
          if(mode === "word"){
            data = await dummyFetch(text,'word');
        }else{
            data = await dummyFetch(text,'sentence');
        }
          setTranslations(data.translations);
        } catch (err) {
          setError(err);
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
  
    const words = mode === 'word' ? text.split(" ") : [text]; 
    return (
      <>
            <div style={{ marginBottom: 16 }}>
                <Switch
                    checked={mode === 'sentence'}
                    onChange={() => setMode(mode === 'word' ? 'sentence' : 'word')}
                />
                <span style={{ marginLeft: 8 }}>
                    {mode === 'word' ? 'Translate words' : 'Translate sentence'}
                </span>
            </div>
            <div className="translate-box">
                {words.map((word, index) => (
                    <TranslateWord key={word} word={word} translation={translations[index]} onClick={handleWordClick} />
                ))}
            </div>
            <div className="clicked-words-list">
            Clicked Words:
            <ul>
                {clickedWords.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>
        </div>
</>
    );
  };

export default TranslateBox
