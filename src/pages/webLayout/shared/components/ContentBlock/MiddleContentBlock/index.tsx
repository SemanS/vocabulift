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
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            width={"100%"}
            style={{ maxWidth: "250px" }}
          >
            <source src="img/svg/video_1.webm" type="video/webm" />
          </video>
        </Col>
        <Col lg={16} md={16} sm={16} xs={24}>
          {/* <ContentWrapper> */}
          <h6>
            <Fade direction="left" triggerOnce>
              {"Experience the Power of Vocabulift"}
            </Fade>
          </h6>
          <Content>
            <Fade direction="left" triggerOnce>
              {
                "Watch as our app smoothly highlights and translates words and phrases from subtitles in a foreign language."
              }
            </Fade>
          </Content>
          <Content>
            <Fade direction="left" triggerOnce>
              {
                "User interaction takes center stage as translations occur in real-time."
              }
            </Fade>
          </Content>
          <Content>
            <Fade direction="left" triggerOnce>
              {"Start your adventure with Vocabulift today!"}
            </Fade>
          </Content>
          {/* </ContentWrapper> */}
        </Col>
      </Row>
    </RightBlockContainer>
  );
};

export default MiddleBlock;
