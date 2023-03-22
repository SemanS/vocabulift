import React, { FC } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import LandingPage from "@/pages/landingPage/LandingPage";
import RightContent from "@/pages/layout/components/RightContent";
import Footer from "@/pages/layout/components/Footer";
import { ReactComponent as LogoSvg } from "@/assets/logo/vocabulift_logo.svg";
import { Space } from "antd";
import { Settings as LayoutSettings } from "@ant-design/pro-layout";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: "light",
  // 拂晓蓝
  //primaryColor: "#1890ff"
  layout: "top",
  contentWidth: "Fluid",
  fixedHeader: false,
  colorWeak: false,
  //title: "VocabuLift",
  pwa: false,
  iconfontUrl: "",
};

const WebLayoutPage: FC = () => {
  const [user, setUser] = useRecoilState(userState);
  return (
    <>
      <ProLayout
        hasSiderMenu={false}
        {...Settings}
        logo={<LogoSvg style={{ height: "40px" }} />}
        headerTitleRender={() => (
          <Space style={{ display: "flex", alignItems: "left" }}>
            <LogoSvg style={{ height: "40px", marginTop: "18px" }} />
            <h1 style={{ marginLeft: "0px" }}>Vocabulift</h1>
          </Space>
        )}
        rightContentRender={() => <RightContent />}
        footerRender={() => <Footer />}
      >
        <PageContainer>
          <LandingPage />
        </PageContainer>
      </ProLayout>
    </>
  );
};

export default WebLayoutPage;
