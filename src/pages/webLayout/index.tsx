import React, { FC, lazy, Suspense } from "react";
import Header from "./shared/components/Header";
import { useLocale } from "@/locales";
import PricingComponent from "./shared/components/Pricing/PricingComponent";

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
          icon="developer.webp"
          id="intro"
        />
        <MiddleBlock
          title={formatMessage({ id: "web.middleBlock.title" })}
          content={formatMessage({ id: "web.middleBlock.text" })}
          button={"Get started for free"}
        />
        {/*  <ContentBlock
          type="left"
          title={"title"}
          content={"content"}
          section={"section"}
          icon="graphs.svg"
          id="about"
        /> */}
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
      </Container>
    </Suspense>
  );
};

export default WebLayoutPage;
