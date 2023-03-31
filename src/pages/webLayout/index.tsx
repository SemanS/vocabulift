import React, { FC, lazy, Suspense, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import LandingPage from "@/pages/landingPage/LandingPage";
import RightContent from "@/pages/layout/components/RightContent";
import Footer from "@/pages/layout/components/Footer";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import { ConfigProvider, Space } from "antd";
import { Settings as LayoutSettings } from "@ant-design/pro-layout";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import styles from "./index.module.less";
import Header from "./shared/components/Header";
import { useLocale } from "@/locales";
import { IntlProvider } from "react-intl";
import moment from "moment";
import enUS from "antd/es/locale/en_US";
import skSK from "antd/es/locale/sk_SK";
import { localeConfig } from "@/config/locale";
import classes from "./index.module.less";

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: "light",
  // 拂晓蓝
  //primaryColor: "#1890ff"
  layout: "top",
  contentWidth: "Fluid",
  fixedHeader: false,
  colorWeak: false,
  //title: "VocabuLift",
  pwa: false,
  iconfontUrl: "",
};

const WebLayoutPage: FC = () => {
  const Contact = lazy(() => import("./shared/components/ContactForm"));
  const MiddleBlock = lazy(() => import("./shared/components/MiddleBlock"));
  const Container = lazy(() => import("./shared/common/Container"));
  const ScrollToTop = lazy(() => import("./shared/common/ScrollToTop"));
  const ContentBlock = lazy(() => import("./shared/components/ContentBlock"));

  const { formatMessage } = useLocale();

  return (
    <Suspense>
      <Header />
      <Container>
        <ScrollToTop />
        <ContentBlock
          type="right"
          title={formatMessage({ id: "web.introContent.title" })}
          content={formatMessage({ id: "web.introContent.text" })}
          button={"button"}
          icon="developer.svg"
          id="intro"
        />
        <MiddleBlock
          title={formatMessage({ id: "web.middleBlock.title" })}
          content={formatMessage({ id: "web.middleBlock.text" })}
          button={"button"}
        />
        <ContentBlock
          type="left"
          title={"title"}
          content={"content"}
          section={"section"}
          icon="graphs.svg"
          id="about"
        />
        <ContentBlock
          type="right"
          title={"title"}
          content={"content"}
          icon="product-launch.svg"
          id="mission"
        />
        <ContentBlock
          type="left"
          title={"title"}
          content={"content"}
          icon="waving.svg"
          id="product"
        />
        <Contact title={"title"} content={"content"} id="contact" />
      </Container>
    </Suspense>
  );
};

export default WebLayoutPage;
