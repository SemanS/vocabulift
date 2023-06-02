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

interface AddItemModalProps {
  isModalVisible: boolean;
  handleModalCancel: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  fetchOptions: (input: string) => Promise<void>;
  isFetchValid: boolean;
  selectOptions: any[];
  targetLanguage: string;
  onLanguageSelect: (language: string) => void;
  onAddItemClick: (videoThumbnail: string) => void; // add this prop
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isModalVisible,
  handleModalCancel,
  inputValue,
  setInputValue,
  fetchOptions,
  isFetchValid,
  selectOptions,
  targetLanguage,
  onLanguageSelect,
  onAddItemClick,
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
  }, [activeTab]);

  const handleLanguageSelection = (language: string) => {
    setSelectedLanguageFrom(language);
    onLanguageSelect(language);
  };

  useEffect(() => {
    console.log("inputValue prop", inputValue);
  }, [inputValue]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
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
    const response = await postLibraryVideo(
      selectedLanguageFrom,
      targetLanguage,
      youtubeUrl
    );

    const { videoThumbnail, eventId } = response;

    socket.emit("add-video", {
      input: youtubeUrl,
      eventId: eventId,
      sourceLanguage: selectedLanguageFrom,
      targetLanguage: targetLanguage,
    });
    localStorage.setItem("ongoingEventId", eventId);

    onAddItemClick(videoThumbnail);
    handleModalCancelAndReset();
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
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
                {!loading && !isFetchValid && inputValue.length > 0 && (
                  <Typography.Text>
                    Unfortunately, this video does not contain any subtitles.
                    Try adding another video.
                  </Typography.Text>
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
                <Spin spinning={loading} size="large">
                  {isFetchValid && inputValue && (
                    <Form.Item
                      style={{ textAlign: "left" }}
                      label="Translate from"
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
                  {inputValue && (
                    <Form.Item
                      style={{ textAlign: "left" }}
                      label="Translate to"
                      name="language"
                    >
                      <LanguageSelector
                        useRecoil={false}
                        disabledLanguage={targetLanguage}
                        onLanguageChange={(language) => {
                          console.log("Source language changed to", language);
                        }}
                        text={""}
                        languageProp="targetLanguage"
                        style={{ marginTop: "-10px" }}
                      />
                    </Form.Item>
                  )}
                </Spin>
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
        >
          Add
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
