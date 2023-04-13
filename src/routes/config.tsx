import React, { FC, Suspense, useEffect } from "react";
import { PathRouteProps } from "react-router";
import PrivateRoute from "./privateRoute";
import { getGlobalState } from "@/models";
import { userState } from "@/stores/user";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";

export interface WrapperRouteProps extends PathRouteProps {
  auth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, children }) => {
  const [user, setUser] = useRecoilState(userState);
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    if (import.meta.env.MODE === "development" && cookies.access_token) {
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
        });
    } else {
    }
  }, []);

  if (auth) {
    return (
      <PrivateRoute>
        <Suspense>{children}</Suspense>
      </PrivateRoute>
    );
  }
  return <>{children}</>;
};

export default WrapperRouteComponent;
