import { Card } from 'antd';
import React from 'react';

interface WordDetailProps {
    word: string;
    translation: string;
    examples: string[];
}

const WordDetail: React.FC<WordDetailProps> = ({ word, translation, examples }) => {
    return (
        <Card className="word-detail-card">
            <h1>{word}</h1>
            <h2>{translation}</h2>
            <h3>Examples:</h3>
            <ul>
                {examples.map((example, index) => (
                    <li key={index}>{example}</li>
                ))}
            </ul>
        </Card>
    );
}

export default WordDetail
