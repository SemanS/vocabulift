import { Row, Col, Button as AntdButton, Card, Radio } from "antd";
import { IContentBlockProps } from "../types";
import { Fade } from "react-awesome-reveal";
import { RightBlockContainer } from "./styles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleUrl } from "@/utils/getGoogleUrl";
import { ReactComponent as GoogleIcon } from "@/assets/logo/google_icon.svg";
import { useWindowWidth } from "@/utils/useWindowWidth";
import TranslateBox from "@/pages/bookDetail/components/TranslateBox/TranslateBox";
import EmbeddedVideo from "@/pages/bookDetail/components/EmbeddedVideo/EmbeddedVideo";
import * as Slider from "@radix-ui/react-slider";
import { useRecoilValue } from "recoil";
import { menuLanguageState } from "@/stores/language";
import snapshotDataSk from "./../../../../../../data/snapshot_sk.json";
import snapshotDataEs from "./../../../../../../data/snapshot_es.json";
import snapshotDataEn from "./../../../../../../data/snapshot_en.json";
import snapshotDataFr from "./../../../../../../data/snapshot_fr.json";
import snapshotDataDe from "./../../../../../../data/snapshot_de.json";
import snapshotDataCs from "./../../../../../../data/snapshot_cs.json";
import snapshotDataPl from "./../../../../../../data/snapshot_pl.json";
import snapshotDataHu from "./../../../../../../data/snapshot_hu.json";
import snapshotDataIt from "./../../../../../../data/snapshot_it.json";
import snapshotDataZh from "./../../../../../../data/snapshot_zh.json";
import snapshotDataUk from "./../../../../../../data/snapshot_uk.json";
import { parseLocale } from "@/utils/stringUtils";
import { postPauseNotified } from "@/services/libraryService";

const RightBlock = ({
  title,
  content,
  button,
  icon,
  id,
  className,
}: IContentBlockProps) => {
  const navigate = useNavigate();

  const [fadeVisible, setFadeVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    setFadeVisible(true);
  }, []);

  const from = "/library";

  const width = useWindowWidth(); // use custom hook to get window width

  const library = {
    _id: "663fa74f3c6d43f7c0126d4f",
    createdAt: "2024-05-11T17:13:51.515Z",
    updatedAt: "2024-05-11T17:15:15.713Z",
    title: "Is technology making life better or worse?",
    label: "video",
    visibility: "public",
    description:
      "The text explores the impact of technology on society, questioning whether it brings people together or drives them apart. It delves into the potential consequences of misinformation, sedentary lifestyles, and increased distractions caused by technology. The author encourages readers to consider both the benefits and drawbacks of technology in order to determine whether it ultimately improves or worsens life on earth.",
    category: "Science & Technology",
    level: ["A1", "A2", "B1", "B2", "C1"],
    videoId: "7rbDIx69ORE",
    videoThumbnail: "https://i.ytimg.com/vi/7rbDIx69ORE/mqdefault.jpg",
    sourceLanguage: "en",
    targetLanguages: [
      "",
      "es",
      "sk",
      "de",
      "fr",
      "cs",
      "pl",
      "hu",
      "it",
      "zh",
      "uk",
    ],
    eventId: "",
    snapshotsInfo: [
      {
        snapshotId: "663fa7543c6d43f7c0126d69",
        language: "en",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7543c6d43f7c0126d6a",
        language: "es",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa77c3c6d43f7c0126d84",
        language: "sk",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7813c6d43f7c0126d9b",
        language: "de",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7863c6d43f7c0126db2",
        language: "fr",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa78b3c6d43f7c0126dc9",
        language: "cs",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7903c6d43f7c0126de0",
        language: "pl",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7953c6d43f7c0126df7",
        language: "hu",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7993c6d43f7c0126e0e",
        language: "it",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa79e3c6d43f7c0126e25",
        language: "zh",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
      {
        snapshotId: "663fa7a33c6d43f7c0126e3c",
        language: "uk",
        start: 0.88,
        end: 58.215,
        sentenceFrom: 1,
      },
    ],
    duration: 68,
    worksheet: "sourceForWorksheet",
    transcript:
      "Technology is changing our world. Our devices allow us to do things that were previous unimaginable. But is that a good thing? Do our devices bring us together or are they separating us? Likely to believe misinformation? We know that new technology helps save lives, but what about the health risks from being so sedentary? Are we more distracted or are we more engaged? What are the effects of adding metrics to our social interactions? And what does it mean that you can publish anywhere at any time and share your voice with the world? Explore the pros and cons of technology and defend whether it's making life better or worse here on earth. Be sure to include facts and deep analysis.",
    questions: [
      "In what ways has technology changed our world?",
      "What activities can we perform now thanks to technological devices that were previously unimaginable?",
      "What arguments can support the notion that technology is positive/negative for our social interactions?",
      "How can technology contribute to misinformation?",
      "In what ways does technology help save lives and how can it pose health risks?",
      "Can our heavy use of technology make us more sedentary and what are the potential health risks connected to a sedentary lifestyle?",
      "What effects can adding metrics to our social interactions cause?",
      "How has the ability to publish anywhere at any time and share your voice with the world transformed our society?",
      "Can we truly say whether technology is making life better or worse here on earth? If so, on what grounds? If not, why not?",
      "How can we incorporate thorough research and deep analysis into our evaluations of technology's impact on life on earth?",
    ],
  };

  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (isPlaying && !emailSent) {
      //postPauseNotified();
      setEmailSent(true);
    }
  }, [isPlaying, emailSent]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      videoPlayerRef.current.pauseVideo();
    } else {
      videoPlayerRef.current.playVideo();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const videoPlayerRef = useRef<ExposedFunctions | null>(null);

  const [highlightedSubtitleIndex, setHighlightedSubtitleIndex] = useState<
    number | null
  >(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<
    number | null
  >(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const partsOfSpeech = [
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "conjunction",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoPlayerRef.current && videoPlayerRef.current.getCurrentTime) {
        const newTime = videoPlayerRef.current.getCurrentTime();
        setCurrentTime(newTime); // This updates the slider position indirectly
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [videoPlayerRef]);

  const handleSliderChange = (value) => {
    const newTime = parseFloat(value[0]);
    setCurrentTime(newTime); // You might want to avoid this if it's directly controlled by user input
    if (videoPlayerRef.current && videoPlayerRef.current.seekTo) {
      videoPlayerRef.current.seekTo(newTime, true);
      videoPlayerRef.current.updateHighlightedSubtitleAndPage(newTime);
    }
  };
  const [selectedTag, setSelectedTag] = useState<string>("");

  const handleButtonClick = (part) => {
    setSelectedTag((prevSelectedTag) => {
      const newTag = part === prevSelectedTag ? "" : part;
      return newTag;
    });
  };

  const getSnapshotDataArray = (language) => {
    const parsedLanguage = parseLocale(language);
    let snapshots = [];

    switch (parsedLanguage) {
      case "sk":
        snapshots.push(snapshotDataSk);
        break;
      case "es":
        snapshots.push(snapshotDataEs);
        break;
      case "fr":
        snapshots.push(snapshotDataFr);
        break;
      case "de":
        snapshots.push(snapshotDataDe);
        break;
      case "cs":
        snapshots.push(snapshotDataCs);
        break;
      case "pl":
        snapshots.push(snapshotDataPl);
        break;
      case "hu":
        snapshots.push(snapshotDataHu);
        break;
      case "it":
        snapshots.push(snapshotDataIt);
        break;
      case "zh":
        snapshots.push(snapshotDataZh);
        break;
      case "uk":
        snapshots.push(snapshotDataUk);
        break;
      case "en":
        snapshots.push(snapshotDataEn);
        break;
      default:
        snapshots.push({}); // Add an empty object or default data if language is not supported
        break;
    }

    // You can add more snapshot data to the array if needed here
    // For example, adding English snapshot data universally or conditionally:
    if (parsedLanguage !== "en") {
      // Conditionally add if not English
      snapshots.push(snapshotDataEn);
    }

    return snapshots;
  };

  const selectedLanguageTo = useRecoilValue(menuLanguageState);
  const snapshots = getSnapshotDataArray(selectedLanguageTo);

  return (
    <RightBlockContainer>
      <Fade direction="right" triggerOnce>
        <Row
          justify="center"
          align="middle"
          id={id}
          className={fadeVisible ? styles.visible : styles.notVisible}
        >
          <Row>
            <Col>
              <Radio.Group
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                  borderRadius: "15px",
                  width: "auto",
                  marginRight: "20px",
                  marginLeft: "25px",
                }}
                size="large"
                className={`${styles.play}`}
              >
                <Radio.Button
                  style={{
                    pointerEvents: "none",
                    borderTopLeftRadius: "15px",
                    borderBottomLeftRadius: "15px",
                    width: "65px",
                    border: "none",
                    color: "black",
                  }}
                >
                  <span style={{ marginLeft: "-3px" }}>
                    {formatTime(Math.floor(currentTime))}
                  </span>
                </Radio.Button>
                <Radio.Button
                  value={isPlaying}
                  onChange={handlePlayPause}
                  style={{
                    borderTopRightRadius: "15px",
                    borderBottomRightRadius: "15px",
                    backgroundColor: "tomato",
                    color: "white",
                    border: "none",
                  }}
                >
                  {isPlaying ? <span>❚❚</span> : <span>▶</span>}
                </Radio.Button>
              </Radio.Group>
            </Col>
            <Col>
              <Radio.Group
                value={selectedTag}
                size="large"
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                  borderRadius: "15px",
                  width: "auto",
                  display: "inline-flex",
                  marginBottom: "20px",
                }}
                className={`${styles.play}`}
              >
                {partsOfSpeech.map((part, index) => (
                  <Radio.Button
                    key={part}
                    value={part}
                    onClick={() => handleButtonClick(part)} // Using onClick to force handling
                    style={{
                      pointerEvents: "auto",
                      borderRadius:
                        index === 0
                          ? "15px 0 0 15px"
                          : index === partsOfSpeech.length - 1
                          ? "0 15px 15px 0"
                          : "0",
                      minWidth: "80px",
                      border: "none",
                      backgroundColor:
                        selectedTag === part ? "tomato" : "white",
                      color: selectedTag === part ? "white" : "black",
                    }}
                  >
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={3} sm={3} md={3} lg={3} xl={3}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "75.4vh",
                }}
              >
                <Slider.Root
                  className={`${styles.sliderRoot}`}
                  value={[currentTime]}
                  onValueChange={handleSliderChange}
                  max={60}
                  orientation="vertical"
                  step={0.1}
                  style={{
                    marginTop: "50px",
                  }}
                  inverted={true}
                >
                  <Slider.Track className={`${styles.sliderTrack}`}>
                    <Slider.Range className={`${styles.sliderRange}`} />
                  </Slider.Track>
                  <Slider.Thumb
                    className={`${styles.sliderThumb}`}
                    aria-label="Volume"
                  />
                </Slider.Root>
              </div>
            </Col>
            <Col xs={21} sm={21} md={21} lg={21} xl={21}>
              <Card
                loading={false}
                className={styles.translateBoxScroll}
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                  paddingLeft: "40px",
                  paddingTop: "20px",
                  height: "100%",
                  width: "100%", // Use full width of the column
                  maxWidth: "1000px", // Max width set to 1000px
                }}
              >
                <TranslateBox
                  sourceLanguage={"en"}
                  currentTextIndex={currentTextIndex}
                  sentenceFrom={1}
                  sentencesPerPage={10}
                  currentPage={1}
                  libraryTitle={"ahoj"}
                  mode={"all"}
                  snapshots={snapshots}
                  userSentences={[]}
                  onAddUserPhrase={() => {}}
                  vocabularyListUserPhrases={[]}
                  highlightedSentenceIndex={highlightedSubtitleIndex}
                  highlightedWordIndex={highlightedWordIndex}
                  selectedLanguageTo={parseLocale(selectedLanguageTo)}
                  onChangeMode={() => {}}
                  magnifyingGlassRef={undefined}
                  addSteps={() => {}}
                  partOfSpeech={selectedTag ? [selectedTag] : []}
                  isTenseVisible={true}
                  isLanding={true}
                />
              </Card>
            </Col>
          </Row>
          <div style={{ visibility: "hidden", height: "0px", width: "0px" }}>
            <EmbeddedVideo
              ref={videoPlayerRef}
              onHighlightedSubtitleIndexChange={(index) => {
                index !== -1 && setHighlightedSubtitleIndex(index);
              }}
              onHighlightedWordIndexChange={setHighlightedWordIndex}
              sentencesPerPage={10}
              handlePageChange={() => {}}
              snapshots={snapshots}
              shouldSetVideo={false}
              setShouldSetVideo={() => {}}
              firstIndexAfterReset={null}
              setLoadingFromFetch={() => {}}
              onPlay={handlePlay}
              onPause={handlePause}
              libraryItem={library}
            />
          </div>
        </Row>
      </Fade>
    </RightBlockContainer>
  );
};
function formatTime(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return "00:00"; // Default format if the input is not a number
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad the minutes and seconds with leading zeros if they are less than 10
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

export default RightBlock;
