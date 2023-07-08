import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
  ButtonWrapper,
} from "./styles";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [visible, setVisibility] = useState(false);

  const navigate = useNavigate();

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    const scrollTo = (id: string, offset = 150) => {
      const element = document.getElementById(id) as HTMLDivElement;
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
      setVisibility(false);
    };
    return (
      <>
        <CustomNavLinkSmall onClick={() => scrollTo("intro", 200)}>
          <Span>{"About"}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("mission", 200)}>
          <Span>{"Mission"}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("product", 200)}>
          <Span>{"Product"}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("pricing", 50)}>
          <Span>{"Pricing"}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "240px" }}
          onClick={() => scrollTo("contact")}
        >
          <ButtonWrapper>
            <Button
              onClick={() => {
                navigate("/registration");
              }}
            >
              {"Try for free"}
            </Button>
            <Button>{"Contact"}</Button>
          </ButtonWrapper>
          {/* <Span>
            <Button>{"Contact"}</Button>
          </Span> */}
        </CustomNavLinkSmall>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
            <SvgIcon src="logo.svg" width="120px" height="64px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} open={visible} onClose={onClose}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default Header;
