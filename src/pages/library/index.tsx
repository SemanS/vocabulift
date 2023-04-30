import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Typography,
  Select,
  Tabs,
  Slider,
  Modal,
  Space,
  Divider,
} from "antd";

const { TabPane } = Tabs;

import { useRecoilState, useSetRecoilState } from "recoil";
import {
  getLibraryItems,
  postLibraryInputVideoLanguages,
  postLibraryVideo,
} from "@/services/libraryService";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./index.module.less";
import { BookFilled, PlusSquareFilled, YoutubeFilled } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import {
  libraryIdState,
  currentPageState,
  pageSizeState,
} from "@/stores/library";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { LabelType } from "@/models/sentences.interfaces";
import CustomSlider from "./components/CustomSlider";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";

interface Option {
  value: string;
  label: string;
}

interface ApiResponse {
  video: LibraryItem[];
  book: LibraryItem[];
  text: LibraryItem[];
  article: LibraryItem[];
}

const Library: React.FC = () => {
  const customRange = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [libraryItems, setLibraryItems] =
    useState<Record<LabelType, LibraryItem[]>>();
  const [loading, setLoading] = useState(true);
  const setLibraryId = useSetRecoilState(libraryIdState);
  const setCurrentPage = useSetRecoilState(currentPageState);
  const setPageSize = useSetRecoilState(pageSizeState);
  const [inputValue, setInputValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isFetchValid, setIsFetchValid] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [sourceLanguageFromVideo, setSourceLanguageFromVideo] = useState<
    string | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    0,
    customRange.length - 1,
  ]);
  const [selectedLabelType, setSelectedLabelType] = useState<LabelType>(
    LabelType.VIDEO
  );

  useEffect(() => {
    setSourceLanguageFromVideo(selectedOption?.value || null);
  }, [selectedOption]);

  const fetchOptions = async (input: string) => {
    try {
      const response = await postLibraryInputVideoLanguages(input);
      if (!response.ok) {
        // If the response is not ok, clear the options, set isFetchValid to false, and disable the button
        setIsFetchValid(false);
        setButtonDisabled(true);
        throw new Error("Failed to fetch options");
      }

      const data = await response.json(); // Add this line to parse the JSON data from the response

      // Update the options using the languageCodes from the response
      const options = data.languageCodes.map((code: any) => ({
        value: code,
        label: code,
      }));
      setSelectOptions(options);
      setIsFetchValid(true);
    } catch (error) {
      // If there's an error, clear the options
      setSelectOptions([]);
      console.error("Error fetching options:", error);
    }
  };

  const fetchData = async () => {
    const data: ApiResponse = await getLibraryItems(
      sessionStorage.getItem("access_token")
    );
    setLibraryItems({
      video: data.video,
      book: data.book,
      text: data.text,
      article: data.article,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {
    setButtonDisabled(!selectedOption || !inputValue || !isFetchValid);
  }, [selectedOption, inputValue, isFetchValid]);

  function calculateBookPercentage(
    page: number,
    sentencesPerPage: number,
    totalSentences: number
  ) {
    const totalPages = Math.ceil(totalSentences / sentencesPerPage);
    const percentage = (Math.min(page, totalPages) / totalPages) * 100;
    return Math.floor(percentage) === 99 && page < totalSentences
      ? 99
      : Math.ceil(percentage);
  }

  const handleLibraryItemClick = (
    libraryId: string,
    currentPage: number,
    pageSize: number
  ) => {
    setLibraryId(libraryId);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  const handleButtonClick = async () => {
    await fetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/library/video`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          input: inputValue,
          sourceLanguage: sourceLanguageFromVideo,
          targetLanguage: targetLanguage,
        }),
      }
    );
  };

  // Add this function to handle the click event for the "Add" button
  const handleAddButtonClick = () => {
    setIsModalVisible(true);
  };

  // Add this function to handle the "Cancel" button click inside the modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const convertToCustomRange = (sliderValue: number[]): string[] => {
    return sliderValue.map((value) => customRange[value]);
  };

  const convertToSliderValue = (customRangeValue: string[]): number[] => {
    return customRangeValue.map((value) => customRange.indexOf(value));
  };

  const handleChange = (value: number | [number, number]) => {
    if (Array.isArray(value)) {
      setSliderValue(value as [number, number]);
    }
  };

  const selectedRange: string[] = convertToCustomRange(sliderValue);

  const marks = customRange.reduce((acc, value, index) => {
    acc[index] = value;
    return acc;
  }, {} as { [key: number]: string });

  const handleLabelTypeButtonClick = (labelType: LabelType) => {
    setSelectedLabelType(labelType);
  };

  const groupedItemsByCategory = (items: LibraryItem[]) => {
    return items.reduce((acc, item) => {
      if (acc[item.category]) {
        acc[item.category].push(item);
      } else {
        acc[item.category] = [item];
      }
      return acc;
    }, {} as Record<string, LibraryItem[]>);
  };

  const filteredLibraryItems = Object.values(libraryItems || {})
    .flat()
    .filter((item) => item.label === selectedLabelType);

  const categorizedItems = groupedItemsByCategory(filteredLibraryItems);

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24} className={styles.centeredColumn}>
          <Space>
            <LanguageSelector
              atom={sourceLanguageState}
              disabledLanguage={targetLanguage}
            />
            <LanguageSelector
              atom={targetLanguageState}
              disabledLanguage={sourceLanguage}
            />
          </Space>
        </Col>
        <Col span={12}>
          <Slider
            range
            min={0}
            max={customRange.length - 1}
            value={sliderValue}
            onChange={handleChange}
            marks={marks}
            tooltip={{ open: false }}
          />
        </Col>
        <Col span={24} className={styles.centeredColumn}>
          <div className={styles.iconContainer}>
            <PlusSquareFilled
              className={styles.icon}
              onClick={handleAddButtonClick}
            />
            <Typography.Text className={styles.text}>Add</Typography.Text>
          </div>
          <div className={styles.iconContainer}>
            <YoutubeFilled
              className={styles.icon}
              onClick={handleAddButtonClick}
            />
            <Typography.Text className={styles.text}>Video</Typography.Text>
          </div>
          <div className={styles.iconContainer}>
            <BookFilled
              className={styles.icon}
              onClick={handleAddButtonClick}
            />
            <Typography.Text className={styles.text}>Book</Typography.Text>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center">
        {Object.values(LabelType).map((labelType) => (
          <Col key={labelType} span={6}>
            <Button onClick={() => handleLabelTypeButtonClick(labelType)}>
              {labelType}
            </Button>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} justify="center"></Row>
      <Divider />
      {Object.entries(categorizedItems).map(([category, items], index) => (
        <CustomSlider
          key={`slider${index + 1}`}
          items={items as LibraryItem[]}
          sliderId={`slider${index + 1}`}
          category={category}
        />
      ))}
      <Modal
        title="Add Video"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleButtonClick}
            disabled={buttonDisabled}
          >
            Add Video
          </Button>,
        ]}
      >
        {/* Add your form or other content for the modal here */}
        <Tabs style={{ marginTop: "0px" }}>
          <TabPane tab="Video" key="1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/320px-YouTube_Logo_2017.svg.png"
              alt="YouTube Logo"
              style={{
                margin: "0 auto",
                marginBottom: "24px",
              }}
            />
            <Row gutter={16}>
              <Col span={16} style={{ marginBottom: "24px" }}>
                <Form
                  onFinish={(values) => {
                    console.log("YouTube Video URL:", values.youtubeUrl);
                    // Handle the submission here
                  }}
                  style={{ display: "inline-block", width: "100%" }}
                >
                  <Form.Item
                    name="youtubeUrl"
                    rules={[
                      {
                        required: true,
                        message: "Please input the YouTube video URL",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="YouTube Video URL"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (e.target.value) {
                          fetchOptions(e.target.value);
                          // Clear the selected option and disable the button when the input changes
                          setSelectedOption(null);
                          setButtonDisabled(true);
                        } else {
                          setSelectOptions([]);
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Select an option"
                  value={selectedOption?.value}
                  onChange={(value, option) => {
                    setSelectedOption(option as Option);
                  }}
                  disabled={!isFetchValid}
                >
                  {selectOptions &&
                    selectOptions.map((option, index) => (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={buttonDisabled}
                  onClick={handleButtonClick}
                >
                  Add Video
                </Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Text" key="2"></TabPane>
        </Tabs>
      </Modal>
    </PageContainer>
  );
};

export default Library;
