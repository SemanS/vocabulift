import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Tabs } from "antd";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";
import { socket } from "@/messaging/socket";
import { v4 as uuidv4 } from "uuid";
import { Option } from "@/models/utils.interface";
import { postLibraryVideo } from "@/services/libraryService";

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
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { marginBottom: "16px" },
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState<string>("");

  useEffect(() => {
    const updateButtonDisabled = () => {
      setButtonDisabled(localStorage.getItem("ongoingEventId") !== null);
    };

    // Update buttonDisabled state initially
    updateButtonDisabled();

    // Update buttonDisabled state on storage changes
    window.addEventListener("storage", updateButtonDisabled);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("storage", updateButtonDisabled);
    };
  }, []);

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

  const [form] = Form.useForm(); // Add this line to get the form instance

  const resetFields = () => {
    setInputValue("");
    setSelectedOption(null);
    setButtonDisabled(true);
    form.resetFields(); // Add this line to reset the form fields
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

  const items = [
    {
      key: "1",
      label: "Video",
      children: (
        <Row gutter={24}>
          <Col span={24} style={{ marginBottom: "24px" }}>
            <Form
              preserve={false}
              {...layout}
              onFinish={handleFormSubmit}
              form={form}
              style={{ display: "inline-block", width: "100%" }}
            >
              <Form.Item
                label="Video URL"
                name="youtubeUrl"
                style={{ textAlign: "left" }}
              >
                <Input
                  placeholder="YouTube Video URL"
                  value={inputValue}
                  onChange={handleInputChange}
                  size="middle"
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
      label: "Text",
      children: null,
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
          Add Video
        </Button>,
      ]}
    >
      <Tabs style={{ marginTop: "0px" }} items={items} />
    </Modal>
  );
};

export default AddItemModal;
