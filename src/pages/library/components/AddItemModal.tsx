import React, { useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Tabs } from "antd";
import LanguageSelector from "@/pages/bookDetail/components/LanguageSelector/LanguageSelector";

const { TabPane } = Tabs;

interface AddItemModalProps {
  isModalVisible: boolean;
  handleModalCancel: () => void;
  handleButtonClick: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  fetchOptions: (input: string) => void;
  isFetchValid: boolean;
  selectOptions: any[];
  targetLanguage: string;
  onLanguageSelect: (language: string) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isModalVisible,
  handleModalCancel,
  handleButtonClick,
  inputValue,
  setInputValue,
  fetchOptions,
  isFetchValid,
  selectOptions,
  targetLanguage,
  onLanguageSelect,
}) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { marginBottom: "16px" },
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState<string>("");

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
  };

  const handleModalCancelAndReset = () => {
    handleModalCancel();
    resetFields();
  };

  return (
    <Modal
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
      <Tabs style={{ marginTop: "0px" }}>
        <TabPane tab="Video" key="1">
          <Row gutter={24}>
            <Col span={24} style={{ marginBottom: "24px" }}>
              <Form
                {...layout}
                onFinish={(values) => {}}
                style={{ display: "inline-block", width: "100%" }}
              >
                <Form.Item
                  label="Video URL"
                  name="youtubeUrl"
                  rules={[
                    {
                      required: true,
                      message: "Please input the YouTube video URL",
                    },
                  ]}
                  style={{ textAlign: "left" }}
                >
                  <Input
                    placeholder="YouTube Video URL"
                    value={inputValue}
                    onChange={handleInputChange}
                    size="middle"
                  />
                </Form.Item>
                {isFetchValid && (
                  <Form.Item
                    label="Translate from"
                    name="language"
                    rules={[
                      {
                        required: true,
                        message: "Please input the YouTube video URL",
                      },
                    ]}
                  >
                    <LanguageSelector
                      useRecoil={false}
                      initialLanguage={""}
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
                <Form.Item
                  label="Translate to"
                  name="language"
                  rules={[
                    {
                      required: true,
                      message: "Please input the YouTube video URL",
                    },
                  ]}
                >
                  <LanguageSelector
                    useRecoil={false}
                    initialLanguage="EN"
                    disabledLanguage={targetLanguage}
                    onLanguageChange={(language) => {
                      console.log("Source language changed to", language);
                    }}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Text" key="2"></TabPane>
      </Tabs>
    </Modal>
  );
};

export default AddItemModal;
