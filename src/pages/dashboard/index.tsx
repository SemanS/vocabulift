import React, { FC, useState, useEffect } from "react";
import Overview from "./overview";
import SalePercent from "./salePercent";
import TimeLine from "./timeLine";
import "./index.less";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";

const DashBoardPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    sessionStorage.setItem("token", cookies.access_token);
  }, [cookies.access_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(undefined as any);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div>
      <Overview loading={loading} />

      <SalePercent loading={loading} />
      <TimeLine loading={loading} />
    </div>
  );
};

export default DashBoardPage;
