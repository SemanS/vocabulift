import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { localeConfig } from "./config/locale";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import skSK from "antd/es/locale/sk_SK";
import esES from "antd/es/locale/es_ES";
import frFR from "antd/es/locale/fr_FR";
import deDE from "antd/es/locale/de_DE";
import csCZ from "antd/es/locale/cs_CZ";
import plPL from "antd/es/locale/pl_PL";
import huHU from "antd/es/locale/hu_HU";
import itIT from "antd/es/locale/it_IT";
import zhCN from "antd/es/locale/zh_CN";
import ukUA from "antd/es/locale/uk_UA";
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
    switch (locale) {
      case "en-US":
        moment.locale("en");
        break;
      case "es-ES":
        moment.locale("es");
        break;
      case "fr-FR":
        moment.locale("fr");
        break;
      case "de-DE":
        moment.locale("de");
        break;
      case "cs-CZ":
        moment.locale("cs");
        break;
      case "sk-SK":
        moment.locale("sk");
        break;
      case "pl-PL":
        moment.locale("pl");
        break;
      case "hu-HU":
        moment.locale("hu");
        break;
      case "it-IT":
        moment.locale("it");
        break;
      case "zh-CN":
        moment.locale("cn");
        break;
      case "uk-UA":
        moment.locale("uk");
        break;
      default:
        moment.locale("en");
    }
  }, [locale]);

  const getAntdLocale = () => {
    switch (locale) {
      case "en-US":
        return enUS;
      case "es-ES":
        return esES;
      case "fr-FR":
        return frFR;
      case "de-DE":
        return deDE;
      case "cs-CZ":
        return csCZ;
      case "sk-SK":
        return skSK;
      case "pl-PL":
        return plPL;
      case "hu-HU":
        return huHU;
      case "it-IT":
        return itIT;
      case "zh-CN":
        return zhCN;
      case "uk-UA":
        return ukUA;
      default:
        return enUS;
    }
  };

  const getLocale = () => {
    const lang = localeConfig.find((item) => {
      return item.key === locale;
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
            Select: {
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Dropdown: {
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Card: {
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Tabs: {
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
            Modal: {
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
              borderRadius: 0,
              borderRadiusXS: 0,
              borderRadiusOuter: 0,
              borderRadiusSM: 0,
              borderRadiusLG: 0,
            },
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
              colorPrimary: "#0D0C1D",
              colorPrimaryHover: "#0D0C1D",
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
              colorPrimary: "#2c4e80",
              colorPrimaryHover: "#2c4e80",
            },
          },
        }}
      >
        <IntlProvider
          locale={locale ? locale.split("-")[0] : "en"}
          messages={getLocale()}
        >
          <BrowserRouter>
            <RenderRouter />
          </BrowserRouter>
        </IntlProvider>
      </ConfigProvider>
    </CookiesProvider>
  );
};

export default App;
