import React, { FC, lazy, Suspense, useEffect, useState } from "react";
import Header from "./shared/components/Header";
import { useLocale } from "@/locales";
import PricingComponent from "./shared/components/Pricing/PricingComponent";
import CookieConsent from "react-cookie-consent";
import { Button, notification } from "antd";
import Footer from "./shared/components/Footer";

const WebLayoutPage: FC = () => {
  const Contact = lazy(() => import("./shared/components/ContactForm"));
  const MiddleBlock = lazy(() => import("./shared/components/MiddleBlock"));
  const Container = lazy(() => import("./shared/common/Container"));
  const ScrollToTop = lazy(() => import("./shared/common/ScrollToTop"));
  const ContentBlock = lazy(() => import("./shared/components/ContentBlock"));

  useEffect(() => {
    if (
      localStorage.getItem("hasNotified") &&
      localStorage.getItem("hasNotified") === "false"
    ) {
      notification.open({
        message: "Registration successful!",
        description: "Please check your email.",
        placement: "top",
      });

      // Store a flag in localStorage so we know the notification has been shown
      localStorage.removeItem("hasNotified");
    }
  }, [localStorage]);

  // Reset the flag when the component is unmounted
  useEffect(() => {
    return () => {
      localStorage.removeItem("hasNotified");
    };
  }, []);

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
          title={"Unleash Your Language Skills with AI"}
          content={
            "Embark on an immersive language adventure that harnesses the power of AI. Transform video texts into your personal linguistic playground, cultivating a rich vocabulary landscape as you traverse the world of languages."
          }
          button={"button"}
          icon="developer.webp"
          id="intro"
        />
        <MiddleBlock
          //title={formatMessage({ id: "web.middleBlock.title" })}
          title={"Pioneering the Future of Language Learning with AI"}
          content={
            "Embrace an innovative language learning path powered by leading-edge AI. Start for free. Also, find us on ProductHunt."
          }
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
