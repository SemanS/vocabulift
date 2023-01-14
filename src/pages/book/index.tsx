import TranslateBox from "@/components/TranslateBox/TranslateBox";
import { PageContainer } from "@ant-design/pro-layout";
import { Card, Row, Col } from "antd";

export default function Book() {
    const [clickedWords, setClickedWords] = useState<string[]>([]); // added state to keep track of clicked words
    const text = "This is some text to be translated";
    const translations = ["Translation 1","Translation 2","Translation 3","Translation 4","Translation 5","Translation 6","Translation 7"];

    const handleClick = (word: string) => {
        setClickedWords([...clickedWords, word]);
    }

    return (
        <PageContainer>
            <Row>
                <Col span={12}>
                    <Card>
                        <TranslateBox text={text} translations={translations} onClick={handleClick} />
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
        </PageContainer>
    )
}