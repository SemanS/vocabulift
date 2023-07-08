import { Row, Col, Typography } from "antd";
import { SvgIcon } from "../../../common/SvgIcon";
import { IContentBlockProps } from "../types";
import { Fade } from "react-awesome-reveal";
import {
  LeftContentSection,
  Content,
  ContentWrapper,
  ServiceWrapper,
  MinTitle,
  MinPara,
} from "./styles";
import React, { useEffect, useState } from "react";
import styles from "./index.module.less";

const LeftContentBlock = ({
  icon,
  title,
  content,
  section,
  id,
  className,
}: IContentBlockProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <LeftContentSection>
      <Fade direction="right" triggerOnce>
        <Row justify="space-between" align="middle" id={id}>
          <Col lg={1} md={1} sm={1} xs={2} />
          <Col lg={5} md={5} sm={10} xs={20}>
            {/* <SvgIcon src={"logo_custom.svg"} width="60%" height="100%" /> */}
            {/* <ContentWrapper> */}
            <Typography.Title level={2}>
              {"Dynamic Subtitles & Translations"}
            </Typography.Title>
            <Content>
              {
                "Breeze through language learning with our AI-powered dynamic subtitles. Hover over words or phrases to see instant translations, organized into logical units for better comprehension. No more disjointed sentences like on YouTube - we ensure smooth, coherent learning for you."
              }
            </Content>
            {/* </ContentWrapper> */}
          </Col>
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={5} md={5} sm={10} xs={20}>
            {/* <SvgIcon src={"logo_custom.svg"} width="60%" height="100%" /> */}
            {/* <ContentWrapper> */}
            <Typography.Title level={2}>
              {"Interactive Language Learning Tool"}
            </Typography.Title>
            <Content>
              {
                "Make your language study interactive. Highlight words or phrases to see immediate translations. Click on any word to delve into detailed explanations in your native language. Our app turns passive watching into an active language learning journey."
              }
            </Content>
            {/* </ContentWrapper> */}
          </Col>
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={5} md={5} sm={10} xs={20}>
            {/* <SvgIcon src={"logo_custom.svg"} width="60%" height="100%" /> */}
            {/* <ContentWrapper> */}
            <Typography.Title level={2}>
              {"Customizable Worksheets & Study Aids"}
            </Typography.Title>
            <Content>
              {
                "Empower your teaching or self-study process with our customizable worksheet generation feature. Break down YouTube videos into digestible, easy-to-understand texts that facilitate better language comprehension and retention. Discover a new era of tailored learning."
              }
            </Content>
            {/* </ContentWrapper> */}
          </Col>
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={5} md={5} sm={10} xs={20}>
            {/* <SvgIcon src={"logo_custom.svg"} width="60%" height="100%" /> */}
            {/* <ContentWrapper> */}
            <Typography.Title level={2}>
              {"Personal Vocabulary Builder & Language Companion"}
            </Typography.Title>
            <Content>
              {
                "Create your unique vocabulary list by clicking on words while watching videos. Our app neatly organizes your vocabulary into an infinite scroll table, filterable by videos you've watched. Making a personalized language learning roadmap has never been easier."
              }
            </Content>
            {/* </ContentWrapper> */}
          </Col>
          <Col lg={0} md={0} sm={0} xs={2} />
          <Col lg={1} md={1} sm={1} xs={1} />
        </Row>
      </Fade>
    </LeftContentSection>
  );
};

export default LeftContentBlock;
