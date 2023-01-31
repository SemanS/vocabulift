import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Pagination } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import styles from "./index.module.less";
import classNames from "classnames";
import React from "react";
import TranslateBox from "./components/TranslateBox/TranslateBox";

const BookDetail: FC = () => {
  const [clickedWord, setClickedWord] = useState<string>("");
  const [clickedWords, setClickedWords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState<"word" | "sentence">("word");

  const handleClick = (word: string) => {
    if (!clickedWords.includes(word)) {
      setClickedWords([...clickedWords, word]);
      setClickedWord(word);
    }
  };

  const [texts, setTexts] = useState([
    "Text 1",
    "Text 2",
    "Text 3",
    "Text 4",
    "Text 5",
  ]);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textsPerPage = 1;
  const totalPages = texts.length / textsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentTextIndex((page - 1) * textsPerPage);
    setCurrentPage(page);
  };

  const indexOfLastText = currentPage * textsPerPage;
  const indexOfFirstText = indexOfLastText - textsPerPage;
  const currentText = texts.slice(indexOfFirstText, indexOfLastText);

  const { title } = useParams<{ title: string }>();

  return (
    <PageContainer>
      <Row>
        <Col span={18}>
          <Card className={classNames(styles.translateBoxMargin)}>
            <TranslateBox
              text={texts[currentTextIndex]}
              onClick={handleClick}
            />{" "}
            <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={totalPages}
              pageSize={1}
            />
          </Card>
        </Col>
        <Col span={6}>
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
          <Card
            title="Clicked Word"
            className={classNames(styles.clickedWordCard)}
          >
            <div>{clickedWord && <p>{clickedWord}</p>}</div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
