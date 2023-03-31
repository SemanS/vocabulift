import React, { FC, useEffect, useRef, useState } from "react";
import { useGuide } from "../guide/useGuide";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { userState } from "@/stores/user";
import { useRecoilState } from "recoil";

import { MenuDataItem } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import {
  ReadOutlined,
  HomeOutlined,
  FrownOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLocale } from "@/locales";
import RightContent from "./components/RightContent";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import styles from "./index.module.less";
import Footer from "./components/Footer";
import { Space } from "antd";

const IconMap: { [key: string]: React.ReactNode } = {
  book: <ReadOutlined />,
  home: <HomeOutlined />,
  frown: <FrownOutlined />,
  vocabulary: <UnorderedListOutlined />,
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

  const sidebarMenuRef = useRef<HTMLDivElement | null>(null);
  const toggle = () => {
    setUser({ ...user, collapsed: !collapsed });
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarMenuRef.current &&
        !sidebarMenuRef.current.contains(event.target as Node) &&
        !collapsed
      ) {
        toggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed]);

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

    return m;
  };

  return (
    <>
      <div ref={sidebarMenuRef}>
        <ProLayout
          fixSiderbar
          collapsed={collapsed}
          location={{
            pathname: location.pathname,
          }}
          logo={<LogoSvg className={styles.layoutPageHeaderLogo} />}
          {...settings}
          onCollapse={() => toggle()}
          formatMessage={formatMessage}
          onMenuHeaderClick={() => navigate("/")}
          headerTitleRender={() => (
            <Space style={{ display: "flex", alignItems: "left" }}>
              <LogoSvg className={styles.layoutPageHeaderLogoHeader} />
              <h1 style={{ marginLeft: "0px" }}>VocabuLift</h1>
            </Space>
          )}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (
              menuItemProps.isUrl ||
              !menuItemProps.path ||
              location.pathname === menuItemProps.path
            ) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          /* breadcrumbRender={(routers = []) => {
            const { title } = useParams();
            const isBookDetailPage = location.pathname.includes("/books/");
            if (isBookDetailPage) {
              const bookTitle = user.books.find(
                (book) => book.title === title
              )?.title;
              if (bookTitle) {
                routers.push({
                  path: location.pathname,
                  breadcrumbName: bookTitle,
                });
              }
            }
            return [
              {
                path: "/",
                breadcrumbName: formatMessage({ id: "menu.home" }),
              },
              ...routers,
            ];
          }} */
          menuDataRender={() => loopMenuItem(user.menuList)}
          rightContentRender={() => <RightContent />}
          footerRender={() => <Footer />}
        >
          <Outlet />
        </ProLayout>
      </div>
    </>
  );
};

export default LayoutPage;
