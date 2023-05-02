import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { localeConfig } from "@/config/locale";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import skSK from "antd/es/locale/sk_SK";
import moment from "moment";
import RenderRouter from "./routes";
import { useRecoilState } from "recoil";
import { userState } from "./stores/user";
import { CookiesProvider } from "react-cookie";
import "./App.less";

const App: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

  const { locale } = user;

  useEffect(() => {
    if (locale.toLowerCase() === "en-us") {
      moment.locale("en");
    } else if (locale.toLowerCase() === "sk-sk") {
      moment.locale("sk");
    }
  }, [locale]);

  const getAntdLocale = () => {
    if (locale.toLowerCase() === "en-us") {
      return enUS;
    } else if (locale.toLowerCase() === "sk-sk") {
      return skSK;
    }
  };

  const getLocale = () => {
    const lang = localeConfig.find((item) => {
      return item.key === locale.toLowerCase();
    });

    return lang?.messages;
  };

  return (
    <CookiesProvider>
      <ConfigProvider
        locale={getAntdLocale()}
        componentSize="middle"
        theme={{
          components: {
            Button: {
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Tooltip: {
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Input: {
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Popover: {
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Radio: {
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
              borderRadius: 0,
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
            },
          },
        }}
      >
        <IntlProvider locale={locale.split("-")[0]} messages={getLocale()}>
          <BrowserRouter>
            <RenderRouter />
          </BrowserRouter>
        </IntlProvider>
      </ConfigProvider>
    </CookiesProvider>
  );
};

export default App;
