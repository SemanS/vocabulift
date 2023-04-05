import React, { FC, useEffect, useRef, useState } from "react";
import { useGuide } from "../guide/useGuide";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { userState } from "@/stores/user";
import { useRecoilState } from "recoil";
import { SettingsDrawerContext } from "@/contexts/SettingsDrawerContext";
import { MenuDataItem } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import {
  ReadOutlined,
  HomeOutlined,
  FrownOutlined,
  UnorderedListOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLocale } from "@/locales";
import RightContent from "./components/RightContent";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import styles from "./index.module.less";
import Footer from "./components/Footer";
import { Button, Space } from "antd";

const IconMap: { [key: string]: React.ReactNode } = {
  book: <ReadOutlined />,
  home: <HomeOutlined />,
  frown: <FrownOutlined />,
  vocabulary: <UnorderedListOutlined />,
  settings: <SettingOutlined />,
};

const LayoutPage: FC = () => {
  //const { data: menuList, error } = useGetCurrentMenus();

  const [user, setUser] = useRecoilState(userState);
  const [pathname, setPathname] = useState("/welcome");
  const { device, collapsed, newUser, settings } = user;
  const isMobile = device === "MOBILE";
  const { driverStart } = useGuide();
  const location = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  useEffect(() => {
    newUser && driverStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUser]);

  const loopMenuItem = (menus?: MenuDataItem[]): MenuDataItem[] => {
    if (!menus) return [];

    const m = menus.map(({ icon, items, ...item }) => ({
      ...item,
      icon: icon && IconMap[icon as string],
      items: items && loopMenuItem(items),
    }));

    m.push({
      path: "/",
      name: "settings",
      locale: "menu.settings",
      icon: IconMap["settings" as string],
      items: undefined,
    });

    return m;
  };

  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  const toggleSettingsDrawer = () => {
    setSettingsDrawerVisible(!settingsDrawerVisible);
  };

  return (
    <SettingsDrawerContext.Provider
      value={{
        toggleSettingsDrawer,
        settingsDrawerVisible,
      }}
    >
      <ProLayout
        location={{
          pathname: location.pathname,
        }}
        layout="top"
        logo={<LogoSvg className={styles.layoutPageHeaderLogo} />}
        //{...settings}
        formatMessage={formatMessage}
        onMenuHeaderClick={() => navigate("/")}
        headerTitleRender={() => (
          <Space style={{ display: "flex", alignItems: "left" }}>
            <LogoSvg className={styles.layoutPageHeaderLogoHeader} />
            <h1 style={{ marginLeft: "0px" }}>VocabuLift</h1>
          </Space>
        )}
        menuDataRender={() => [...loopMenuItem(user.menuList)]}
        menuItemRender={(menuItemProps, defaultDom) => {
          console.log(menuItemProps.name);
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }
          if (menuItemProps.name === "settings") {
            return (
              <Button
                style={{ marginTop: "6px", backgroundColor: "#D7DFEA" }}
                onClick={toggleSettingsDrawer}
              >
                {defaultDom}
              </Button>
            );
          } else {
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }
        }}
        rightContentRender={() => <RightContent />}
        footerRender={() => <Footer />}
      >
        <Outlet />
      </ProLayout>
    </SettingsDrawerContext.Provider>
  );
};

export default LayoutPage;
