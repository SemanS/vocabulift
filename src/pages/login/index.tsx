import React, { FC } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LoginParams } from "@/models/login";
// import { loginAsync } from '@/stores/user.store';
// import { useAppDispatch } from '@/stores';
import { Location } from "history";
import { useLogin } from "@/api";

import styles from "./index.module.less";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import axios from "axios";
import { getGoogleUrl } from "@/utils/getGoogleUrl";

const initialValues: LoginParams = {
  username: "guest",
  password: "guest",
  // remember: true
};

const LoginForm: FC = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  //const location = useLocation() as Location<{ from: string }>;

  // const dispatch = useAppDispatch();

  const from = ((location.state as any)?.from.pathname as string) || "/books";

  const onFailure = (response: any) => {
    console.error(response);
  };

  const onFinished = async (form: LoginParams) => {
    const result = await loginMutation.mutateAsync(form);
    console.log("result: ", result);

    //if (result) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.username);

    const from = location.state?.from || { pathname: "/dashboard" };
    navigate(from);
    //}
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
        <Form<LoginParams> onFinish={onFinished} initialValues={initialValues}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input size="large" placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input type="password" size="large" placeholder="密码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember</Checkbox>
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
      </div>
      <Button size="large" type="primary" href={getGoogleUrl(from)}>
        Google
      </Button>{" "}
    </div>
  );
};

export default LoginForm;
