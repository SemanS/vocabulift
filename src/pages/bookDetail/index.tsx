import { FC, useState, useEffect } from "react";
import { Card, Row, Col, Pagination, PaginationProps, Typography } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
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
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [texts_en, setTextsEn] = useState<string[]>([]);
  const [texts_cz, setTextsCz] = useState<string[]>([]);
  const [texts_sk, setTextsSk] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);

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
        setTextsSk(
          data.sentences.map(
            (words_sk: { content_sk_sentences: any }) =>
              words_sk.content_sk_sentences
          )
        );
        setTotalSentences(data.totalSentences);
        setLoading(false);
      };

      fetchDataAndUpdateState();
    }
  }, []);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      setLoading(true);
      const data = await fetchData(sentenceFrom);
      setTextsEn(data.sentences.map((s: { content_en: any }) => s.content_en));
      setTextsCz(data.sentences.map((s: { content_cz: any }) => s.content_cz));
      setTextsSk(
        data.sentences.map(
          (s: { content_sk_sentences: any }) => s.content_sk_sentences
        )
      );
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
      <Row gutter={[16, 16]}>
        <Col span={clickedWords.length == 0 ? 24 : 18}>
          <Card>
            <TranslateBox
              text_en={texts_en
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_en.length,
                  (currentTextIndex % texts_en.length) + sentencesPerPage
                )
                .join(" ")}
              text_cz={texts_cz
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_cz.length,
                  (currentTextIndex % texts_cz.length) + sentencesPerPage
                )
                .join(" ")}
              text_sk={texts_sk
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
        {clickedWords.length != 0 && (
          <>
            <Col span={6}>
              <Card title="Translate List">
                <ul>
                  {clickedWords.map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
                </ul>
              </Card>
            </Col>
            <Col span={18}>
              {/* <Card
                title={
                  <span>
                    <span style={{ fontWeight: "normal" }}>
                      Definitions of:{" "}
                    </span>
                    <strong style={{ fontWeight: "bold" }}>
                      {clickedWord}
                    </strong>
                  </span>
                }
                extra={[
                  <audio ref={audioRef} src={phonetics[0].audio} />,
                  <CaretRightOutlined onClick={togglePlay} />,
                ]}
              >
                <List
                  grid={{ gutter: 0, column: 1 }}
                  dataSource={meanings}
                  renderItem={({ partOfSpeech, definitions }) => (
                    <List.Item>
                      {definitions.map(
                        ({ definition, example, synonyms, antonyms }) => (
                          <>
                            <div>
                              <Typography.Text strong>
                                {partOfSpeech}
                              </Typography.Text>
                              <Typography.Text>: {definition}</Typography.Text>
                            </div>
                            <div>
                              <Typography.Text italic>
                                Example: {example}
                              </Typography.Text>
                            </div>
                          </>
                        )
                      )}
                    </List.Item>
                  )}
                />
              </Card> */}
            </Col>
          </>
        )}
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
