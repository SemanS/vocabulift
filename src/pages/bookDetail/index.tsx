import { FC, useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  PaginationProps,
  Space,
  Typography,
  List,
} from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import styles from "./index.module.less";
import classNames from "classnames";
import React from "react";
import TranslateBox from "./components/TranslateBox/TranslateBox";

const { Meta } = Card;
const { Text } = Typography;

const BookDetail: FC = () => {
  const [clickedWord, setClickedWord] = useState<string>("");
  const [clickedWords, setClickedWords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalSentences, setTotalSentences] = useState(0);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [isPageFetched, setIsPageFetched] = useState(false);
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [texts_en, setTextsEn] = useState([]);
  const [texts_cz, setTextsCz] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      setLoading(true);
      const data = await fetchData(sentenceFrom);
      setTextsEn(data.sentences.map((s: { content_en: any }) => s.content_en));
      setTextsCz(data.sentences.map((s: { content_cz: any }) => s.content_cz));
      setTotalSentences(data.totalSentences);
      setLoading(false);
    };

    if (
      sentenceFrom + countOfSentences < currentPage * sentencesPerPage ||
      currentPage * sentencesPerPage > sentenceFrom + countOfSentences ||
      currentPage * sentencesPerPage < sentenceFrom
    ) {
      let localSentenceFrom = (currentPage - 1) * sentencesPerPage + 1;
      setSentenceFrom(localSentenceFrom);
      fetchDataAndUpdateState();
    }
  }, [currentPage, sentencesPerPage]);

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

  const handlePageChange = (page: number) => {
    setCurrentTextIndex((page - 1) * sentencesPerPage);
    setCurrentPage(page);
  };

  const fetchData = async (localSentenceFrom: number) => {
    setLoading(true);
    console.log("moja" + sentenceFrom);
    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/sentence/The Adventures of Huckleberry Finn?sentenceFrom=${
        localSentenceFrom ? localSentenceFrom : sentenceFrom
      }&countOfSentences=${countOfSentences}`,
      {
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (sentenceFrom == 1) {
      const fetchDataAndUpdateState = async () => {
        setLoading(true);
        const data = await fetchData(sentenceFrom);
        setTextsEn(
          data.sentences.map(
            (sentence_en: { content_en: any }) => sentence_en.content_en
          )
        );
        setTextsCz(
          data.sentences.map(
            (sentence_cz: { content_cz: any }) => sentence_cz.content_cz
          )
        );
        setTotalSentences(data.totalSentences);
        setLoading(false);
      };

      fetchDataAndUpdateState();
    }
  }, []);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {};
  }, []);

  const wordData = {
    word: "hello",
    phonetic: "həˈləʊ",
    phonetics: [
      {
        text: "həˈləʊ",
        audio:
          "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
      },
      {
        text: "hɛˈləʊ",
      },
    ],
    origin: "early 19th century: variant of earlier hollo ; related to holla.",
    meanings: [
      {
        partOfSpeech: "exclamation",
        definitions: [
          {
            definition: "used as a greeting or to begin a phone conversation.",
            example: "hello there, Katie!",
            synonyms: [],
            antonyms: [],
          },
        ],
      },
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "an utterance of ‘hello’; a greeting.",
            example: "she was getting polite nods and hellos from people",
            synonyms: [],
            antonyms: [],
          },
        ],
      },
      {
        partOfSpeech: "verb",
        definitions: [
          {
            definition: "say or shout ‘hello’.",
            example: "I pressed the phone button and helloed",
            synonyms: [],
            antonyms: [],
          },
        ],
      },
    ],
  };

  const { word, phonetic, phonetics, origin, meanings } = wordData;

  return (
    <PageContainer loading={loading}>
      <Row>
        <Col span={18}>
          <Card className={classNames(styles.translateBoxMargin)}>
            <TranslateBox
              text_en={texts_en
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_en.length,
                  (currentTextIndex % texts_en.length) + sentencesPerPage
                )
                .join(" ")}
              text_cz={texts_cz
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_en.length,
                  (currentTextIndex % texts_en.length) + sentencesPerPage
                )
                .join(" ")}
              onClick={handleClick}
            />
            <Pagination
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
              current={currentPage}
              onChange={handlePageChange}
              total={totalSentences}
              onShowSizeChange={onShowSizeChange}
              pageSize={sentencesPerPage}
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
            title={clickedWord}
            className={classNames(styles.clickedWordCard)}
          ></Card>
          <Card
            style={{ width: "100%" }}
            actions={[
              <audio controls>
                <source src={phonetics[0].audio} type="audio/mpeg" />
              </audio>,
            ]}
          >
            <Meta
              title={word}
              description={
                <Row>
                  <Col span={12}>
                    <Text strong>Phonetic:</Text>
                    <Text>{phonetic}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Phonetics:</Text>
                    {phonetics.map(({ text }, index) => (
                      <Text key={index}>{text}</Text>
                    ))}
                  </Col>
                </Row>
              }
            />
            <br />
            <Text strong>Origin:</Text>
            <Text>{origin}</Text>
            <br />
            <Text strong>Meanings:</Text>
            <List
              dataSource={meanings}
              renderItem={({ partOfSpeech, definitions }) => (
                <List.Item>
                  <Typography.Text strong>{partOfSpeech}:</Typography.Text>
                  <List
                    dataSource={definitions}
                    renderItem={({
                      definition,
                      example,
                      synonyms,
                      antonyms,
                    }) => (
                      <List.Item>
                        <Text>Definition: {definition}</Text>
                        <Text>Example: {example}</Text>
                        <Text>Synonyms: {synonyms.join(", ")}</Text>
                        <Text>Antonyms: {antonyms.join(", ")}</Text>
                      </List.Item>
                    )}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
