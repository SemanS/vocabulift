import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  List,
  Col,
  Row,
  Card,
  Typography,
  Select,
  Tabs,
  Slider,
  Modal,
} from "antd";

const { TabPane } = Tabs;

import { useRecoilState, useSetRecoilState } from "recoil";
import { Link } from "react-router-dom";
import {
  getLibraryItems,
  postLibraryInputVideoLanguages,
  postLibraryVideo,
} from "@/services/libraryService";
import { LibraryItem } from "@/models/libraryItem.interface";
import classNames from "classnames";
import styles from "./index.module.less";
import { ReadOutlined } from "@ant-design/icons";
import { YoutubeOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import {
  libraryIdState,
  currentPageState,
  pageSizeState,
} from "@/stores/library";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { LabelType } from "@/models/sentences.interfaces";
import CustomSlider from "./components/CustomSlider";

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
  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [libraryItems, setLibraryItems] =
    useState<Record<LabelType, LibraryItem[]>>();
  const [activeCard, setActiveCard] = useState<string>("");
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
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    /* postLibraryVideo(
      sourceLanguage,
      targetLanguage,
      "https://www.youtube.com/watch?v=OEiNJNkSRoU&t=40s&ab_channel=BBCNews"
    ); */
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

  const onChange = (value: number | [number, number]) => {
    console.log("onChange: ", value);
  };

  const onAfterChange = (value: number | [number, number]) => {
    console.log("onAfterChange: ", value);
  };

  // Add this function to handle the click event for the "Add" button
  const handleAddButtonClick = () => {
    setIsModalVisible(true);
  };

  // Add this function to handle the "Cancel" button click inside the modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Slider
            range
            step={10}
            defaultValue={[20, 50]}
            onChange={onChange}
            onAfterChange={onAfterChange}
          />
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={handleAddButtonClick}>
            Add
          </Button>
        </Col>
      </Row>
      {Object.values(libraryItems || {}).map((items, index) => (
        <CustomSlider
          key={`slider${index + 1}`}
          items={items}
          sliderId={`slider${index + 1}`}
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
      </Modal>
    </PageContainer>
  );
};

export default Library;
