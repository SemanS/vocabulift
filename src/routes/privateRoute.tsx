import React, { FC, useEffect } from "react";
import { Navigate, RouteProps, useLocation } from "react-router";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { useCookies } from "react-cookie";
import axios from "axios";

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const [cookies] = useCookies(["access_token"]);

  if (!cookies.access_token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (import.meta.env.MODE === "development" && cookies.access_token) {
      sessionStorage.setItem("token", cookies.access_token);
      axios
        .get(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/current/user`, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [cookies.access_token, setUser]);

  const logged = user.logged ? true : false;

  //const { data: currentUser, error } = useGetCurrentUser();

  useEffect(() => {
    //setUser({ ...user, username: currentUser?.username || "", logged: true });
  }, []);

  return logged ? <div>{children}</div> : <Navigate to="/login" />;
};

export default PrivateRoute;
