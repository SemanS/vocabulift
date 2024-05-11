import React, {
  FC,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import Header from "./shared/components/Header";
import { useLocale } from "@/locales";
import PricingComponent from "./shared/components/Pricing/PricingComponent";
import CookieConsent from "react-cookie-consent";
import { Button, notification } from "antd";
import Footer from "./shared/components/Footer";
import { getFlagCode } from "@/utils/utilMethods";
import { SvgIcon } from "./shared/common/SvgIcon";

const WebLayoutPage: FC = () => {
  const Contact = lazy(() => import("./shared/components/ContactForm"));
  const MiddleBlock = lazy(() => import("./shared/components/MiddleBlock"));
  const Container = lazy(() => import("./shared/common/Container"));
  const ScrollToTop = lazy(() => import("./shared/common/ScrollToTop"));
  const ContentBlock = lazy(() => import("./shared/components/ContentBlock"));

  const scrollToContact = useCallback(() => {
    if (window.location.hash === "#contact") {
      setTimeout(() => {
        const contactElement = document.getElementById("contact");
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 550);
    }
  }, []);

  useEffect(() => {
    // Call it on component mount
    scrollToContact();
  }, [scrollToContact]);

  useEffect(() => {
    // Add event listener for hash changes
    window.addEventListener("hashchange", scrollToContact, false);

    return () => {
      // Clean up event listener
      window.removeEventListener("hashchange", scrollToContact, false);
    };
  }, [scrollToContact]);

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
        {/* <MiddleBlock
          title={
            <>
              {getFlagCode("UA") && (
                <SvgIcon code={getFlagCode("uk")} height="96" width="128" />
              )}
              {" We help Ukrainian"}
            </>
          }
          content={
            <>
              We are thrilled to announce that we've added Ukrainian to our
              selection of languages! Are you a Ukrainian language enthusiast?{" "}
              <a href="#contact">Contact us</a> now and receive a free one-month
              LINGUIST subscription as part of our support for Ukrainian
              learners.
            </>
          }
        /> */}
        <ContentBlock
          type="right"
          title={"First-of-its-Kind"}
          content={
            "Turn YouTube videos into your personal language lab and speed up your learning—three times faster than Duolingo! Highlight any word or phrase for instant native explanations. Dive into quizzes, fill-in-the-blank exercises, and thought-provoking questions, all designed to enhance your mastery. This is language learning on turbo, transforming every video into a dynamic educational adventure."
          }
          button={"button"}
          icon="developer.webp"
          id="intro"
        />
        <MiddleBlock
          //title={formatMessage({ id: "web.middleBlock.title" })}
          title={"Pioneering the Future of Language Learning with AI"}
          content={
            "Embrace an innovative language learning path powered by leading-edge AI."
          }
          button={"GET STARTED FOR FREE"}
          direction="up"
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
