import React, { FC, Suspense, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { getGlobalState } from "@/models";
import { userState } from "@/stores/user";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { SubscriptionPeriod, SubscriptionType, User } from "@/models/user";
import CustomSpinnerComponent from "@/pages/spinner/CustomSpinnerComponent";

export interface WrapperRouteProps {
  auth?: boolean;
  children?: React.ReactNode;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, children }) => {
  const [user, setUser] = useRecoilState(userState);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(useLocation().search);

  useEffect(() => {
    setLoading(true);

    if (import.meta.env.MODE === "staging") {
      sessionStorage.setItem("access_token", "641880e55febd60caa927162");
      cookies.access_token = "641880e55febd60caa927162";
      const devUser: User = {
        ...getGlobalState(),
        username: "Slavo",
        isLogged: true,
        menuList: [
          {
            path: "/library",
            name: "library",
            label: {
              zh_CN: "图书",
              en_US: "library",
            },
            icon: "library",
            key: "library",
          },
          {
            path: "/vocabulary",
            name: "vocabulary",
            label: {
              zh_CN: "词汇",
              en_US: "Vocabulary",
            },
            icon: "vocabulary",
            key: "vocabulary",
          },
        ],
        locale: "en-US",
        library: [],
        role: "guest",
        newUser: false,
        avatar: "",
        sourceLanguage: "en",
        targetLanguage: "sk",
        activated: true,
        verified: true,
        isLimitExceeded: false,
        subscribed: false,
        exceededAt: new Date(),
        userLibraries: [
          {
            libraryId: "6478fdc0d220b2b50883b874",
            timeStamp: 10,
          },
        ],
        picture:
          "https://lh3.googleusercontent.com/ogw/AOLn63G44ZepIWVlalbQumSaDkFtQfP2w3PHBvGPjSg1=s32-c-mo",
        subscriptionType: SubscriptionType.Linguist,
        subscriptionPeriod: SubscriptionPeriod.Monthly,
        email: "slavosmn@gmail.com",
        subscriptionId: "",
      };
      setUser(devUser);
      setLoading(false);
    } else if (
      (import.meta.env.MODE === "development" && cookies.access_token) ||
      (import.meta.env.MODE === "testing" && cookies.access_token)
    ) {
      sessionStorage.setItem("access_token", cookies.access_token);
      axios
        .get(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/current`, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          const userResponse = response.data.body;
          setUser({
            ...getGlobalState(),
            username: "Slavo",
            noticeCount: 0,
            isLogged: true,
            ...userResponse,
          });
          if (location.pathname === "/logout") {
            navigate("/logout");
            return; // Prevent further execution of the useEffect hook
          }
          if (response.data.status === "not-verified") {
            navigate(`/verification?code=${queryParams.get("code")}`);
            return;
          }
          if (response.data.status === "not-activated") {
            navigate("/activation");
            return; // Prevent further execution of the useEffect hook
          } else if (!userResponse?.verified) {
            console.log("okej" + JSON.stringify(userResponse));
            navigate("/verification");
          } else if (userResponse?.verified && userResponse.activated) {
          }
        })
        .catch((error) => {
          setLoading(false);

          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
          console.error(error);
        });
    } else {
      navigate("/login");
    }
  }, []);

  if (isLoading) {
    return <CustomSpinnerComponent spinning={true} />;
  }

  return auth ? (
    <Suspense fallback={<CustomSpinnerComponent spinning={true} />}>
      {children}
    </Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

export default WrapperRouteComponent;
