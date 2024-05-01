import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { ReactComponent as LanguageSvg } from "@/assets/header/language.svg";
import classes from "./index.module.less";
import { localeConfig } from "@/config/locale";
import { useLocale } from "@/locales";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { updateUser } from "@/services/userService";
import { DownOutlined } from "@ant-design/icons";

const SelectLang = () => {
  const [user, setUser] = useRecoilState(userState);

  const selectLocale = async ({ key }) => {
    await updateUser({ locale: key });
    setUser((prev) => ({ ...prev, locale: key }));
    localStorage.setItem("locale", key);
  };

  const items = localeConfig.map((lang) => ({
    key: lang.key,
    disabled: user.locale === lang.key,
    label: lang.icon,
    onClick: () => selectLocale({ key: lang.key }),
  }));

  const currentLangIcon = localeConfig.find((lang) => lang.key === user.locale);

  return (
    <div
      style={{
        position: "fixed",
        top: "22px",
        left: "49.6%",
        transform: "translateX(-50%)",
        zIndex: 1001,
      }}
    >
      <Dropdown
        overlay={<Menu items={items} />}
        trigger={["click"]}
        arrow={true}
        placement="bottom"
        overlayStyle={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          overflow: "hidden",
        }} // Inline styles for Menu
      >
        <Button
          size="large"
          //shape="round"
          className={classes.actionButton}
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 5px DimGrey",
            border: "none", // Optional: Removes the border for a cleaner look
          }}
        >
          <DownOutlined />
          <span>Native language: </span>
          <span
            style={{
              marginLeft: "4px",
              marginRight: "6px",
              fontWeight: "bold",
            }}
          >
            {currentLangIcon?.name}
          </span>
          {currentLangIcon?.icon}
        </Button>
      </Dropdown>
    </div>
  );
};

export default SelectLang;
