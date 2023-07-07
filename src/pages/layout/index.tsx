import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useGuide } from "../guide/useGuide";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { userState } from "@/stores/user";
import { useRecoilState, useRecoilValue } from "recoil";
import { SettingsDrawerContext } from "@/contexts/SettingsDrawerContext";
import { MenuDataItem } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import {
  ReadOutlined,
  HomeOutlined,
  FrownOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLocale } from "@/locales";
import RightContent from "./components/RightContent";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import styles from "./index.module.less";
import Footer from "./components/Footer";
import { Space } from "antd";
import {
  libraryIdState,
  currentPageState,
  pageSizeState,
} from "@/stores/library";

const IconMap: { [key: string]: React.ReactNode } = {
  library: <ReadOutlined />,
  home: <HomeOutlined />,
  frown: <FrownOutlined />,
  vocabulary: <UnorderedListOutlined />,
  settings: <SettingOutlined />,
  last: <EyeOutlined />,
};

const LayoutPage: FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [pathname, setPathname] = useState("/welcome");
  const { device, newUser, settings } = user;
  const isMobile = device === "MOBILE";
  const { driverStart } = useGuide();
  const location = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  const libraryId = useRecoilValue(libraryIdState);
  const currentPage = useRecoilValue(currentPageState);
  const pageSize = useRecoilValue(pageSizeState);

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

    if (libraryId) {
      m.push({
        path: `/library/${libraryId}?currentPage=${currentPage}&pageSize=${pageSize}&targetLanguage=${user.targetLanguage}`,
        key: "last-video",
        name: "library",
        locale: "menu.last",
        icon: IconMap["last" as string],
        items: undefined,
      });
    }

    return m;
  };

  const selectedKeys = useMemo(() => {
    const pathParts = location.pathname.split("/");

    // If the path starts with "/library" but is not exactly "/library", return ['last-video'].
    if (pathParts[1] === "library" && pathParts.length > 2) {
      return ["last-video"];
    }

    // If the path is exactly "/library", return ['library'].
    // For all other paths, return an array containing the first part of the path.
    return pathParts.length === 2 && pathParts[1] === "library"
      ? ["library"]
      : [pathParts[1]];
  }, [location.pathname]);

  const [collapsed, setCollapsed] = useState(false);
  const layoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (layoutRef.current && !layoutRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [layoutRef, setCollapsed]);

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
      <div ref={layoutRef} className={styles.proLayoutCustom}>
        <ProLayout
          collapsed={collapsed}
          onCollapse={setCollapsed}
          location={{
            pathname: location.pathname,
          }}
          selectedKeys={selectedKeys}
          breadcrumbRender={false}
          layout="top"
          title={false}
          fixedHeader={true}
          logo={
            <LogoSvg
              className={styles.layoutPageHeaderLogo}
              style={{ width: "6rem", marginRight: "2rem" }}
            />
          }
          formatMessage={formatMessage}
          onMenuHeaderClick={() => navigate("/library")}
          /* headerTitleRender={() => (
            <Space style={{ display: "flex", alignItems: "left" }}>
              <LogoSvg className={styles.layoutPageHeaderLogoHeader} />
            </Space>
          )} */
          menuDataRender={() => [...loopMenuItem(user.menuList)]}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl) {
              return defaultDom;
            }
            return (
              <Link
                to={menuItemProps.path!}
                onClick={() => setCollapsed(true)}
                style={{ fontWeight: "400", fontSize: "16px" }}
              >
                {defaultDom}
              </Link>
            );
          }}
          rightContentRender={() => <RightContent></RightContent>}
          footerRender={() => <Footer />}
        >
          <Outlet />
        </ProLayout>
      </div>
    </SettingsDrawerContext.Provider>
  );
};

export default LayoutPage;
