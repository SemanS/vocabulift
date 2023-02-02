import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Pagination, PaginationProps } from "antd";
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
  const [loading, setLoading] = useState(true);
  const [totalSentences, setTotalSentences] = useState(0);

  const sentenceFrom = 1;

  const handleClick = (word: string) => {
    if (!clickedWords.includes(word)) {
      setClickedWords([...clickedWords, word]);
      setClickedWord(word);
    }
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setSentencesPerPage(pageSize);
  };

  const [texts, setTexts] = useState([]);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentTextIndex((page - 1) * sentencesPerPage);
    setCurrentPage(page);
  };

  const indexOfLastText = currentPage * sentencesPerPage;
  const indexOfFirstText = indexOfLastText - sentencesPerPage;
  const currentText = texts.slice(indexOfFirstText, indexOfLastText);

  const { title } = useParams<{ title: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      //const { start, end } = useParams<{ start: string; end: string }>();
      const countOfSentences = 100;
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
        }/sentence/The Adventures of Huckleberry Finn?sentenceFrom=${sentenceFrom}&countOfSentences=${countOfSentences}`,
        {
          headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );

      /* await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/append-words`,
        {},
        {
          headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      ); */
      const data = await response.json();
      setLoading(true);
      setTexts(
        data.sentences.map((sentence: { content: any }) => sentence.content)
      );
      setTotalSentences(data.totalSentences);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {};
  }, []);

  return (
    <PageContainer loading={loading}>
      <Row>
        <Col span={18}>
          <Card className={classNames(styles.translateBoxMargin)}>
            <TranslateBox
              text={texts
                .slice(currentTextIndex, currentTextIndex + sentencesPerPage)
                .join(" ")}
              onClick={handleClick}
            />{" "}
            <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={totalSentences}
              onShowSizeChange={onShowSizeChange}
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
