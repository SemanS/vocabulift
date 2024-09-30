import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tabs,
  Typography,
} from "antd";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";
import { socket } from "@/messaging/socket";
import { Option } from "@/models/utils.interface";
import { postLibraryVideo } from "@/services/libraryService";
import { PageContainer } from "@ant-design/pro-layout";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import PricingComponent from "@/pages/webLayout/shared/components/Pricing/PricingComponent";
import { updateUser } from "@/services/userService";
import { User } from "@/models/user";

interface AddItemModalProps {
  isModalVisible: boolean;
  handleModalCancel: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  fetchOptions: (input: string) => Promise<void>;
  isFetchValid: boolean;
  videoDuration: number;
  targetLanguage: string;
  onLanguageSelect: (language: string) => void;
  onAddItemClick: (videoThumbnail: string, status: string) => void;
  resetVideoDuration: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isModalVisible,
  handleModalCancel,
  inputValue,
  setInputValue,
  fetchOptions,
  isFetchValid,
  videoDuration,
  targetLanguage,
  onLanguageSelect,
  onAddItemClick,
  resetVideoDuration,
}) => {
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguageTo, setSelectedLanguageTo] =
    useState<string>(targetLanguage);
  const [user, setUser] = useRecoilState(userState);
  const [isDurationModalVisible, setIsDurationModalVisible] = useState(false);
  const [isValidYoutubeUrl, setIsValidYoutubeUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    if (!loading && videoDuration > 600 && inputValue.length > 0) {
      setIsDurationModalVisible(true);
    }
  }, [loading, videoDuration, inputValue]);

  const handleCloseDurationModal = () => {
    setIsDurationModalVisible(false);
    setButtonDisabled(true);
    resetVideoDuration();
  };

  const intl = useIntl();

  useEffect(() => {
    if (activeTab === "2") {
      setInputValue("");
      setButtonDisabled(true);
    }
    if (activeTab === "1") {
      setUploadedFile(null);
      setButtonDisabled(true);
    }
    form.resetFields();
    setResponseMessage("");
  }, [activeTab]);

  const handleLanguageSelection = (language: string) => {
    setSelectedLanguageFrom(language);
    onLanguageSelect(language);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const youtubeUrlPattern =
      /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    const isValidYoutubeUrl = youtubeUrlPattern.test(value);
    setIsValidYoutubeUrl(isValidYoutubeUrl);
    setInputValue(value);

    if (value && isValidYoutubeUrl) {
      setLoading(true);
      await fetchOptions(value).then(() => {
        setLoading(false);
        setButtonDisabled(!value);
      });
    } else {
      setButtonDisabled(true);
    }
  };

  const resetFields = () => {
    setInputValue("");
    setSelectedOption(null);
    setButtonDisabled(true);
    setUploadedFile(null);
    form.resetFields();
  };

  const handleModalCancelAndReset = () => {
    form.resetFields();
    resetFields();
    handleModalCancel();
  };

  const handleButtonClick = async () => {
    form.submit();
  };

  const handleFormSubmit = async (values: any) => {
    const { youtubeUrl, language } = values;
    if (
      user.isAddVideoExceeded &&
      !user.subscribed &&
      user.email !== "slavosmn@gmail.com" &&
      user.partnerCode !== "edifiers123" &&
      user.partnerCode !== "senacor123" &&
      user.partnerCode !== "linguarte123"
    ) {
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await postLibraryVideo(
        selectedLanguageFrom,
        selectedLanguageTo,
        youtubeUrl
      );

      if (response.status === "conflict") {
        //onAddItemClick(response.message, response.status);
        //handleModalCancelAndReset();
        setResponseMessage(response.message);
        return response.status;
      }

      const { videoThumbnail, eventId, sourceLanguage, transcript } = response;

      void socket.emit("add-video", {
        input: youtubeUrl,
        eventId: eventId,
        targetLanguage: selectedLanguageTo,
        sourceLanguage: sourceLanguage,
        transcript: transcript,
      });

      const updatedUserEntity: Partial<User> = {
        isAddVideoExceeded: true,
      };

      await updateUser(updatedUserEntity);
      localStorage.setItem("ongoingEventId", eventId);
      setUser({ ...user, isAddVideoExceeded: true });

      onAddItemClick(videoThumbnail, response.status);
      handleModalCancelAndReset();
    } catch (error) {
      // Handle any errors
      console.error(error);
    } finally {
      setIsLoading(false); // Ensure loading is stopped in case of success or failure
    }
  };

  const normFile = (e: any) => {
    if (e?.file) {
      const data = new FormData();
      data.append("bookFile", e.file);
      // Now you can send 'data' to your backend
      setUploadedFile(data);
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const items = [
    {
      key: "1",
      label: "Video",
      children: (
        <PageContainer title={false}>
          <Row gutter={[16, 16]} justify="center">
            <Col span={16} style={{ marginBottom: "24px", marginTop: "36px" }}>
              <Form
                preserve={false}
                {...layout}
                onFinish={handleFormSubmit}
                form={form}
              >
                {!loading && !isValidYoutubeUrl && inputValue.length > 0 && (
                  <Typography.Text type="danger">
                    Please enter a valid YouTube video URL.
                  </Typography.Text>
                )}
                {responseMessage && (
                  <Typography.Text type="danger">
                    {responseMessage}
                  </Typography.Text>
                )}
                {!loading &&
                  ((videoDuration > 600 &&
                    user.partnerCode !== "edifiers123" &&
                    user.partnerCode !== "senacor123" &&
                    user.partnerCode !== "linguarte123") ||
                    (videoDuration > 1000 &&
                      (user.partnerCode === "edifiers123" ||
                        user.partnerCode === "senacor123")) ||
                    user.partnerCode !== "linguarte123") &&
                  inputValue.length > 0 &&
                  !user.subscribed &&
                  user.email !== "slavosmn@gmail.com" && (
                    <Modal
                      open={isDurationModalVisible}
                      onCancel={handleCloseDurationModal}
                      closable={true}
                      footer={false}
                      width="80%"
                      centered
                    >
                      <center>
                        <Typography.Title style={{ marginTop: "30px" }}>
                          Unfortunately, this video is longer than 10 minute.
                          For add this video upgrade your account.
                        </Typography.Title>
                      </center>
                      <PricingComponent />
                    </Modal>
                  )}
                <Form.Item
                  name="youtubeUrl"
                  style={{ textAlign: "left", marginTop: "10px" }}
                >
                  <Input
                    placeholder="YouTube Video URL"
                    value={inputValue}
                    onChange={handleInputChange}
                    size="large"
                  />
                </Form.Item>
                {/* <Spin spinning={loading} size="large">
                  {isFetchValid && inputValue && (
                    <Form.Item
                      style={{ textAlign: "left" }}
                      label={intl.formatMessage({ id: "translate.from" })}
                      name="language"
                    >
                      <LanguageSelector
                        useRecoil={false}
                        onLanguageChange={(language) => {
                          const option = selectOptions.find(
                            (option) => option.value === language
                          );
                          setSelectedOption(option || null);
                          handleLanguageSelection(language);
                          setButtonDisabled(
                            !option || !inputValue || !isFetchValid
                          );
                        }}
                        options={selectOptions}
                        style={{ marginTop: "-5px" }}
                      />
                    </Form.Item>
                  )}
                  </Spin> */}
                {
                  <Form.Item
                    style={{ textAlign: "left" }}
                    label={intl.formatMessage({ id: "translate.to" })}
                    name="language"
                  >
                    {/* <LanguageSelector
                      useRecoil={false}
                      disabledLanguage={selectedLanguageFrom}
                      onLanguageChange={(language) => {
                        setSelectedLanguageTo(language);
                      }}
                      text={""}
                      languageProp="targetLanguage"
                      style={{ marginTop: "-10px" }}
                    /> */}
                  </Form.Item>
                }
              </Form>
            </Col>
          </Row>
        </PageContainer>
      ),
    },
    /* {
      key: "2",
      label: "Book",
      children: (
        <Form
          preserve={false}
          {...layout}
          onFinish={handleFormSubmit}
          form={form}
        >
          <Form.Item>
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger
                name="bookFile"
                action={`${
                  import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
                }/library/add/book`}
                multiple={false}
                maxCount={1}
                withCredentials={true}
                customRequest={async ({ action, file, onSuccess, onError }) => {
                  const formData = new FormData();
                  formData.append("bookFile", file);

                  try {
                    const response = await fetch(action, {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                          "access_token"
                        )}`,
                      },
                      body: formData,
                    });

                    if (!response.ok) {
                      onError &&
                        onError(new Error("Error while uploading file."));
                      return;
                    }

                    const responseData = await response.json();
                    onSuccess && onSuccess(responseData);
                    setButtonDisabled(false);
                  } catch (error: any) {
                    onError && onError(error);
                  }
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </Form>
      ),
    }, */
  ];

  return (
    <Modal
      destroyOnClose
      open={isModalVisible}
      onCancel={handleModalCancelAndReset}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleButtonClick}
          disabled={buttonDisabled}
          loading={isLoading}
        >
          {isLoading ? "Adding..." : "Add Video"}
        </Button>,
      ]}
    >
      <Tabs
        style={{ marginTop: "0px" }}
        items={items}
        onChange={(activeKey) => setActiveTab(activeKey)}
      />
    </Modal>
  );
};

export default AddItemModal;
