import React, { FC, Suspense, lazy } from "react";
import Header from "../shared/components/Header";
import { Card, Col, Row, Typography } from "antd";
import Container from "../shared/common/Container";
import YouTube from "react-youtube";
import Footer from "../shared/components/Footer";

const Academy: FC = () => {
  const Contact = lazy(() => import("../shared/components/ContactForm"));
  const MiddleBlock = lazy(() => import("../shared/components/MiddleBlock"));
  const ScrollToTop = lazy(() => import("../shared/common/ScrollToTop"));
  const ContentBlock = lazy(() => import("../shared/components/ContentBlock"));

  const videoOptions = {
    height: "490",
    width: "790",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <Header />
      <Container>
        <Row justify="space-between" align="middle">
          <Col span={4} />
          <Col span={16}>
            <Card style={{ marginTop: "120px", marginBottom: "120px" }}>
              <center>
                <h6>{"Academy"}</h6>
                <Typography.Title level={4}>
                  Master Languages with Vocabulift.com: Your AI-powered Video
                  Guide!
                </Typography.Title>
              </center>
              <br />

              <center>
                <YouTube videoId="nKZIHZPT8I0" opts={videoOptions} />
              </center>
              {/* <Col span={8}></Col>
                <Col span={8}>
                  <YouTube videoId="eWy7F0w0l-g" opts={videoOptions} />
                </Col>
                <Col span={8}></Col> */}

              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              {/*
              <Row gutter={16}>
                <Col span={8}>
                  <YouTube videoId="VIDEO_ID4" opts={videoOptions} />
                </Col>
                <Col span={8}>
                  <YouTube videoId="VIDEO_ID5" opts={videoOptions} />
                </Col>
                <Col span={8}>
                  <YouTube videoId="VIDEO_ID6" opts={videoOptions} />
                </Col>
              </Row> */}
            </Card>
          </Col>
          <Col span={4} />
        </Row>
        <Footer />
      </Container>
    </>
  );
};

export default Academy;
