import { Space } from "antd";
import React from "react";

import Avatar from "./AvatarDropdown";
import classes from "./index.module.less";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import SelectLang from "./SelectLang";

export type SiderTheme = "light" | "dark";

const GlobalHeaderRight: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

  const { settings } = user;
  let className = classes.right;

  return (
    <Space className={className}>
      <Avatar />

      <SelectLang className={classes.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
