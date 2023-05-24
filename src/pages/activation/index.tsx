import React, { FC, useState } from "react";
import { Card, Col, Row, Typography, Steps, Divider } from "antd";
import styles from "./index.module.less";
import Flag from "react-world-flags";

const ActivationPage: FC = () => {
  const [current, setCurrent] = useState(0);
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [foreignLanguage, setForeignLanguage] = useState("");
  const [highestCompletedStep, setHighestCompletedStep] = useState(0);

  const languages = [
    "en",
    "es",
    "fr",
    "de",
    "cz",
    "sk",
    "pl",
    "hu",
    "it",
    "nl",
  ];
  const getFlagCode = (code: string) => (code === "en" ? "gb" : code);

  const selectFlag = (language: string) => {
    if (current === 0) {
      setNativeLanguage(language);
      setCurrent(1);
      if (highestCompletedStep < 1) {
        setHighestCompletedStep(1);
      }
    } else if (current === 1) {
      setForeignLanguage(language);
      setCurrent(2);
      if (highestCompletedStep < 2) {
        setHighestCompletedStep(2);
      }
    }
  };

  const handleStepChange = (step: number) => {
    if (step <= highestCompletedStep) {
      setCurrent(step);
    }
  };

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} justify="center" align="middle">
        <Card style={{ width: "60%" }}>
          {/* adjust maxWidth as per your requirement */}
          {(current === 0 || current === 1) && (
            <>
              <Col span={24}>
                <Typography.Title className={styles.title} level={1}>
                  {current === 0
                    ? "What language do you know?"
                    : "What language are you learning?"}
                </Typography.Title>
                <Divider />
              </Col>
              <Row
                justify="center"
                align="middle"
                style={{ marginTop: "2em", flexWrap: "wrap" }}
              >
                {languages.map((language) => (
                  <Col
                    key={language}
                    xs={8}
                    sm={8}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{ margin: "1em" }}
                  >
                    <Flag
                      className={styles.flag}
                      code={getFlagCode(language)}
                      height="96"
                      width="128"
                      onClick={() => selectFlag(language)}
                    />
                  </Col>
                ))}
                <Steps
                  style={{ marginTop: "50px" }}
                  current={current}
                  onChange={handleStepChange}
                  direction="horizontal"
                  items={[
                    {
                      title: "Step 1",
                      description: "Choose your native language",
                    },
                    {
                      title: "Step 2",
                      description: "Choose your foreign language",
                    },
                    {
                      title: "Step 3",
                      description: "Watch video tutorial",
                    },
                  ]}
                />
              </Row>
            </>
          )}
          {current === 2 && <p>Content for step 3</p>}
        </Card>
      </Row>
    </div>
  );
};

export default ActivationPage;
