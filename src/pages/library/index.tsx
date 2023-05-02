import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Typography,
  Space,
  Divider,
  Drawer,
  Radio,
} from "antd";

import { useRecoilState } from "recoil";
import {
  getLibraryItems,
  postLibraryInputVideoLanguages,
} from "@/services/libraryService";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./index.module.less";
import {
  BookFilled,
  DownOutlined,
  PlusSquareFilled,
  UpOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { LabelType } from "@/models/sentences.interfaces";
import { Option } from "@/models/utils.interface";
import CustomSlider from "./components/CustomSlider";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";
import { ApiResponse } from "@/models/apiResponse.interface";
import LevelSlider from "@/pages/library/components/LevelSlider";
import AddItemModal from "./components/AddItemModal";
import { useSettingsDrawerContext } from "@/contexts/SettingsDrawerContext";

const Library: React.FC = () => {
  const customRange = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const [sourceLanguage, setSourceLanguage] =
    useRecoilState(sourceLanguageState);
  const [targetLanguage, setTargetLanguage] =
    useRecoilState(targetLanguageState);
  const [libraryItems, setLibraryItems] =
    useState<Record<LabelType, LibraryItem[]>>();
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const [isFetchValid, setIsFetchValid] = useState(false);
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
  const [drawerHeight, setDrawerHeight] = useState(0);

  const fetchOptions = async (input: string) => {
    try {
      const response = await postLibraryInputVideoLanguages(input);
      if (!response.ok) {
        // If the response is not ok, clear the options, set isFetchValid to false, and disable the button
        setIsFetchValid(false);
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
    });
  };

  useEffect(() => {
    setSourceLanguageFromVideo(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

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

  const handleChange = (value: number | [number, number]) => {
    if (Array.isArray(value)) {
      setSliderValue(value as [number, number]);
    }
  };

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

  const flattenedItems = Object.values(libraryItems || {}).flat();

  const filteredByLabelType = flattenedItems.filter(
    (item) => item.label === selectedLabelType
  );

  const filteredLibraryItems = filteredByLabelType.filter((item) => {
    return item.level.some((level) => {
      const levelIndex = customRange.indexOf(level.toUpperCase());
      return levelIndex >= sliderValue[0] && levelIndex <= sliderValue[1];
    });
  });

  const categorizedItems = groupedItemsByCategory(filteredLibraryItems);

  const handleLanguageSelect = (language: string) => {
    setSourceLanguageFromVideo(language);
  };

  const renderLabelTypeRadioButtons = () => {
    return (
      <Radio.Group
        buttonStyle="solid"
        size="large"
        value={selectedLabelType}
        onChange={(e) => handleLabelTypeButtonClick(e.target.value)}
      >
        <Radio.Button value={LabelType.VIDEO}>VIDEO</Radio.Button>
        <Radio.Button value={LabelType.BOOK}>Book</Radio.Button>
      </Radio.Group>
    );
  };

  const { toggleSettingsDrawer, settingsDrawerVisible } =
    useSettingsDrawerContext();

  const renderSettingsDrawerContent = () => {
    return (
      <>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "20px" }}
        >
          <Col
            xs={8}
            sm={8}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className={styles.centeredColumn}
            style={{ justifyContent: "center", marginTop: "30px" }}
          >
            <Space>
              <LanguageSelector
                useRecoil={true}
                atom={sourceLanguageState}
                disabledLanguage={targetLanguage}
              />

              <LanguageSelector
                useRecoil={true}
                atom={targetLanguageState}
                disabledLanguage={sourceLanguage}
              />
            </Space>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "20px" }}
        >
          <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
            <LevelSlider handleChange={handleChange} />
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="start" style={{ marginBottom: "20px" }}>
          <Col
            xs={3}
            sm={3}
            md={3}
            lg={3}
            xl={3}
            xxl={3}
            className={styles.centeredColumn}
            offset={8}
          >
            {/* <Typography.Text
              className={styles.text}
              style={{
                color: "#171625",
                fontSize: "20px",
              }}
            >
              Add:
            </Typography.Text> */}
          </Col>
          <Col>
            <Row style={{ marginBottom: "20px" }}>
              <PlusSquareFilled
                className={styles.icon}
                onClick={handleAddButtonClick}
              />
              {renderLabelTypeRadioButtons()}
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  useEffect(() => {
    if (settingsDrawerVisible) {
      setDrawerHeight(320); // Set the desired height when the drawer is visible
    } else {
      setDrawerHeight(0); // Set the height to 0 when the drawer is hidden
    }
  }, [settingsDrawerVisible]);

  return (
    <PageContainer loading={loading} title={false}>
      <div className={styles.drawerContainer}>
        <div
          className={styles.drawerPushContent}
          style={{ maxHeight: drawerHeight }}
        >
          {renderSettingsDrawerContent()}
        </div>
        <div className={styles.redBackground}>
          <div className={styles.fullWidthWhiteBackground}>
            <span onClick={toggleSettingsDrawer} className={styles.box}>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {settingsDrawerVisible ? (
                  <UpOutlined
                    style={{
                      color: "#171625",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <DownOutlined
                    style={{
                      color: "#171625",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                )}
                <Typography.Text
                  style={{
                    color: "#171625", // Change this color to your header's color
                    marginLeft: "4px",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  Settings
                </Typography.Text>
              </span>
            </span>
          </div>
          <div style={{ paddingInline: "48px", marginTop: "30px" }}>
            {Object.entries(categorizedItems).map(
              ([category, items], index) => (
                <CustomSlider
                  key={`slider${index + 1}`}
                  items={items as LibraryItem[]}
                  sliderId={`slider${index + 1}`}
                  category={category}
                />
              )
            )}
          </div>
          <AddItemModal
            isModalVisible={isModalVisible}
            handleModalCancel={handleModalCancel}
            handleButtonClick={handleButtonClick}
            inputValue={inputValue}
            setInputValue={setInputValue}
            fetchOptions={fetchOptions}
            isFetchValid={isFetchValid}
            selectOptions={selectOptions}
            targetLanguage={targetLanguage}
            onLanguageSelect={handleLanguageSelect} // add this prop
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Library;
