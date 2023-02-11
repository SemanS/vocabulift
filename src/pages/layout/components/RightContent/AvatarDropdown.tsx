import React, { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Menu, Spin } from "antd";

import HeaderDropdown from "../HeaderDropdown";
import classes from "./index.module.less";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { useCookies } from "react-cookie";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const [user, setUser] = useRecoilState(userState);
  const [cookies, setCookie] = useCookies(["access_token"]);

  const { username, avatar } = user;

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Logout
   */
  const loginOut = async () => {
    // Note: There may be security issues, please note
    if (cookies.access_token) {
      setCookie("access_token", "", { expires: new Date(0) });
    }
    sessionStorage.clear;
    useCookies;
    if (location.pathname !== "/login") {
      navigate("/login", {
        replace: true,
      });
    }
  };

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;
      if (key === "logout" && user) {
        setUser({ ...user, logged: false });
        loginOut();
        return;
      }
      navigate(`/account/${key}`);
    },
    [user, setUser]
  );

  const loading = (
    <span className={`account`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!user) {
    return loading;
  }

  if (!username) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={"menu"} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Sign Out
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${classes.action} ${classes.account}`}>
        <Avatar
          size="small"
          className={classes.avatar}
          src={avatar}
          alt="avatar"
        />
        <span className={`${classes.name} anticon`}>{username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
