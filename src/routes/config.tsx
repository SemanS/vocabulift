import React, { FC, useEffect, useState } from "react";
import { Navigate, PathRouteProps } from "react-router";
import PrivateRoute from "./privateRoute";
import { useIntl } from "react-intl";
import { getGlobalState } from "@/models";
import { userState } from "@/stores/user";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { PageContainer } from "@ant-design/pro-layout";
import { Spin } from "antd";

export interface WrapperRouteProps extends PathRouteProps {
  /** authorization？ */
  auth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, children }) => {
  const { formatMessage } = useIntl();
  const [user, setUser] = useRecoilState(userState);
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    if (import.meta.env.MODE === "development" && cookies.access_token) {
      sessionStorage.setItem("access_token", cookies.access_token);
      axios
        .get(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/current/user`, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        })
        .then((response) => {
          setUser({
            ...getGlobalState(),
            username: "Slavo",
            noticeCount: 0,
            isLogged: true,
            ...response.data.body,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
    }
  }, []);

  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return <>{children}</>;
};

export default WrapperRouteComponent;
