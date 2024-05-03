import React, { FC, useEffect, useMemo, useRef, useState } from "react";
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
  DownOutlined,
} from "@ant-design/icons";
//import { Link } from "react-router-dom";
import { useLocale } from "@/locales";
import RightContent from "./components/RightContent";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import styles from "./index.module.less";
import Footer from "./components/Footer";
import { Button, Dropdown, FloatButton, Space } from "antd";
import {
  libraryIdState,
  currentPageState,
  pageSizeState,
} from "@/stores/library";
import { MenuItemLink } from "./components/MenuItemLink/MenuItemLink";
import styled from "styled-components";
import SelectLang from "./components/RightContent/SelectLang";

const IconMap: { [key: string]: React.ReactNode } = {
  library: <ReadOutlined />,
  home: <HomeOutlined />,
  frown: <FrownOutlined />,
  vocabulary: <UnorderedListOutlined />,
  settings: <SettingOutlined />,
  last: <EyeOutlined />,
};

const DashedKeys = ["settings"];

const LayoutPage: FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [pathname, setPathname] = useState("/welcome");
  const { device, newUser, settings } = user;
  const isMobile = device === "MOBILE";
  const location = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  const libraryId = useRecoilValue(libraryIdState);
  const currentPage = useRecoilValue(currentPageState);
  const pageSize = useRecoilValue(pageSizeState);

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
  const [isDropdownActive, setDropdownActive] = useState(false);

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

  const ClickableLogo = () => {
    return (
      <LogoSvg
        onClick={() => navigate("/library")}
        className={styles.layoutPageHeaderLogo}
      />
    );
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];

  return (
    <SettingsDrawerContext.Provider
      value={{
        toggleSettingsDrawer,
        settingsDrawerVisible,
      }}
    >
      <div
        ref={layoutRef}
        className={`${styles.proLayoutCustom} ${
          isDropdownActive && `${styles.blurred}`
        }`}
      >
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
          logo={<ClickableLogo />}
          formatMessage={formatMessage}
          onMenuHeaderClick={() => navigate("/")}
          menuDataRender={() => [...loopMenuItem(user.menuList)]}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl) {
              return defaultDom;
            }
            return (
              <>
                <MenuItemLink
                  menuItemProps={menuItemProps}
                  defaultDom={defaultDom}
                  isUnderlined={selectedKeys.includes(
                    menuItemProps.key?.replace("/", "") || ""
                  )}
                />
              </>
            );
          }}
          actionsRender={() => <RightContent></RightContent>}
          //footerRender={() => <Footer />}
        >
          <Outlet />
          <SelectLang setDropdownActive={setDropdownActive} />
        </ProLayout>
      </div>
    </SettingsDrawerContext.Provider>
  );
};

export default LayoutPage;
