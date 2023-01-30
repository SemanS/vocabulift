import React, { Suspense, useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IntlProvider } from "react-intl";

import { localeConfig } from "@/config/locale";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import RenderRouter from "./routes";

import "./App.less";

import { useGetCurrentUser } from "./api";
import { createBrowserHistory } from "history";
import { useRecoilState } from "recoil";
import { userState } from "./stores/user";
import { CookiesProvider, useCookies } from "react-cookie";

const history = createBrowserHistory();

const App: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [cookies] = useCookies(["access_token"]);

  const { locale } = user;

  useEffect(() => {
    if (import.meta.env.MODE == "development") {
      sessionStorage.setItem("token", cookies.access_token);
    }
  }, [cookies.access_token]);

  useEffect(() => {
    if (locale.toLowerCase() === "en-us") {
      moment.locale("en");
    } else if (locale.toLowerCase() === "zh-cn") {
      moment.locale("zh");
    }
  }, [locale]);

  const getAntdLocale = () => {
    if (locale.toLowerCase() === "en-us") {
      return enUS;
    } else if (locale.toLowerCase() === "zh-cn") {
      return zhCN;
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
      <ConfigProvider locale={getAntdLocale()} componentSize="middle">
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
