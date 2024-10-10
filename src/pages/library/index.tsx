import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row, Typography, Space, Tooltip, Button, Select } from "antd";

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
import { vocabuFetch } from "@/utils/vocabuFetch";
import CustomSpinnerComponent from "@/pages/spinner/CustomSpinnerComponent";
import { useIntl } from "react-intl";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import { useMount, useSetState } from "react-use";
import { useNavigate } from "react-router-dom";
import { FeatureType } from "@/pages/webLayout/shared/common/types";
import styled from "styled-components";

interface State {
  run: boolean;
  steps: Step[];
  stepIndex: number;
  mainKey: number;
}

const Library: React.FC = () => {
  const settingsTriggerRef = useRef(null);
  const addMenuRef = useRef(null);
  const targetLanguageRef = useRef(null);
  const addVideoRef = useRef(null);

  const customRange = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [libraryItems, setLibraryItems] =
    useState<Record<LabelType, LibraryItem[]>>();
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  //const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const [videoDuration, setVideoDuration] = useState<number>(0);
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
  const [eventFinalized, setEventFinalized] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(isDisabled());
  const [settingsDrawerWasOpen, setSettingsDrawerWasOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureType[]>([]);

  const intl = useIntl();

  const fetchOptions = async (input: string) => {
    try {
      const response = await postLibraryInputVideoLanguages(input);
      if (!response.ok) {
        setIsFetchValid(false);
        throw new Error("Failed to fetch options");
      }

      const data = await response.json();
      if (!data.videoDuration || data.videoDuration.length === 0) {
        setIsFetchValid(false);
        throw new Error("Empty data received from server");
      }

      /* const options = data.languageCodes.map((code: any) => ({
        value: code,
        label: code,
      })); */
      //setSelectOptions(options);

      setVideoDuration(data.videoDuration);
      setIsFetchValid(true);
    } catch (error) {
      // If there's an error, clear the options
      setVideoDuration(0);
      console.error("Error fetching options:", error);
    }
  };

  const [{ run, stepIndex, steps, mainKey }, setState] = useSetState<State>({
    run: false,
    stepIndex: 0,
    steps: [],
    mainKey: 0,
  });

  useMount(() => {
    setState({
      run: true,
      steps: [
        {
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: "joyride.library.step.1" }),
              }}
            />
          ),
          disableBeacon: true,
          showSkipButton: false,
          hideBackButton: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: false,
          placement: "bottom",
          spotlightClicks: false,
          target: settingsTriggerRef.current,
          title: intl.formatMessage({ id: "joyride.library.step.1.title" }),
        },
        {
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: "joyride.library.step.2" }),
              }}
            />
          ),
          hideBackButton: true,
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          placement: "bottom",
          spotlightClicks: false,
          target: addMenuRef.current,
          title: intl.formatMessage({ id: "joyride.library.step.2.title" }),
          showSkipButton: false,
        },
        {
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: "joyride.library.step.3" }),
              }}
            />
          ),
          hideBackButton: true,
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: false,
          placement: "bottom",
          target: targetLanguageRef.current,
          title: intl.formatMessage({ id: "joyride.library.step.3.title" }),
          showSkipButton: false,
        },
        {
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: "joyride.library.step.4" }),
              }}
            />
          ),
          hideBackButton: true,
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: false,
          placement: "bottom",
          target: addVideoRef.current,
          title: intl.formatMessage({ id: "joyride.library.step.4.title" }),
          showSkipButton: false,
        },
        {
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: "joyride.library.step.5" }),
              }}
            />
          ),
          hideBackButton: true,
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          placement: "bottom",
          spotlightClicks: false,
          target: "#uniqueTargetId",
          title: intl.formatMessage({ id: "joyride.library.step.5.title" }),
          showSkipButton: false,
        },
      ],
    });
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (type === EVENTS.TOUR_START) {
      setSettingsDrawerWasOpen(true);
      if (settingsDrawerVisible) {
        toggleSettingsDrawer();
        setState({ stepIndex: 1 });
      }
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setState({ stepIndex: nextStepIndex });
    }

    if (type === EVENTS.TOUR_END) {
      setState({ run: false, stepIndex: 0, mainKey: mainKey + 1 });
      document.body.style.overflow = "auto";
      if (run) {
        toggleSettingsDrawer();
        setSettingsDrawerWasOpen(false);
      }
    }

    if (user.newUser) {
      if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
        setState({ run: false, stepIndex: 0 });
        document.body.style.overflow = "auto";
      } else if (
        ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(
          type
        )
      ) {
        const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        if (index === 0) {
          document.body.style.overflow = "hidden";
          toggleSettingsDrawer();
          setState({ run: true, stepIndex: nextStepIndex });
        } else if (index === 1) {
          document.body.style.overflow = "hidden";
          setState({ run: true, stepIndex: nextStepIndex });
        } else if (index === 2) {
          document.body.style.overflow = "hidden";
          setState({ run: true, stepIndex: nextStepIndex });
        } else if (index === 3) {
          document.body.style.overflow = "hidden";
          setState({ run: true, stepIndex: nextStepIndex });
        } else if (index === 4) {
          navigate(
            `/library/65eff42ba9cddfc6887ef46a?currentPage=1&pageSize=10&targetLanguage=${user.targetLanguage}`
          );
          document.body.style.overflow = "hidden";
          setState({ run: true, stepIndex: nextStepIndex });
        } else {
          setState({
            stepIndex: nextStepIndex,
          });
        }
      }
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

  const myLanguageOptions = [
    { label: "English", value: "en" },
    /* { label: "Slovak", value: "sk" },
    { label: "Czech", value: "cs" }, */
    { label: "French", value: "fr" },
    { label: "Spanish", value: "es" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const ongoingEventId = localStorage.getItem("ongoingEventId");
      socket.connect();
      if (ongoingEventId) {
        try {
          const response = await vocabuFetch(
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
            localStorage.removeItem("videoThumbnail");
            localStorage.removeItem("ongoingEventId");
            localStorage.removeItem("progress");
            async () => {
              socket.disconnect();
            };
          } else {
            setProgress(Number(localStorage.getItem("progress")));
            socket.emit("resumeProgress", {
              eventId: localStorage.getItem("ongoingEventId"),
            });
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();

    if (!localStorage.getItem("ongoingEventId")) {
      return () => {
        async () => {
          socket.disconnect();
        };
      };
    }
  }, []);

  useEffect(() => {
    setSourceLanguageFromVideo(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setLoading(true);
    if (videoThumbnail) {
      fetchData(videoThumbnail);
    } else {
      fetchData();
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const ongoingEventId = localStorage.getItem("ongoingEventId");

    if (ongoingEventId) {
      setPolling(true);
    }
  }, []);

  const createTempItem = (thumbnail: string) => {
    const newItem: LibraryItem = {
      _id: "temp-item",
      title: "New Item",
      label: LabelType.VIDEO,
      image: "",
      description: "",
      totalSentences: 1,
      videoThumbnail: thumbnail,
      videoId: "",
      category: "My Videos",
      level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      eventId: "",
      snapshotsInfo: [],
      duration: "",
      worksheet: "",
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

    async function onFinalizeEvent() {
      setEventFinalized(true);
      localStorage.removeItem("ongoingEventId");
      localStorage.removeItem("progress");
      localStorage.removeItem("videoThumbnail");
      localStorage.removeItem("progress");
      setProgress(0);
      setLoading(true);
      fetchData();
      setLoading(false);
      socket.off("progress", onProgressUpdate);
      socket.off("finalizeEvent", onFinalizeEvent);
      async () => {
        socket.disconnect();
      };
      setPolling(false);
    }

    async function onProgressUpdate(progressData: any) {
      if (
        Number(progressData.progressPercentage) > 35 &&
        progressData.progressStatus === "InProgress"
      ) {
        localStorage.removeItem("videoThumbnail");
        setVideoThumbnail(undefined);
      }
      localStorage.setItem("progress", progressData.progressPercentage);
      setProgress(Number(progressData.progressPercentage.toString()));
    }

    socket.on("progress", onProgressUpdate);
    socket.on("finalizeEvent", onFinalizeEvent);
  }, [polling, sliderUpdated]);

  const handleAddButtonClick = async () => {
    setIsButtonDisabled(isDisabled());
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setInputValue("");
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
    const levelFilter = item.level.some(
      (level) =>
        customRange.indexOf(level.toUpperCase()) >= sliderValue[0] &&
        customRange.indexOf(level.toUpperCase()) <= sliderValue[1]
    );

    const featureFilter =
      selectedFeatures.length === 0 ||
      (item.enrichedFeatures &&
        Array.isArray(item.enrichedFeatures) &&
        selectedFeatures.every((feature) =>
          item.enrichedFeatures.includes(feature)
        ));

    return levelFilter && featureFilter;
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

    await updateUser(updatedUserEntity);

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

  const renderLabelTypeButtonGroup = (isDisabled: boolean) => {
    const disabledStyle = {
      opacity: 0.5,
      pointerEvents: "none" as const,
    };
    return (
      <Tooltip
        title={
          isDisabled && "Subscribe to gain the ability to add more videos."
        }
      >
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
              ...(isDisabled ? disabledStyle : {}),
            }}
            ref={addVideoRef}
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
          {/* TOTO NECHAT */}
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
      </Tooltip>
    );
  };

  const { toggleSettingsDrawer, settingsDrawerVisible } =
    useSettingsDrawerContext();

  useEffect(() => {
    if (settingsDrawerVisible) {
      setDrawerHeight(420);
    } else {
      setDrawerHeight(0);
    }
  }, [settingsDrawerVisible]);

  function isDisabled() {
    if (user.email === "slavosmn@gmail.com") {
      return false;
    }
    if (user.subscribed) {
      return false;
    }
    if (user.partnerCode === "") return user.isAddVideoExceeded;
  }

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
              <Col span={10} ref={addMenuRef}>
                {/* <LanguageSelector
                  options={myLanguageOptions}
                  useRecoil={false}
                  languageProp="sourceLanguage"
                  disabledLanguage={user.targetLanguage}
                  text={intl.formatMessage({ id: "translate.from" }) + " "}
                /> */}
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
              <Col span={10} ref={targetLanguageRef}>
                {/* <LanguageSelector
                  useRecoil={true}
                  languageProp="targetLanguage"
                  disabledLanguage={user.sourceLanguage}
                  text={intl.formatMessage({ id: "translate.to" }) + " "}
                /> */}
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
            {renderLabelTypeButtonGroup(isButtonDisabled)}
          </Col>
        </Row>
      </>
    );
  };

  function handleWalkthrough() {
    setState({
      run: stepIndex === 0 ? false : run,
      stepIndex: stepIndex === 0 ? 1 : stepIndex,
    });
  }

  const customLocale = {
    last: intl.formatMessage({ id: "joyride.last" }),
    next: intl.formatMessage({ id: "joyride.next" }),
  };

  const handleFeatureButtonClick = (feature: FeatureType) => {
    setSelectedFeatures((prevFeatures) => {
      if (prevFeatures.includes(feature)) {
        return prevFeatures.filter((f) => f !== feature);
      } else {
        return [...prevFeatures, feature];
      }
    });
  };

  const FeatureWrapper = styled.div`
    /* left: 50%; */
    /* bottom: 24px; */

    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    gap: 8px;

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

  return (
    <CustomSpinnerComponent spinning={loading}>
      <PageContainer title={false}>
        {/* {user.newUser && (
          <Joyride
            key={mainKey}
            continuous
            run={run}
            disableScrolling
            hideCloseButton
            showProgress
            showSkipButton
            steps={steps}
            stepIndex={stepIndex}
            callback={handleJoyrideCallback}
            locale={customLocale}
          />
        )} */}
        <div className={styles.drawerContainer} style={{ overflow: "hidden" }}>
          {/* <div
            className={styles.drawerPushContent}
            style={{ maxHeight: drawerHeight }}
          >
            {renderSettingsDrawerContent()}
          </div> */}
          <div className={styles.redBackground}>
            <div className={styles.fullWidthWhiteBackground}>
              {/* <span
                onClick={() => {
                  toggleSettingsDrawer();
                  handleWalkthrough();
                }}
                className={styles.box}
              > */}
              {/* <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  ref={settingsTriggerRef}
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
                      color: "#171625",
                      marginLeft: "8px",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    {intl.formatMessage({ id: "menu.settings" })}
                  </Typography.Title>
                </span> */}
              {/* </span> */}
              <Row gutter={[16, 16]} justify="center"></Row>
            </div>
            <Row style={{ marginTop: "20px" }}>
              <Col xs={20} sm={20} md={16} lg={8} xl={8} xxl={8}></Col>
              <Col xs={20} sm={20} md={16} lg={4} xl={4} xxl={4}>
                <LanguageSelector
                  options={myLanguageOptions}
                  useRecoil={true}
                  languageProp="sourceLanguage"
                  disabledLanguage={user.targetLanguage}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
              <Col xs={20} sm={20} md={16} lg={4} xl={4} xxl={4}>
                <FeatureWrapper>
                  {Object.values(FeatureType).map((feature) => (
                    <Tooltip
                      title={feature.charAt(0).toUpperCase() + feature.slice(1)}
                      key={feature}
                    >
                      <Button
                        onClick={() => handleFeatureButtonClick(feature)}
                        style={{
                          display: "inline-block",
                          backgroundColor: selectedFeatures.includes(feature)
                            ? "tomato"
                            : "white",
                          color: selectedFeatures.includes(feature)
                            ? "white"
                            : "black",
                          borderRadius: "15px",
                          border: "1px solid #d9d9d9",
                          minWidth: "80px",
                        }}
                      >
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </Button>
                    </Tooltip>
                  ))}
                </FeatureWrapper>
              </Col>
            </Row>
            <Row
              gutter={[16, 16]}
              justify="center"
              style={{ marginTop: "10px" }}
            >
              <Col xs={20} sm={20} md={16} lg={8} xl={8} xxl={8}>
                <LevelSlider handleChange={handleChange} />
              </Col>
            </Row>
            <div
              style={{
                paddingInline: "48px",
                marginTop: "30px",
                //overflow: "hidden",
              }}
            >
              {Object.entries(categorizedItems)
                .sort(([categoryA], [categoryB]) => {
                  if (categoryA === "My Videos") {
                    return -1;
                  } else if (categoryB === "My Videos") {
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
                    selectedLanguageTo={user.targetLanguage}
                    eventFinalized={eventFinalized}
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
              videoDuration={videoDuration}
              targetLanguage={user.targetLanguage}
              onLanguageSelect={handleLanguageSelect}
              onAddItemClick={async (
                videoThumbnail: string,
                status: string
              ) => {
                if (status !== "conflict") {
                  setEventFinalized(false);
                  setPolling(true);
                  setSliderUpdated(true);
                  updateVideoThumbnail(videoThumbnail);
                } else {
                  await fetchData();
                }
              }}
              resetVideoDuration={() => setVideoDuration(0)}
            />
          </div>
          <div className={styles.footer}>
            <Typography.Text>
              <center>©2024 Vocabulift</center>
            </Typography.Text>
          </div>
        </div>
      </PageContainer>
    </CustomSpinnerComponent>
  );
};

export default Library;
