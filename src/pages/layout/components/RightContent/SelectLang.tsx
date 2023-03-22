import React from "react";
import { Dropdown } from "antd";
import { ReactComponent as LanguageSvg } from "@/assets/header/language.svg";
import classes from "./index.module.less";
import { localeConfig } from "@/config/locale";
import { useLocale } from "@/locales";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";

interface SelectLangProps {
  className?: string;
}

const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { formatMessage } = useLocale();
  const [user, setUser] = useRecoilState(userState);

  const { locale, settings } = user;
  let className = "";

  const selectLocale = ({ key }: { key: any }) => {
    setUser({ ...user, locale: key });
    localStorage.setItem("locale", key);
  };

  if (
    (settings.navTheme === "dark" && settings.layout === "top") ||
    settings.layout === "mix"
  ) {
    className = `dark`;
  }

  const items = localeConfig.map((lang) => {
    return {
      key: lang.key,
      disabled: locale.toLowerCase() === lang.key,
      label: (
        <>
          {lang.icon} {lang.name}
        </>
      ),
      onClick: selectLocale,
    };
  });

  return (
    <Dropdown
      placement="bottomRight"
      className={classes.action}
      menu={{ items }}
      trigger={["click"]}
    >
      <span id="language-change" className={classes.lang}>
        <LanguageSvg className={`anticon `} />
      </span>
    </Dropdown>
  );
};

export default SelectLang;
