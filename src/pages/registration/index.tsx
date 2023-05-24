import React, { FC } from "react";
import { Button, Form, Input, Tooltip, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LoginParams } from "@/models/login";
import { useRegistration } from "@/api";
import styles from "./index.module.less";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

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

    return e; // Return the event to ensure it is not prevented from updating the form's field value
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
    const { email, nickname, password } = form;

    const registrationForm = document.createElement("form");
    registrationForm.action = `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/api/sessions/register`;
    registrationForm.method = "POST";

    const emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "email";
    emailInput.value = email;

    const nicknameInput = document.createElement("input");
    nicknameInput.type = "hidden";
    nicknameInput.name = "nickname";
    nicknameInput.value = nickname;

    const passwordInput = document.createElement("input");
    passwordInput.type = "hidden";
    passwordInput.name = "password";
    passwordInput.value = password;

    registrationForm.appendChild(emailInput);
    registrationForm.appendChild(nicknameInput);
    registrationForm.appendChild(passwordInput);

    document.body.appendChild(registrationForm);
    registrationForm.submit();
    document.body.removeChild(registrationForm);
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.main}>
        <Form<LoginParams>
          onFinish={onFinished}
          action={`${
            import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
          }/api/sessions/register`}
          method="POST"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input size="large" placeholder="user@email.com" />
          </Form.Item>
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: "Please enter your nickname" }]}
          >
            <Input size="large" placeholder="name" />
          </Form.Item>
          <Form.Item
            hasFeedback
            /* rules={[
              {
                required: true,
                message: passwordStatus.help,
              },
            ]} */
            validateStatus={passwordStatus.validateStatus}
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

          <Form.Item>
            <Button
              size="large"
              className={styles.mainLoginBtn}
              htmlType="submit"
              type="primary"
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text className={styles.signInLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography.Text>
      </div>
    </div>
  );
};

export default RegistrationForm;
