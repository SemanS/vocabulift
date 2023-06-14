import React from "react";
import { Dropdown } from "antd";
import { ReactComponent as LanguageSvg } from "@/assets/header/language.svg";
import classes from "./index.module.less";
import { localeConfig } from "@/config/locale";
import { useLocale } from "@/locales";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { User } from "@/models/user";
import { updateUser } from "@/services/userService";
import { parseLocale } from "@/utils/stringUtils";

interface SelectLangProps {
  className?: string;
}

const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { formatMessage } = useLocale();
  const [user, setUser] = useRecoilState(userState);

  const { locale, settings } = user;
  let className = "";

  const selectLocale = async ({ key }: { key: any }) => {
    const updatedUserEntity: Partial<User> = {
      locale: key,
    };
    await updateUser(updatedUserEntity);
    setUser({ ...user, locale: key });
    localStorage.setItem("locale", key);
  };

  if (
    (settings.navTheme === "realDark" && settings.layout === "top") ||
    settings.layout === "mix"
  ) {
    className = `dark`;
  }

  const items = localeConfig.map((lang) => {
    return {
      key: lang.key,
      disabled: locale === lang.key,
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
