import React, { FC } from "react";
import { Button, Divider, Form, Input, Tooltip, Typography } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LoginParams } from "@/models/login";
import { useLogin } from "@/api";
import styles from "./index.module.less";
import { ReactComponent as LogoSvg } from "@/assets/logo/logo_tooltip.svg";
import { getGoogleUrl } from "@/utils/getGoogleUrl";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ReactComponent as GoogleIcon } from "@/assets/logo/google_icon.svg";

const LoginForm: FC = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = ((location.state as any)?.from.pathname as string) || "/library";

  const [passwordStatus, setPasswordStatus] = React.useState({
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

  const handlePasswordChange = (e) => {
    const password = e.target.value;

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
        //help: "Your password must contain at least: 8 characters, 1 number, 1 uppercase character, 1 lowercase character",
      });
    }
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
    const { email, password } = form;

    const loginForm = document.createElement("form");
    loginForm.action = `${
      import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
    }/api/sessions/login`;
    loginForm.method = "POST";

    const emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "email";
    emailInput.value = email;

    const passwordInput = document.createElement("input");
    passwordInput.type = "hidden";
    passwordInput.name = "password";
    passwordInput.value = password;

    loginForm.appendChild(emailInput);
    loginForm.appendChild(passwordInput);

    document.body.appendChild(loginForm);
    loginForm.submit();
    document.body.removeChild(loginForm);
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
          }/api/sessions/login`}
          method="POST"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input size="large" placeholder="user@email.com" />
          </Form.Item>
          <Form.Item
            hasFeedback
            rules={[
              {
                required: true,
                message: passwordStatus.help,
              },
            ]}
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
              <Input
                name="password"
                type="password"
                size="large"
                placeholder="password"
                onChange={handlePasswordChange}
              />
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              className={styles.mainLoginBtn}
              htmlType="submit"
              type="primary"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        {/* <Typography.Text className={styles.signInLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography.Text> */}
        <Divider plain>OR</Divider>
        <Button
          size="large"
          href={getGoogleUrl(from)}
          style={{ textDecoration: "none" }}
          className={`${styles.mainLoginBtn} ${styles.flexContainer}`}
        >
          <GoogleIcon className={styles.googleIcon} />
          <Typography.Text className={styles.flexItem}>
            Continue with Google
          </Typography.Text>
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
