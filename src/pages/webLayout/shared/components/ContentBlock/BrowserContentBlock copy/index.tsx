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

const BrowserBlock = ({
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
        justify="space-between"
        align="middle"
        id={id}
        className={fadeVisible ? styles.visible : styles.notVisible}
      >
        <Col lg={12} md={12} sm={12} xs={24}>
          {/* <ContentWrapper> */}
          <h6>
            <Fade direction="left" triggerOnce>
              {"Discover the Magic of Vocabulift"}
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
        <Col lg={12} md={12} sm={12} xs={24}>
          <video ref={videoRef} loop muted playsInline width={"100%"}>
            <source src="img/svg/video_2.webm" type="video/webm" />
          </video>
        </Col>
      </Row>
    </RightBlockContainer>
  );
};

export default BrowserBlock;
