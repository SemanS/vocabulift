import { Row, Col } from "antd";
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
    <LeftContentSection style={{ backgroundColor: "red" }}>
      <Fade direction="left" triggerOnce delay={3000}>
        <Row
          justify="space-between"
          align="middle"
          id={id}
          className={visible ? styles.visible : styles.nvisible}
        >
          <Col lg={11} md={11} sm={12} xs={24}>
            <SvgIcon src={icon} width="100%" height="100%" />
          </Col>
          <Col lg={11} md={11} sm={11} xs={24}>
            <ContentWrapper>
              <h6>{title}</h6>
              <Content>{content}</Content>
              <ServiceWrapper>
                <Row justify="space-between">
                  {typeof section === "object" &&
                    section.map((item: any, id: number) => {
                      return (
                        <Col key={id} span={11}>
                          <SvgIcon src={item.icon} width="60px" height="60px" />
                          <MinTitle>{item.title}</MinTitle>
                          <MinPara>{item.content}</MinPara>
                        </Col>
                      );
                    })}
                </Row>
              </ServiceWrapper>
            </ContentWrapper>
          </Col>
        </Row>
      </Fade>
    </LeftContentSection>
  );
};

export default LeftContentBlock;
