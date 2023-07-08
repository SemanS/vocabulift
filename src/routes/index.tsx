import React, { lazy, FC } from "react";
import Dashboard from "@/pages/dashboard";
import { useRoutes, RouteObject } from "react-router-dom";
import { GlobalStyles } from "@/pages/webLayout/styles/GlobalStyles";
const LoginPage = lazy(() => import("@/pages/login"));
const CookiePolicy = lazy(() => import("@/pages/cookie-policy"));
const VerificationPage = lazy(() => import("@/pages/verification"));
const ActivationPage = lazy(() => import("@/pages/activation"));
const RegistrationPage = lazy(() => import("@/pages/registration"));
const WrapperRouteComponent = lazy(() => import("./config"));
const LayoutPage = lazy(() => import("@/pages/layout"));
const BookDetail = lazy(() => import("@/pages/bookDetail"));
const NotFound = lazy(() => import("@/pages/404"));
const Library = lazy(() => import("@/pages/library"));
const Vocabulary = lazy(() => import("@/pages/vocabulary"));

const WebLayoutPage = lazy(() => import("@/pages/webLayout"));
const routeList: RouteObject[] = [
  {
    element: (
      <WrapperRouteComponent auth={true}>
        <LayoutPage />
      </WrapperRouteComponent>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <WrapperRouteComponent auth={true}>
            <Dashboard />
          </WrapperRouteComponent>
        ),
      },
      {
        path: "/library/:libraryId",
        element: (
          <WrapperRouteComponent auth={true}>
            <BookDetail />
          </WrapperRouteComponent>
        ),
      },
      {
        path: "/library",
        element: (
          <WrapperRouteComponent auth={true}>
            <Library />
          </WrapperRouteComponent>
        ),
      },
      {
        path: "/vocabulary",
        element: (
          <WrapperRouteComponent auth={true}>
            <Vocabulary />
          </WrapperRouteComponent>
        ),
      },
      {
        path: "*",
        element: (
          <WrapperRouteComponent>
            <NotFound />
          </WrapperRouteComponent>
        ),
      },
    ],
  },
  {
    path: "/",
    element: (
      <>
        <WebLayoutPage />
        <GlobalStyles />
      </>
    ),
  },
  {
    path: "/cookie-policy",
    element: (
      <>
        <CookiePolicy />
        <GlobalStyles />
      </>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  {
    path: "/activation",
    element: (
      <WrapperRouteComponent auth={true}>
        <ActivationPage />
      </WrapperRouteComponent>
    ),
  },
  {
    path: "/verification",
    element: (
      <WrapperRouteComponent auth={true}>
        <VerificationPage />
      </WrapperRouteComponent>
    ),
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
