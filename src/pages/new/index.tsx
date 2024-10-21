import { PageContainer } from "@ant-design/pro-layout";
import TranslateBox from "@/pages/bookDetail/components/TranslateBox/TranslateBox";
import { menuLanguageState } from "@/stores/language";
import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { parseLocale } from "@/utils/stringUtils";
const { Title } = Typography;
import styles from "./index.module.less";
import { getSnapshots } from "@/services/newService";
import { ArrowUpOutlined } from "@ant-design/icons";
import CustomSpinnerComponent from "@/pages/spinner/CustomSpinnerComponent";
import { SvgIcon } from "@/pages/webLayout/shared/common/SvgIcon";
import { getFlagCode } from "@/utils/utilMethods";

const CenteredDiv = styled.div<{ centered: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  align-items: center;
  justify-content: ${(props) => (props.centered ? "center" : "flex-start")};
  height: ${(props) => (props.centered ? "60vh" : "auto")};
  padding-top: ${(props) => (props.centered ? "0" : "20px")};
  transition: all 0.6s ease-in-out;
`;

const LanguageSelect = styled(Select)`
  width: 100px;

  .ant-select-selector {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background-color: transparent;
  margin-right: 5px;
  transition: background-color 0.3s, box-shadow 0.3s;
  padding: 4px 8px; /* Increased horizontal padding */

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  box-shadow: 0px 1px 6px rgba(32, 33, 36, 0.28);
  width: 600px;
  height: 44px;
  overflow: hidden;

  input {
    flex-grow: 1;
    height: 100%;
    border: none;
    padding: 0 16px;
    font-size: 16px;
    outline: none;
    box-shadow: none;
    border-radius: 0;
  }

  &:hover,
  &:focus-within {
    border-color: #a0a0a0;
  }
`;

const HintText = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
  text-align: center;
`;

const { Option } = Select;

const New: React.FC = () => {
  const PartsOfSpeechWrapper = styled.div`
    /* left: 50%; */
    /* bottom: 24px; */

    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    gap: 8px;
    margin-bottom: 24px;

    @media (max-width: 500px) {
      width: calc(100% - 16px);
      max-width: 450px;
    }

    @media (min-width: 501px) and (max-width: 768px) {
      width: calc(90% - 16px);
      max-width: 650px;
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      width: calc(80% - 16px);
      max-width: 850px;
    }

    @media (min-width: 1025px) {
      /* width: calc(70% - 16px);
      max-width: 1000px; */
    }
  `;

  const spacing = ({ menu }) => (
    <div style={{ marginLeft: "-15px" }}>{menu}</div>
  );

  const partsOfSpeech = [
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "conjunction",
  ];

  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("noun");
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const snapshotsData = await getSnapshots("en", "sk", inputValue);
      setSnapshots(snapshotsData);
    } catch (error) {
      console.error("Error fetching snapshots:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedLanguageTo = useRecoilValue(menuLanguageState);

  const handleButtonClick = (part) => {
    setSelectedTag((prevSelectedTag) => {
      const newTag = part === prevSelectedTag ? "" : part;
      return newTag;
    });
  };
  const dropdownAlign = {
    points: ["tl", "bl"], // aligns the top-left of the dropdown with the bottom-left of the select
    offset: [-5, 15], // moves the dropdown 15px to the left and 10px down
  };
  return (
    <PageContainer title={false}>
      <CenteredDiv centered={!snapshots.length}>
        <HintText>
          Type a description or scenario to generate exercise sentences (e.g.,
          "Describe a daily routine").
        </HintText>

        <StyledInputContainer>
          <LanguageSelect
            defaultValue={selectedLanguage}
            onChange={handleLanguageChange}
            dropdownAlign={dropdownAlign}
            dropdownStyle={{ width: "80px" }} // Squeeze width by 10px
          >
            <Option value="en">
              <SvgIcon
                className={styles.flag}
                code={getFlagCode("en")}
                height="34"
                width="42"
              />
            </Option>
            <Option value="es">
              <SvgIcon
                className={styles.flag}
                code={getFlagCode("es")}
                height="34"
                width="42"
              />
            </Option>
            <Option value="fr">
              <SvgIcon
                className={styles.flag}
                code={getFlagCode("sk")}
                height="34"
                width="42"
              />
            </Option>
          </LanguageSelect>

          <input
            type="text"
            placeholder="Type something..."
            value={inputValue}
            onChange={handleInputChange}
          />

          <SubmitButton
            onClick={handleSubmit}
            disabled={!inputValue || loading}
          >
            {loading ? (
              <CustomSpinnerComponent
                spinning={true}
                myStyle={{ width: "20px", height: "20px" }}
              />
            ) : (
              <ArrowUpOutlined style={{ fontSize: "16px", color: "#000" }} />
            )}
          </SubmitButton>
        </StyledInputContainer>
      </CenteredDiv>

      <Row>
        <Col xs={0} sm={0} md={4} lg={4} xl={4} />
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          {snapshots.length > 0 && (
            <PartsOfSpeechWrapper>
              {partsOfSpeech.map((part, index) => (
                <Button
                  onClick={() => handleButtonClick(part)}
                  style={{
                    display: "inline-block",
                    backgroundColor: selectedTag === part ? "tomato" : "white",
                    color: selectedTag === part ? "white" : "black",
                    borderRadius: "15px",
                    border: "1px solid #d9d9d9",
                    //margin: "0",
                    minWidth: "80px",
                  }}
                >
                  {part.charAt(0).toUpperCase() + part.slice(1)}
                </Button>
              ))}
            </PartsOfSpeechWrapper>
          )}
          {snapshots.length > 0 && (
            <Card
              loading={loading}
              className={styles.translateBoxScroll}
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                paddingTop: "20px",
                width: "100%",
              }}
            >
              {!loading && (
                <TranslateBox
                  sourceLanguage={"en"}
                  currentTextIndex={0}
                  sentenceFrom={1}
                  sentencesPerPage={10}
                  currentPage={1}
                  libraryTitle={inputValue}
                  mode={"all"}
                  snapshots={snapshots}
                  userSentences={[]}
                  onAddUserPhrase={() => {}}
                  vocabularyListUserPhrases={[]}
                  highlightedSentenceIndex={null}
                  highlightedWordIndex={0}
                  selectedLanguageTo={parseLocale(selectedLanguageTo)}
                  onChangeMode={() => {}}
                  magnifyingGlassRef={undefined}
                  addSteps={() => {}}
                  partOfSpeech={selectedTag ? [selectedTag] : []}
                  isTenseVisible={true}
                  isLanding={true}
                />
              )}
            </Card>
          )}
        </Col>
        <Col xs={0} sm={0} md={4} lg={4} xl={4} />
      </Row>
    </PageContainer>
  );
};

export default New;
