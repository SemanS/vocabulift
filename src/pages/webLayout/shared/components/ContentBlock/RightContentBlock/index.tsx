import { Row, Col, Button as AntdButton, Typography } from "antd";
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
import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleUrl } from "@/utils/getGoogleUrl";
import { ReactComponent as GoogleIcon } from "@/assets/logo/google_icon.svg";
import { useWindowWidth } from "@/utils/useWindowWidth";

const RightBlock = ({
  title,
  content,
  button,
  icon,
  id,
  className,
}: IContentBlockProps) => {
  const navigate = useNavigate();

  const [fadeVisible, setFadeVisible] = useState(false);
  useEffect(() => {
    setFadeVisible(true);
  }, []);

  const from = "/library";

  const width = useWindowWidth(); // use custom hook to get window width

  return (
    <RightBlockContainer>
      <Fade direction="right" triggerOnce>
        <Row
          justify="space-between"
          align="middle"
          id={id}
          className={fadeVisible ? styles.visible : styles.notVisible}
        >
          <Col lg={10} md={11} sm={11} xs={24}>
            <ContentWrapper>
              <h6>{title}</h6>
              <Content>
                <p>
                  <br />
                  Turn YouTube videos into your personal language lab and speed
                  up your learning—three times faster than Duolingo! <br />
                  <br />
                  Highlight any word or phrase for instant native explanations.
                  Dive into quizzes, fill-in-the-blank exercises, and
                  thought-provoking questions, all designed to enhance your
                  mastery. <br />
                  <br />
                </p>
              </Content>
              {/* <ButtonWrapper> */}
              <Button
                fixedWidth={true}
                onClick={() => navigate("/registration")}
              >
                {"SIGN UP WITH EMAIL"}
              </Button>{" "}
              <Button fixedWidth={true} onClick={() => navigate("/login")}>
                {"SIGN UP WITH GOOGLE"}
              </Button>{" "}
              {/* </ButtonWrapper> */}
            </ContentWrapper>
          </Col>
          <Col lg={14} md={11} sm={12} xs={24}>
            <img
              src={"img/svg/image_1.webp"}
              style={{
                width: "110%",
                height: "110%",
                marginTop: "30px",
                marginLeft: "30px",
              }}
              alt="icon"
            />
            {/* <SvgIcon src={icon} width="100%" height="100%" /> */}
          </Col>
        </Row>
      </Fade>
    </RightBlockContainer>
  );
};

export default RightBlock;
