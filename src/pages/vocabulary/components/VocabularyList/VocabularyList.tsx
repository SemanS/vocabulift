import React, { useState } from "react";

interface VocabularyProps {
  word: string;
}

const VocabularyList: React.FC<VocabularyProps> = ({ word }) => {
  const [vocabulary, setVocabulary] = useState<string[]>([]); //initialize an empty array for vocabulary

  const handleSaveWord = () => {
    setVocabulary([...vocabulary, word]); // add word to vocabulary
  };

  return (
    <div>
      <button onClick={handleSaveWord}>Save to vocabulary</button>
      <ul>
        {vocabulary.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  );
};

export default VocabularyList;
