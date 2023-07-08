import React, { FC, useEffect, useState } from "react";
import { Card, Col, Row, Typography, Steps, Divider } from "antd";
import styles from "./index.module.less";
import Flag from "react-world-flags";
import { getFlagCode, getLocaleFromLanguage } from "@/utils/utilMethods";
import { SvgIcon } from "../webLayout/shared/common/SvgIcon";
import { Button } from "../webLayout/shared/common/Button";
import { postLanguages, updateUser } from "@/services/userService";
import { User } from "@/models/user";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { useNavigate } from "react-router-dom";

const ActivationPage: FC = () => {
  const [current, setCurrent] = useState(0);
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [foreignLanguage, setForeignLanguage] = useState("");
  const [highestCompletedStep, setHighestCompletedStep] = useState(0);
  const [user, setUser] = useRecoilState(userState);

  const navigate = useNavigate();

  const languages = [
    "en",
    "es",
    "fr",
    "de",
    "cs",
    "sk",
    "pl",
    "hu",
    "it",
    "cn",
  ];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (user.activated === true) {
      navigate("/library");
    }

    const handleResize = () => setWindowWidth(window.innerWidth);

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component is unmounted
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectFlag = async (language: string) => {
    if (current === 0) {
      setNativeLanguage(language);
      setCurrent(1);
      if (highestCompletedStep < 1) {
        setHighestCompletedStep(1);
      }
    } else if (current === 1 && language !== nativeLanguage) {
      setForeignLanguage(language);
      setCurrent(2);
      if (highestCompletedStep < 2) {
        setHighestCompletedStep(2);
      }
      if (nativeLanguage && language) {
        try {
          const updatedUserEntity: Partial<User> = {
            locale: getLocaleFromLanguage(nativeLanguage),
            sourceLanguage: "en",
            targetLanguage: language === "en" ? nativeLanguage : "en",
            activated: true,
          };

          const response = await updateUser(updatedUserEntity);
          console.log(response); // Log the response or handle it as you wish
        } catch (error) {
          console.error("Failed to post languages", error);
          // Handle the error as needed, e.g., show a notification to the user
        }
      } else {
        console.error("Both languages must be set!");
      }
    }
  };

  const handleStepChange = (step: number) => {
    if (step <= highestCompletedStep) {
      setCurrent(step);
    }
  };

  const sendLanguagesToServer = async () => {
    navigate("/library");
  };

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} justify="center" align="middle">
        <Card
          style={{ width: current === 2 ? "550px" : "100%", maxWidth: "60%" }}
        >
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
                      style={{
                        opacity:
                          current === 1 && language === nativeLanguage
                            ? 0.5
                            : 1,
                      }} // add this style
                    />
                  </Col>
                ))}
                <Steps
                  style={{ marginTop: "50px" }}
                  current={current}
                  onChange={handleStepChange}
                  direction={windowWidth < 576 ? "vertical" : "horizontal"}
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
          {current === 2 && (
            <>
              <Col span={24}>
                <Typography.Title className={styles.title} level={1}>
                  Welcome!
                </Typography.Title>
                <Divider />
              </Col>
              <Row
                justify="center"
                align="middle"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Col span={24}>
                  <SvgIcon
                    src="party_popper.svg"
                    width="250px"
                    height="250px"
                  />
                </Col>
                <Col span={24}>
                  <Button onClick={sendLanguagesToServer}>
                    Let's get started
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Row>
    </div>
  );
};

export default ActivationPage;
