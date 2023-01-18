import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import styles from "./index.module.less"
import classNames from 'classnames'
import React from 'react';
import TranslateBox from './components/TranslateBox/TranslateBox';


const BookDetail: FC = () => {
    const [clickedWord, setClickedWord] = useState<string>("");
    const [clickedWords, setClickedWords] = useState<string[]>([]); // added state to keep track of clicked words
    const text = "A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way. Either way, they differ stylistically from a long poem in that there tends to be more care in word choice. Since there are fewer words people tend to spend more time on choosing a word that fits the subject to perfection. Because of this meticulous attitude, writing a short poem is often more tedious than writing a long poem.";
    const translations = ["Translation 1","Translation 2","Translation 3","Translation 4","Translation 5","Translation 6","Translation 7"];

    const handleClick = (word: string) => {
        if(!clickedWords.includes(word)){
            setClickedWords([...clickedWords, word]);
            setClickedWord(word);
        }
    }

    const {title} = useParams<{ title: string }>();

    return (
        <PageContainer>
            <Row>
                <Col span={12}>
                    <Card>
                        <TranslateBox text={text} onClick={handleClick} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Translate List">
                        <div>Clicked Words:</div>
                        <ul>
                            {clickedWords.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card title="Clicked Word" className={classNames(styles.clickedWordCard)}>
                        <div>
                            {clickedWord && <p>{clickedWord}</p>}
                        </div>
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    )
}

export default BookDetail;
