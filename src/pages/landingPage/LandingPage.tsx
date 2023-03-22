import React from "react";
import { Row, Col, Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-page-hero">
        <Row justify="center" align="middle">
          <Col xs={24} md={12}>
            <Typography className="landing-page-text">
              <Title level={1}>Grow your business with HubSpot</Title>
              <Paragraph>
                Everything you need to sell, market and manage your customers in
                one powerful platform.
              </Paragraph>
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                Get started for free
              </Button>
            </Typography>
          </Col>
          <Col xs={24} md={12}>
            <img
              src="https://your-landing-page-image-url.com"
              alt="Your Company"
              className="landing-page-image"
            />
          </Col>
        </Row>
      </div>
      {/* Add more sections and components here, as required */}
    </div>
  );
};

export default LandingPage;
