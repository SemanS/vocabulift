import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Tabs } from "antd";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";
import { socket } from "@/messaging/socket";
import { v4 as uuidv4 } from "uuid";
import { Option } from "@/models/utils.interface";
import { postLibraryVideo } from "@/services/libraryService";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useCookies } from "react-cookie";

interface AddItemModalProps {
  isModalVisible: boolean;
  handleModalCancel: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  fetchOptions: (input: string) => void;
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

  useEffect(() => {
    console.log("activeTab" + activeTab);
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

  /* useEffect(() => {
    const updateButtonDisabled = () => {
      setButtonDisabled(localStorage.getItem("ongoingEventId") !== null);
    };
    updateButtonDisabled();
    window.addEventListener("storage", updateButtonDisabled);
    return () => {
      window.removeEventListener("storage", updateButtonDisabled);
    };
  }, []); */

  const handleLanguageSelection = (language: string) => {
    setSelectedLanguageFrom(language);
    onLanguageSelect(language);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      fetchOptions(e.target.value);
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
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
    form.resetFields(); // Reset the form fields
    resetFields(); // Reset the state values
    handleModalCancel(); // Close the modal
  };

  const handleButtonClick = async () => {
    form.submit();
  };

  const handleFormSubmit = async (values: any) => {
    const eventId = uuidv4();
    const { youtubeUrl, language } = values;
    const response = await postLibraryVideo(
      selectedLanguageFrom,
      targetLanguage,
      youtubeUrl
    );
    socket.emit("add-video", {
      eventId: eventId,
      input: youtubeUrl,
      sourceLanguage: selectedLanguageFrom,
      targetLanguage: targetLanguage,
    });
    localStorage.setItem("ongoingEventId", eventId);

    onAddItemClick(response.videoThumbnail);
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
        <Row gutter={[16, 16]} justify="center">
          <Col span={16} style={{ marginBottom: "24px", marginTop: "36px" }}>
            <Form
              preserve={false}
              {...layout}
              onFinish={handleFormSubmit}
              form={form}
              /* style={{ display: "inline-block" }} */
            >
              <Form.Item
                //label="Video URL"
                name="youtubeUrl"
                style={{ textAlign: "left" }}
              >
                <Input
                  placeholder="YouTube Video URL"
                  value={inputValue}
                  onChange={handleInputChange}
                  size="large"
                />
              </Form.Item>
              {isFetchValid && inputValue && (
                <Form.Item label="Translate from" name="language">
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
                  />
                </Form.Item>
              )}
              {inputValue && (
                <Form.Item label="Translate to" name="language">
                  <LanguageSelector
                    useRecoil={false}
                    disabledLanguage={targetLanguage}
                    onLanguageChange={(language) => {
                      console.log("Source language changed to", language);
                    }}
                    text={""}
                    languageProp="targetLanguage"
                  />
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Book",
      children: (
        <Form
          preserve={false}
          {...layout}
          onFinish={handleFormSubmit}
          form={form}
          /* style={{ display: "inline-block" }} */
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
    },
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
