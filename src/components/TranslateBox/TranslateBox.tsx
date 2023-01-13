import { PageContainer } from '@ant-design/pro-layout';
import { Switch } from 'antd';
import { useState, useEffect } from 'react';
import { Tooltip } from "react-tippy";

interface TranslateWordProps {
  word: string;
  translation: string;
}

const TranslateWord: React.FC<TranslateWordProps> = ({ word, translation }) => {
    const handleClick = useCallback(async () => {
      // Perform POST request here. For example, using the fetch API:
      try {
        const response = await fetch(`https://your-api-endpoint.com/translate`, {
          method: 'POST',
          body: JSON.stringify({ word }),
          headers: { 'Content-Type': 'application/json' },
        });
        // Handle the response
      } catch (error) {
        console.error(error);
      }
    }, [word]);
  
    return (
      <Tooltip title={translation} trigger="mouseenter">
        <span onClick={handleClick}>{word} </span>
      </Tooltip>
    );
  };

interface TranslateBoxProps {
  text: string;
  translations: string[];
}

const TranslateBox: React.FC<TranslateBoxProps> = ({text}) => {
    const [translations, setTranslations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('word'); // initial mode is 'word'
  
    const dummyFetch = async (text, mode) => {
        // This is an example of how the data might be structured in a real API response
        return {
            translations: mode === 'word' ? 
                text.split(" ").map((word) => `${word}_translated`) : 
                [`${text}_translated`]
        };
    };

    // useEffect can stay the same 
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          let data
          if(mode === "word"){
            //response = await fetch(`https://your-api-endpoint.com/translate?text=${text}&mode=word`);
            data = await dummyFetch(text,'word');
        }else{
            //response = await fetch(`https://your-api-endpoint.com/translate?text=${text}&mode=sentence`);
            data = await dummyFetch(text,'sentence');
        }
          //const data = await response.json();
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
  
    const words = mode === 'word' ? text.split(" ") : [text]; // split text by " " for translating words mode
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
                    <TranslateWord key={word} word={word} translation={translations[index]} />
                ))}
            </div>
</>
    );
  };

export default TranslateBox;
