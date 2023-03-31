import { Row, Col } from "antd";
import { SvgIcon } from "../../common/SvgIcon";
import Container from "../../common/Container";

import {
  FooterSection,
  Title,
  NavLink,
  Extra,
  LogoContainer,
  Para,
  Large,
  Chat,
  Empty,
  FooterContainer,
  Language,
  Label,
  LanguageSwitch,
  LanguageSwitchContainer,
} from "./styles";
import React from "react";

interface SocialLinkProps {
  href: string;
  src: string;
}

const Footer = () => {
  const SocialLink = ({ href, src }: SocialLinkProps) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        key={src}
        aria-label={src}
      >
        <SvgIcon src={src} width="25px" height="25px" />
      </a>
    );
  };

  return (
    <>
      <FooterSection>
        <Container>
          <Row justify="space-between">
            <Col lg={10} md={10} sm={12} xs={12}>
              <Language>{"Contact"}</Language>
              <Large to="/">{"Tell us everything"}</Large>
              <Para>{`Do you have any question? Feel free to reach out.`}</Para>
              <a href="gabrielsilvasouza786@gmail.com">
                <Chat>{`Let's Chat`}</Chat>
              </a>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{"Policy"}</Title>
              <Large to="/" left="true">
                {"Application Security"}
              </Large>
              <Large left="true" to="/">
                {"Software Principles"}
              </Large>
            </Col>
            <Col lg={6} md={6} sm={12} xs={12}>
              <Empty />
              <Large left="true" to="/">
                {"Support Center"}
              </Large>
              <Large left="true" to="/">
                {"Customer Support"}
              </Large>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col lg={10} md={10} sm={12} xs={12}>
              <Empty />
              <Language>{"Address"}</Language>
              <Para>João Pessoa, PB</Para>
              <Para>Brasil</Para>
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>{"Company"}</Title>
              <Large left="true" to="/">
                {"About"}
              </Large>
              <Large left="true" to="/">
                {"Blog"}
              </Large>
              <Large left="true" to="/">
                {"Press"}
              </Large>
              <Large left="true" to="/">
                {"Careers & Culture"}
              </Large>
            </Col>
            <Col lg={6} md={6} sm={12} xs={12}>
              <Label htmlFor="select-lang">{"Language"}</Label>
              {/* <LanguageSwitchContainer>
                <LanguageSwitch onClick={() => handleChange("en")}>
                  <SvgIcon
                    src="united-states.svg"
                    aria-label="homepage"
                    width="30px"
                    height="30px"
                  />
                </LanguageSwitch>
                <LanguageSwitch onClick={() => handleChange("br")}>
                  <SvgIcon
                    src="brazil-svgrepo.svg"
                    aria-label="homepage"
                    width="30px"
                    height="30px"
                  />
                </LanguageSwitch>
              </LanguageSwitchContainer> */}
            </Col>
          </Row>
        </Container>
      </FooterSection>
      <Extra>
        <Container border={true}>
          <Row
            justify="space-between"
            align="middle"
            style={{ paddingTop: "3rem" }}
          >
            <NavLink to="/">
              <LogoContainer>
                <SvgIcon
                  src="logo.svg"
                  aria-label="homepage"
                  width="101px"
                  height="64px"
                />
              </LogoContainer>
            </NavLink>
            <FooterContainer>
              <SocialLink
                href="https://github.com/GabrielSS187/Landing-Page-Animated-Gss"
                src="github.svg"
              />
              <SocialLink
                href="https://www.linkedin.com/in/gabriel-silva-souza-developer"
                src="linkedin.svg"
              />
            </FooterContainer>
          </Row>
        </Container>
      </Extra>
    </>
  );
};

export default Footer;
