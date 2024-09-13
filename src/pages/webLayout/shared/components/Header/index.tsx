import { useState } from "react";
import { Row, Col, Drawer, Dropdown, Menu as MenuAntd } from "antd";
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
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { useLocation, useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { localeConfig } from "@/config/locale";
import { parseLocale } from "@/utils/stringUtils";
import { menuLanguageState } from "@/stores/language";

const Header = () => {
  const [visible, setVisibility] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [cookies, setCookie] = useCookies(["access_token"]);

  const navigate = useNavigate();
  const location = useLocation();

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const loginOut = async () => {
    setUser({ ...user, isLogged: false });
    if (cookies.access_token) {
      if (import.meta.env.MODE === "testing") {
        setCookie("access_token", "", { expires: new Date(0) });
      } else if (
        import.meta.env.MODE === "development" ||
        import.meta.env.MODE === "production"
      ) {
        setCookie("access_token", "", {
          expires: new Date(0),
          secure: true,
          path: "/",
          domain: "vocabulift.com",
          sameSite: "none",
        });
      }
    }
    sessionStorage.clear();
    if (location.pathname !== "/login") {
      navigate("/login", {
        replace: true,
      });
    }
  };

  const [selectedLanguage, setSelectedLanguage] =
    useRecoilState(menuLanguageState);

  const handleLanguageChange = (langKey: string) => {
    setSelectedLanguage(langKey);
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
    const currentLangIcon = localeConfig.find(
      (lang) => parseLocale(lang.key) === parseLocale(selectedLanguage)
    );

    const items = localeConfig
      .filter(
        (lang) =>
          [
            "en",
            "sk",
            "cs",
            "es",
            "fr",
            "de",
            "pl",
            "hu",
            "uk",
            "it",
            "zh",
          ].includes(parseLocale(lang.key)) && parseLocale(lang.key) !== "en"
      )
      .map((lang) => ({
        key: lang.key,
        disabled: "en" === parseLocale(lang.key),
        label: (
          <>
            {lang.icon}
            <span style={{ marginLeft: "10px" }}>{lang.name}</span>
          </>
        ),
        onClick: () => handleLanguageChange(lang.key),
      }));
    return (
      <>
        {location.pathname === "/" && (
          <>
            {/* <Button
              color={"silver"}
              onClick={() => {
                navigate("/academy");
              }}
            >
              {"Academy (NEW)"}
            </Button> */}
            <Span
              style={
                {
                  //position: "fixed",
                  //top: "22px",
                  //left: "49.6%",
                  //transform: "translateX(-50%)",
                  //zIndex: 1001,
                }
              }
            >
              <Dropdown
                //onVisibleChange={setDropdownActive}
                overlay={<MenuAntd items={items} />}
                trigger={["click"]}
                arrow={true}
                placement="bottom"
                overlayStyle={{
                  boxShadow: "0 2px 10px DimGrey",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  zIndex: "10000",
                }}
              >
                <Button
                  size="large"
                  //shape="round"
                  //className={classes.actionButton}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 5px DimGrey",
                    border: "none",
                  }}
                >
                  <DownOutlined style={{ marginRight: "10px" }} />
                  <span>Native language: </span>
                  <span
                    style={{
                      marginLeft: "4px",
                      marginRight: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    {currentLangIcon?.name}
                  </span>
                  {currentLangIcon?.icon}
                </Button>
              </Dropdown>
            </Span>
            <CustomNavLinkSmall onClick={() => scrollTo("intro", 200)}>
              <Span>{"About"}</Span>
            </CustomNavLinkSmall>
            {/* <CustomNavLinkSmall onClick={() => scrollTo("mission", 200)}>
              <Span>{"Quizzes"}</Span>
            </CustomNavLinkSmall> */}
            <CustomNavLinkSmall onClick={() => scrollTo("product", 200)}>
              <Span>{"Testimonials"}</Span>
            </CustomNavLinkSmall>
            <CustomNavLinkSmall onClick={() => scrollTo("pricing", 50)}>
              <Span>{"Pricing"}</Span>
            </CustomNavLinkSmall>
          </>
        )}
        {/* {location.pathname === "/academy" && (
          <>
            <CustomNavLinkSmall onClick={() => navigate("/")}>
              <Span>{"Home"}</Span>
            </CustomNavLinkSmall>
          </>
        )} */}
        <CustomNavLinkSmall>
          <Span>
            {cookies.access_token ? (
              <a href="/library" style={{ fontWeight: 700 }}>
                {"Library"}
              </a>
            ) : (
              <a href="/login" style={{ fontWeight: 700 }}>
                {"Sign In"}
              </a>
            )}
          </Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("contact")}>
          <ButtonWrapper>
            {cookies.access_token ? (
              <Button
                onClick={() => {
                  loginOut();
                  navigate("/logout");
                }}
              >
                {"Log out"}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate("/registration");
                }}
              >
                {"Try for free"}
              </Button>
            )}

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
            <SvgIcon
              src={`${import.meta.env.VITE_BASE_URL}/vocabulift_logo.svg`}
              width="120px"
              height="64px"
            />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={showDrawer} style={{ marginRight: "40px" }}>
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
