import React, { FC, useState, useEffect, createRef } from "react";
import { Card, Col, Form, Input, Row, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.less";
import { useCookies } from "react-cookie";
import { vocabuFetch } from "@/utils/vocabuFetch";

const VerificationPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [inputs, setInputs] = useState(Array(6).fill(""));
  const inputRefs = Array(6)
    .fill(0)
    .map((_, i) => createRef<Input>());

  const [cookies] = useCookies(["access_token"]);
  const [formError, setFormError] = useState<{
    status: boolean;
    message: string;
  }>({ status: false, message: "" });

  const onFinished = async (form: any) => {
    // form contains a 6 digit number
    const verificationCode = Object.values(form).join("");

    try {
      const response = await vocabuFetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/api/sessions/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.access_token}`,
          },
          body: JSON.stringify({ code: verificationCode }),
        }
      );

      console.log("response.status" + JSON.stringify(response.status, null, 2));
      if (response.status == 200) {
        const from = location.state?.from || { pathname: "/activation" };
        navigate(from);
      } else {
        setFormError({
          status: true,
          message:
            "It seems the code is invalid. Check the code or request a new one.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (i: number) => (e) => {
    if (formError.status) {
      setFormError({ status: false, message: "" });
    }
    const { value } = e.target;
    const reg = /^[0-9]$/; // Regular expression to allow only single digits
    if (reg.test(value) || value === "") {
      let newInputs = [...inputs];
      newInputs[i] = value;
      setInputs(newInputs);
      if (value !== "" && i < 5) {
        inputRefs[i + 1].current!.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (inputs.filter((input) => input !== "").length === 6) {
      const verificationCode = inputs.join("");
      onFinished(verificationCode);
    }
  }, [inputs]);

  const handlePaste = (i: number) => (e: React.ClipboardEvent) => {
    e.preventDefault();

    // Get pasted data
    let paste = e.clipboardData.getData("text");

    // Filter out non-digit characters
    let pasteDigits = paste.split("").filter((char) => /^[0-9]$/.test(char));

    // If we are pasting into the first box, distribute the number across the inputs
    if (i === 0) {
      let newInputs = pasteDigits.slice(0, 6);
      setInputs(newInputs);

      // Also update form values
      let newFormValues = newInputs.reduce((values, input, index) => {
        values[`digit${index + 1}`] = input;
        return values;
      }, {});

      form.setFieldsValue(newFormValues);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^[0-9]$/i.test(keyValue)) event.preventDefault();
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  return (
    <div className={styles.container}>
      <Row justify="center" align="middle">
        <Card>
          <div style={{ textAlign: "center" }}>
            <Typography.Title>Email Verification</Typography.Title>
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography.Text>We sent a 6 digit code to</Typography.Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography.Text>slavosmn@gmail.com</Typography.Text>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Typography.Text>
              For security reasons, the code will expire in 30 minutes.
            </Typography.Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography.Text>
              Keep this window open while checking your code.
            </Typography.Text>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Typography.Text>
              Enter the 6-digit verification code below:
            </Typography.Text>
          </div>
          <Form form={form} onFinish={onFinished}>
            <Row gutter={8} justify="center">
              {[...Array(6)].map((_, i) => (
                <Col key={i}>
                  <Form.Item name={`digit${i + 1}`} initialValue={inputs[i]}>
                    <Input
                      ref={inputRefs[i]}
                      maxLength={1}
                      onChange={handleChange(i)}
                      onPaste={handlePaste(i)}
                      onKeyPress={handleKeyPress} // add this line
                      onClick={handleClick} // add this line
                      size="large"
                      style={{
                        width: "40px",
                        textAlign: "center",
                      }}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
            {formError.status && (
              <div style={{ color: "red", textAlign: "center" }}>
                {formError.message}
              </div>
            )}
          </Form>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Typography.Text>Didn't receive an email?</Typography.Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography.Text>
              Check your spam folder too. Didn`t get the code? Resend the code.
            </Typography.Text>
          </div>
        </Card>
      </Row>
    </div>
  );
};

export default VerificationPage;
