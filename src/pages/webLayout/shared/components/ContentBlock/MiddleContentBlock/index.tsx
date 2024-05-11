import { Row, Col } from "antd";
import { SvgIcon } from "../../../common/SvgIcon";
import { Button } from "../../../common/Button";
import { IContentBlockProps } from "../types";
import { Fade } from "react-awesome-reveal";
import {
  RightBlockContainer,
  Content,
  ContentWrapper,
  ButtonWrapper,
} from "./styles";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";

const MiddleBlock = ({
  title,
  content,
  button,
  icon,
  id,
  className,
}: IContentBlockProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [fadeVisible, setFadeVisible] = useState(false);
  useEffect(() => {
    setFadeVisible(true);
  }, []);
  const scrollTo = (id: string) => {
    const element = document.getElementById(id) as HTMLDivElement;
    element.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play();
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <RightBlockContainer>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        justify="space-between"
        align="middle"
        id={id}
        className={fadeVisible ? styles.visible : styles.notVisible}
      >
        <Col span={1} />
        <Col lg={6} md={6} sm={6} xs={24}>
          {/* <video
            ref={videoRef}
            loop
            muted
            playsInline
            width={"100%"}
            style={{ maxWidth: "250px" }}
          >
            <source src="img/svg/video_1.webm" type="video/webm" />
          </video> */}
          <img
            src={"img/svg/image_3.webp"}
            style={{ width: "110%", height: "110%" }}
            alt="icon"
          />
        </Col>
        <Col span={2} />
        <Col lg={14} md={14} sm={14} xs={22}>
          {/* <ContentWrapper> */}
          <h6>
            <Fade direction="left" style={{ marginTop: "0px" }} triggerOnce>
              {"Unique functionality"}
            </Fade>
          </h6>
          <Content>
            <Fade direction="left" style={{ marginTop: "100px" }} triggerOnce>
              {
                "The platform includes a feature where users select a part of speech, and Vocabulift automatically generates tailored fill-in-the-blank exercises."
              }
            </Fade>
          </Content>
          <Content>
            <Fade direction="left" triggerOnce>
              {
                "Each video is accompanied by discussion questions, ready for use in educational or exercise settings."
              }
            </Fade>
          </Content>
          <Content>
            <Fade direction="left" triggerOnce>
              {
                "This tool streamlines content creation by automating exercise generation based on selected linguistic elements."
              }
            </Fade>
          </Content>
          {/* </ContentWrapper> */}
        </Col>
      </Row>
    </RightBlockContainer>
  );
};

export default MiddleBlock;
