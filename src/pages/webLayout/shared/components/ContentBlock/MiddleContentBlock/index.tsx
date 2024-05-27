import { Row, Col, Card } from "antd";
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
import snapshotDataEn from "./../../../../../../data/snapshot_en.json";
import QuizComponent from "@/pages/bookDetail/components/Quiz/QuizComponent";

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
        <Col lg={10} md={10} sm={24} xs={24}>
          <Card
            style={{
              height: "600px",
              //width: "550px",
              overflowY: "auto",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            <div
              style={{
                display: "flex", // Using flex to manage layout
                flexWrap: "wrap", // Allows wrapping to next line
              }}
            >
              <QuizComponent
                sourceLanguage={"en"}
                libraryId={"1"}
                snapshot={snapshotDataEn}
              />
            </div>
          </Card>
        </Col>
        <Col lg={2} md={2} sm={0} xs={0}></Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          {/* <ContentWrapper> */}
          <span className="custom-heading">
            <Fade direction="left" style={{ marginTop: "0px" }} triggerOnce>
              {"Try our VocabuQuiz"}
            </Fade>
          </span>
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
