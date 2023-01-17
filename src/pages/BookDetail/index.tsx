import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col } from 'antd';
import classNames from 'classnames'
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import TranslateBox from '@/components/TranslateBox/TranslateBox';

import styles from "./index.module.less"



interface BookDetailProps {}

const BookDetail: React.FC<BookDetailProps> = () => {
    const [clickedWord, setClickedWord] = useState<string>("");
    const [clickedWords, setClickedWords] = useState<string[]>([]); // added state to keep track of clicked words
    const text = "A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way. Either way, they differ stylistically from a long poem in that there tends to be more care in word choice. Since there are fewer words people tend to spend more time on choosing a word that fits the subject to perfection. Because of this meticulous attitude, writing a short poem is often more tedious than writing a long poem.";

    const handleClick = (word: string) => {
        if(!clickedWords.includes(word)){
            setClickedWords([...clickedWords, word]);
            setClickedWord(word);
        }
    }

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
