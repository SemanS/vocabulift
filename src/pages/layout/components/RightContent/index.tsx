import { Space } from "antd";
import React, { ReactNode } from "react";

import Avatar from "./AvatarDropdown";
import classes from "./index.module.less";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import SelectLang from "./SelectLang";
import { useNavigate } from "react-router";
import styles from "./index.module.less";
import classNames from "classnames";

export type SiderTheme = "light" | "dark";

interface GlobalHeaderRightProps {
  children?: ReactNode;
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const { settings } = user;
  let className = classes.right;

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Space className={className}>
      {children}
      {user.isLogged ? (
        <Avatar />
      ) : (
        <div
          onClick={handleLoginClick}
          className={classNames(styles.loginLink)}
        >
          Log In
        </div>
      )}
      <SelectLang />
    </Space>
  );
};
export default GlobalHeaderRight;
