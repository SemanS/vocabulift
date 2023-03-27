import React, { FC, useEffect, useState } from "react";
import { Navigate, RouteProps, useLocation } from "react-router";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { useCookies } from "react-cookie";
import axios from "axios";
import { getGlobalState } from "../models";
import { Spin } from "antd";

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true);

  /* if (!cookies.access_token) {
    return <Navigate to="/login" />;
  } */

  useEffect(() => {
    if (
      import.meta.env.MODE === "development" &&
      cookies.access_token &&
      !user.isLogged
    ) {
      sessionStorage.setItem("access_token", cookies.access_token);
      axios
        .get(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/current`, {
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
        })
        .finally(() => {
          setLoading(false); // Set loading state to false when user information is obtained
        });
    } else {
      setLoading(false); // Set loading state to false if there is no access token
    }
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return user.isLogged ? <div>{children}</div> : <Navigate to="/login" />;
};

export default PrivateRoute;
