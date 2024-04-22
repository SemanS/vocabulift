import React, { FC } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LoginParams } from "@/models/login";
import { useRegistration } from "@/api";
import styles from "./index.module.less";
import { ReactComponent as LogoSvg } from "@/assets/logo/logo_tooltip.svg";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getGoogleUrl } from "@/utils/getGoogleUrl";
import { ReactComponent as GoogleIcon } from "@/assets/logo/google_icon.svg";

const RegistrationForm: FC = () => {
  const loginMutation = useRegistration();
  const navigate = useNavigate();
  const location = useLocation();

  const from = ((location.state as any)?.from.pathname as string) || "/library";

  type ValidateStatus =
    | ""
    | "success"
    | "warning"
    | "error"
    | "validating"
    | undefined;

  const [passwordStatus, setPasswordStatus] = React.useState<{
    validateStatus: ValidateStatus;
    help: string;
  }>({
    validateStatus: undefined,
    help: "",
  });

  const [partnerCode, setPartnerCode] = React.useState("");

  const [passwordRequirements, setPasswordRequirements] = React.useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
  });

  const validatePassword = (password: string) => {
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegEx.test(password);
  };
  const [password, setPassword] = React.useState("");

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    setPassword(password);

    setPasswordRequirements({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
    });

    if (validatePassword(password)) {
      setPasswordStatus({
        validateStatus: "success",
        help: "",
      });
    } else {
      setPasswordStatus({
        validateStatus: "error",
        help: "Your password must contain at least: 8 characters, 1 number, 1 uppercase character, 1 lowercase character",
      });
    }

    return password;
  };

  const generateRequirementStatus = (isValid, requirement) => {
    return isValid ? (
      <div style={{ color: "green" }}>
        <CheckCircleOutlined /> {requirement}
      </div>
    ) : (
      <div style={{ color: "red" }}>
        <CloseCircleOutlined /> {requirement}
      </div>
    );
  };

  const onFailure = (response: any) => {
    console.error(response);
  };

  const onFinished = async (form: LoginParams) => {
    const { email, password: passwordForm, nickname } = form;

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/api/sessions/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username: nickname,
          password: password,
          partnerCode: partnerCode,
        }),
        credentials: "include",
      }
    );

    if (response.status === 200) {
      localStorage.setItem("hasNotified", "false");

      navigate("/verification", {
        state: { message: "Please check your email." },
      });
    } else if (response.status === 409) {
      notification.error({
        message: "Registration Failed",
        description: "User with this email already exists.",
        placement: "top",
      });
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <Form<LoginParams>
            {...formItemLayout}
            onFinish={onFinished}
            labelWrap
            action={`${
              import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
            }/api/sessions/register`}
            method="POST"
            style={{
              margin: "auto",
              maxWidth: "800px",
              marginLeft: "-90px",
              width: "450px",
            }}
          >
            <Form.Item
              wrapperCol={{
                xs: { span: 16, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              {/* <Link to="/">
                <LogoSvg className={styles.logo} />
                <span className={styles.title}>VocabuLift</span>
              </Link> */}
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <LogoSvg className={styles.logo} />
                    <span className={styles.title}>VocabuLift</span>
                  </Link>
                </div>
                <div className={styles.desc}>
                  Words that last, vocabulary that stays
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label="Code (Optional)"
              name="partner"
              rules={[
                {
                  required: false,
                  message: "Enter the code provided by your partner.",
                },
              ]}
            >
              <Input
                name={partnerCode}
                size="large"
                placeholder="Partner's program code"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
              />
            </Form.Item>
            <Divider />
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter email" }]}
            >
              <Input size="large" placeholder="user@email.com" />
            </Form.Item>
            {/* <Form.Item
              label="Nickname"
              name="nickname"
              rules={[
                { required: false, message: "Please enter your nickname" },
              ]}
            >
              <Input size="large" placeholder="name" />
            </Form.Item> */}
            <Form.Item
              label="Password"
              name="password"
              hasFeedback
              validateStatus={passwordStatus.validateStatus}
              required={true}
            >
              <Tooltip
                title={
                  passwordStatus.validateStatus === "error" ? (
                    <div>
                      {generateRequirementStatus(
                        passwordRequirements.length,
                        "At least 8 characters"
                      )}
                      {generateRequirementStatus(
                        passwordRequirements.number,
                        "Contains a number"
                      )}
                      {generateRequirementStatus(
                        passwordRequirements.uppercase,
                        "Contains an uppercase letter"
                      )}
                      {generateRequirementStatus(
                        passwordRequirements.lowercase,
                        "Contains a lowercase letter"
                      )}
                    </div>
                  ) : (
                    ""
                  )
                }
                open={
                  passwordStatus.validateStatus === "error" &&
                  (passwordRequirements.length ||
                    passwordRequirements.number ||
                    passwordRequirements.uppercase ||
                    passwordRequirements.lowercase)
                }
              >
                <Input.Password
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  size="large"
                  placeholder="password"
                  onChange={handlePasswordChange}
                />
              </Tooltip>
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              hasFeedback
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || password === value) {
                      // use password state
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                placeholder="Confirm password"
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button
                size="large"
                className={styles.mainLoginBtn}
                htmlType="submit"
                type="primary"
              >
                Sign up
              </Button>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Typography.Text className={styles.signInLink}>
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography.Text>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button
                size="large"
                href={getGoogleUrl(from, partnerCode)}
                style={{ textDecoration: "none" }}
                className={`${styles.mainLoginBtn} ${styles.flexContainer}`}
              >
                <GoogleIcon className={styles.googleIcon} />
                <Typography.Text className={styles.flexItem}>
                  Continue with Google
                </Typography.Text>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
