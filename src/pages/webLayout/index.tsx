import React, { FC, lazy, Suspense } from "react";
import Header from "./shared/components/Header";
import { useLocale } from "@/locales";
import PricingComponent from "./shared/components/Pricing/PricingComponent";
import CookieConsent from "react-cookie-consent";
import { Button } from "antd";
import Footer from "./shared/components/Footer";
import { useLocation } from "react-router-dom";

const WebLayoutPage: FC = () => {
  const Contact = lazy(() => import("./shared/components/ContactForm"));
  const MiddleBlock = lazy(() => import("./shared/components/MiddleBlock"));
  const Container = lazy(() => import("./shared/common/Container"));
  const ScrollToTop = lazy(() => import("./shared/common/ScrollToTop"));
  const ContentBlock = lazy(() => import("./shared/components/ContentBlock"));

  const location = useLocation();
  const message = location.state?.message;

  if (message) {
    alert(message); // Or however you want to display the notification
  }

  const { formatMessage } = useLocale();

  return (
    <Suspense>
      <CookieConsent
        location="bottom"
        buttonText={<Button type="primary">I understand</Button>}
        cookieName="VocabuliftCookieConsent"
        buttonStyle={{ background: "none", fontSize: "13px" }}
        expires={150}
      >
        We use cookies to improve your browsing experience, show you
        personalised content and targeted ads and to analyze the activity and
        source of our website traffic. For any further information, please
        consult our{" "}
        <a
          style={{ color: "white", textDecoration: "underline" }}
          href="/cookie-policy"
        >
          Cookies Policy
        </a>
        .
      </CookieConsent>
      <Header />
      <Container>
        <ScrollToTop />
        <ContentBlock
          type="right"
          title={formatMessage({ id: "web.introContent.title" })}
          content={formatMessage({ id: "web.introContent.text" })}
          button={"button"}
          icon="developer.webp"
          id="intro"
        />
        <MiddleBlock
          title={formatMessage({ id: "web.middleBlock.title" })}
          content={formatMessage({ id: "web.middleBlock.text" })}
          button={"GET STARTED FOR FREE"}
        />
        <ContentBlock
          type="middle"
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
        <ContentBlock
          type="browser"
          title={"title"}
          content={"content"}
          icon="product-launch.svg"
          id="mission"
        />
        <PricingComponent />
        <Contact title={"title"} content={"content"} id="contact" />
        <Footer />
      </Container>
    </Suspense>
  );
};

export default WebLayoutPage;
