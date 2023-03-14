import { FC, useState, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  PaginationProps,
  Typography,
  Switch,
  List,
} from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import React from "react";
import TranslateBox from "./components/TranslateBox/TranslateBox";
import { CaretRightOutlined } from "@ant-design/icons";
import { WordData } from "@models/word.interface";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";

const { Text } = Typography;

const BookDetail: FC = () => {
  const [clickedWord, setClickedWord] = useState<string>();
  const [clickedWords, setClickedWords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalSentences, setTotalSentences] = useState(0);
  const [sentenceFrom, setSentenceFrom] = useState(1);
  const [countOfSentences, setCountOfSentences] = useState(100);
  const [texts_en, setTextsEn] = useState<
    { text: string; sentence_no: number }[]
  >([]);
  const [texts_cz, setTextsCz] = useState<
    { text: string; sentence_no: number }[]
  >([]);
  const [texts_sk, setTextsSk] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [sentencesPerPage, setSentencesPerPage] = useState(10);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mode, setMode] = useState<"word" | "sentence">("word");
  const [wordData, setWordData] = useState<WordData>();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (sentenceFrom == 1) {
      const fetchDataAndUpdateState = async () => {
        setLoading(true);
        const data = await fetchData(sentenceFrom);
        console.log(data);
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
    if (
      sentenceFrom + countOfSentences < currentPage * sentencesPerPage ||
      currentPage * sentencesPerPage > sentenceFrom + countOfSentences ||
      currentPage * sentencesPerPage < sentenceFrom
    ) {
      let localSentenceFrom = (currentPage - 1) * sentencesPerPage + 1;
      setSentenceFrom(getRangeNumber(localSentenceFrom));
      console.log("to je one" + getRangeNumber(localSentenceFrom));
      //fetchDataAndUpdateState();
    }
  }, [currentPage, sentencesPerPage]);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      setLoading(true);
      const data = await fetchData(sentenceFrom);
      setTextsEn(
        data.sentences.map((s: { content_en: any; sentence_no: any }) => {
          return { text: s.content_en, sentence_no: s.sentence_no };
        })
      );
      setTextsCz(
        data.sentences.map((s: { content_cz: any; sentence_no: any }) => {
          return { text: s.content_cz, sentence_no: s.sentence_no };
        })
      );
      setTextsSk(
        data.sentences.map(
          (s: { content_sk_sentences: any }) => s.content_sk_sentences
        )
      );
      setTotalSentences(data.totalSentences);
      setLoading(false);
    };

    fetchDataAndUpdateState();
  }, [sentenceFrom]);

  const handleClick = (word: string) => {
    if (!clickedWords.includes(word) && mode == "word") {
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

  function getRangeNumber(num: number) {
    if (num <= 100) {
      return 1;
    } else {
      const base = Math.floor((num - 1) / 100) * 100 + 1;
      return base;
    }
  }

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
    if (clickedWord) {
      // Fetch word details from public API
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clickedWord}`)
        .then((response) => response.json())
        .then((data) => setWordData(data[0]))
        .catch((error) => console.error(error));
      // Make POST on backend to save word under user
      fetch(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/add-word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          language: "en",
          word: clickedWord,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  }, [clickedWord]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <PageContainer loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={clickedWords.length == 0 ? 24 : 18}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Switch
                checked={mode === "sentence"}
                onChange={() => setMode(mode === "word" ? "sentence" : "word")}
              />
              Translate by word or sentence
            </div>
            <TranslateBox
              mode={mode}
              text_en={texts_en
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_en.length,
                  (currentTextIndex % texts_en.length) + sentencesPerPage
                )
                .map((textObj) => ({
                  text: textObj.text,
                  sentence_no: textObj.sentence_no,
                }))}
              text_cz={texts_cz
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_cz.length,
                  (currentTextIndex % texts_cz.length) + sentencesPerPage
                )
                .map((textObj) => ({
                  text: textObj.text,
                  sentence_no: textObj.sentence_no,
                }))}
              text_sk={texts_sk
                .slice(
                  (currentTextIndex + sentenceFrom - 1) % texts_en.length,
                  (currentTextIndex % texts_en.length) + sentencesPerPage
                )
                .join(" ")}
              onClick={handleClick}
            />
            {/* {currentTextIndex + "\n"}
            {sentenceFrom + "\n"}
            {texts_en.length + "\n"}
            {sentencesPerPage + "\n"}
            {((currentTextIndex + sentenceFrom - 1) % texts_en.length) + "\n"}
            {(currentTextIndex % texts_en.length) + sentencesPerPage + "\n"} */}
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
              <Card>
                <List
                  size="small"
                  header={
                    <div>
                      <strong>Vocabulary</strong>
                    </div>
                  }
                  dataSource={clickedWords}
                  renderItem={(word, index) => <List.Item>{word}</List.Item>}
                />
              </Card>
            </Col>
            <Col span={18}>
              <Card
                title={
                  <span>
                    <span style={{ fontWeight: "normal" }}>
                      Definitions of:{" "}
                    </span>
                    <strong style={{ fontWeight: "bold" }}>
                      {wordData?.word}
                    </strong>
                  </span>
                }
                extra={[
                  <Text>{wordData?.phonetics[0].text} </Text>,
                  <audio ref={audioRef} src={wordData?.phonetics[0].audio} />,
                  <CaretRightOutlined onClick={togglePlay} />,
                ]}
              >
                <List
                  grid={{ gutter: 0, column: 1 }}
                  dataSource={wordData?.meanings}
                  renderItem={({ partOfSpeech, definitions }, index) => (
                    <List.Item key={index}>
                      {definitions.map((definition, subIndex) => (
                        <>
                          <div key={`${index}-${subIndex}`}>
                            <Typography.Text strong>
                              {partOfSpeech}
                            </Typography.Text>
                            <Typography.Text>
                              : {definition.definition}
                            </Typography.Text>
                          </div>
                          {definition.example ? (
                            <div key={`example-${index}-${subIndex}`}>
                              <Typography.Text italic>
                                Example: {definition.example}
                              </Typography.Text>
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      ))}
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </>
        )}
      </Row>
    </PageContainer>
  );
};

export default BookDetail;
