import React, { useEffect, useState } from "react";
import { Button, Col, Row, Typography, Space, Progress, Spin } from "antd";

import { useRecoilState } from "recoil";
import {
  getLibraryItems,
  postLibraryInputVideoLanguages,
} from "@/services/libraryService";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./index.module.less";
import {
  DownOutlined,
  PlusOutlined,
  SwapOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { LabelType } from "@/models/sentences.interfaces";
import { Option } from "@/models/utils.interface";
import CustomSlider from "./components/CustomSlider";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";
import { ApiResponse } from "@/models/apiResponse.interface";
import LevelSlider from "@/pages/library/components/LevelSlider";
import AddItemModal from "./components/AddItemModal";
import { useSettingsDrawerContext } from "@/contexts/SettingsDrawerContext";
import { User, UserEntity } from "@/models/user";
import { userState } from "@/stores/user";
import { updateUser } from "@/services/userService";
import { socket } from "@/messaging/socket";
import "antd/dist/reset.css";
import { useCookies } from "react-cookie";

const Library: React.FC = () => {
  const customRange = ["A1", "A2", "B1", "B2", "C1", "C2"];
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
  const [user, setUser] = useRecoilState(userState);
  const [progress, setProgress] = useState(0);
  const [polling, setPolling] = useState(false);
  const [sliderUpdated, setSliderUpdated] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | undefined>(
    localStorage.getItem("videoThumbnail") || undefined
  );

  const fetchOptions = async (input: string) => {
    try {
      const response = await postLibraryInputVideoLanguages(input);
      if (!response.ok) {
        setIsFetchValid(false);
        throw new Error("Failed to fetch options");
      }

      const data = await response.json();
      if (!data.languageCodes || data.languageCodes.length === 0) {
        setIsFetchValid(false);
        throw new Error("Empty data received from server");
      }

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

  const fetchData = async (newVideoThumbnail: string | null = null) => {
    const userEntity: UserEntity = {
      sourceLanguage: user.sourceLanguage,
      targetLanguage: user.targetLanguage,
    };
    const data: ApiResponse = await getLibraryItems(userEntity);

    if (newVideoThumbnail) {
      const newItem = createTempItem(newVideoThumbnail);
      data.video.unshift(newItem);
    }

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
    //fetchData();
    if (localStorage.getItem("videoThumbnail")) {
      fetchData(videoThumbnail);
    } else {
      fetchData();
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const savedProgress = localStorage.getItem("progress");
    if (savedProgress) {
      setProgress(Number(savedProgress));
    } else {
      setProgress(0);
    }

    const ongoingEventId = localStorage.getItem("ongoingEventId");

    if (ongoingEventId) {
      setPolling(true);
    }
  }, []);

  const createTempItem = (thumbnail: string) => {
    const newItem: LibraryItem = {
      id: "temp-item",
      title: "New Item",
      label: LabelType.VIDEO,
      image: "",
      description: "",
      totalSentences: 1,
      videoThumbnail: thumbnail,
      videoId: "",
      category: "My videos",
      level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      eventId: "",
      snapshotsInfo: [],
    };
    return newItem;
  };

  useEffect(() => {
    if (sliderUpdated) {
      setLoading(true);
      if (videoThumbnail) {
        fetchData(videoThumbnail);
      } else {
        fetchData();
      }
      setLoading(false);
      setSliderUpdated(false);
    }

    async function onProgressUpdate(progressData: any) {
      if (
        progressData.progressPercentage > 0 &&
        progressData.progressStatus === "InProgress"
      ) {
        localStorage.removeItem("videoThumbnail");
        setVideoThumbnail(undefined);
        setLoading(true);
        fetchData();
        setLoading(false);
      }
      console.log("progressData" + JSON.stringify(progressData, null, 2));
      setProgress(Number(progressData.progressPercentage.toString()));
      if (progressData.progressStatus === "Complete") {
        localStorage.removeItem("ongoingEventId");
        localStorage.removeItem("progress");
        localStorage.removeItem("videoThumbnail");
        setPolling(false);
        setProgress(0);
        setLoading(true);
        fetchData();
        setLoading(false);
        socket.off("progress", onProgressUpdate);
      }
    }

    socket.on("progress", onProgressUpdate);

    return () => {
      socket.off("progress", onProgressUpdate);
    };
  }, [polling, sliderUpdated]);

  const handleAddButtonClick = () => {
    setIsModalVisible(true);
  };

  // Add this function to handle the "Cancel" button click inside the modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setInputValue(""); // Clear the inputValue when the modal is closed
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

  const handleSwapLanguages = async () => {
    const previousSourceLanguage = user.sourceLanguage;

    const updatedUserEntity: Partial<User> = {
      sourceLanguage: user.targetLanguage,
      targetLanguage: user.sourceLanguage,
    };

    await updateUser(updatedUserEntity as UserEntity);

    setUser((prevUser) => ({
      ...prevUser,
      sourceLanguage: user.targetLanguage,
      targetLanguage: previousSourceLanguage,
    }));
  };

  const updateVideoThumbnail = (newThumbnail: string) => {
    localStorage.setItem("videoThumbnail", newThumbnail);
    setVideoThumbnail(newThumbnail);
  };

  const renderLabelTypeButtonGroup = () => {
    return (
      <Space size={20}>
        <div
          className={styles.whiteIconBox}
          onClick={handleAddButtonClick}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PlusOutlined
            style={{
              fontSize: "30px",
            }}
          />
          <Typography.Text
            style={{
              marginLeft: "10px",
              paddingRight: "10px",
              color: "white",
              fontWeight: "500",
            }}
          >
            {" "}
            Add Video
          </Typography.Text>
        </div>
        {/*  <Button
          size="large"
          type={selectedLabelType === LabelType.VIDEO ? "primary" : "default"}
          onClick={() => handleLabelTypeButtonClick(LabelType.VIDEO)}
        >
          Videos
        </Button> */}
        {/* <Button
          size="large"
          type={selectedLabelType === LabelType.BOOK ? "primary" : "default"}
          onClick={() => handleLabelTypeButtonClick(LabelType.BOOK)}
        >
          Books
        </Button> */}
      </Space>
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
            xs={20}
            sm={20}
            md={16}
            lg={8}
            xl={8}
            xxl={8}
            style={{ marginTop: "30px" }}
          >
            <Row gutter={[16, 16]} justify="center">
              <Col span={10}>
                <LanguageSelector
                  useRecoil={true}
                  languageProp="sourceLanguage"
                  disabledLanguage={user.targetLanguage}
                  text={"Translate from: "}
                />
              </Col>
              <Col
                span={4}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <SwapOutlined
                  style={{ fontSize: "42px" }}
                  onClick={handleSwapLanguages}
                />
              </Col>
              <Col span={10}>
                <LanguageSelector
                  useRecoil={true}
                  languageProp="targetLanguage"
                  disabledLanguage={user.sourceLanguage}
                  text={"Translate to: "}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "20px" }}
        >
          <Col xs={20} sm={20} md={16} lg={8} xl={8} xxl={8}>
            <LevelSlider handleChange={handleChange} />
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "20px" }}
        >
          <Col xs={20} sm={20} md={16} lg={8} xl={8} xxl={8}>
            {renderLabelTypeButtonGroup()}
          </Col>
        </Row>
      </>
    );
  };

  useEffect(() => {
    if (settingsDrawerVisible) {
      setDrawerHeight(420);
    } else {
      setDrawerHeight(0);
    }
  }, [settingsDrawerVisible]);

  useEffect(() => {
    const fetchData = async () => {
      const ongoingEventId = localStorage.getItem("ongoingEventId");
      if (ongoingEventId) {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
            }/progress/${ongoingEventId}`,
            {
              headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access_token"
                )}`,
              },
            }
          );

          const progressData = await response.json();

          if (progressData.progressStatus === "Complete") {
            localStorage.removeItem("ongoingEventId");
            localStorage.removeItem("progress");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }

      if (!ongoingEventId) {
        socket.connect();
      }
    };

    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

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
                <Typography.Title
                  style={{
                    color: "#171625", // Change this color to your header's color
                    marginLeft: "8px",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  Settings
                </Typography.Title>
              </span>
            </span>
          </div>
          <div style={{ paddingInline: "48px", marginTop: "30px" }}>
            {Object.entries(categorizedItems)
              .sort(([categoryA], [categoryB]) => {
                if (categoryA === "My videos") {
                  return -1;
                } else if (categoryB === "My videos") {
                  return 1;
                } else {
                  return 0;
                }
              })
              .map(([category, items], index) => (
                <CustomSlider
                  key={`slider${index + 1}`}
                  items={items as LibraryItem[]}
                  sliderId={`slider${index + 1}`}
                  category={category}
                  progress={progress}
                />
              ))}
          </div>
          <AddItemModal
            isModalVisible={isModalVisible}
            handleModalCancel={handleModalCancel}
            inputValue={inputValue}
            setInputValue={setInputValue}
            fetchOptions={fetchOptions}
            isFetchValid={isFetchValid}
            selectOptions={selectOptions}
            targetLanguage={user.targetLanguage}
            onLanguageSelect={handleLanguageSelect} // add this prop
            onAddItemClick={(videoThumbnail) => {
              setPolling(true);
              setSliderUpdated(true);
              updateVideoThumbnail(videoThumbnail);
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Library;
