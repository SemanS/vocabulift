import React, { lazy, FC } from "react";
import Dashboard from "@/pages/dashboard";
import { useRoutes, RouteObject } from "react-router-dom";
import { GlobalStyles } from "@/pages/webLayout/styles/GlobalStyles";
const LoginPage = lazy(() => import("@/pages/login"));
const WrapperRouteComponent = lazy(() => import("./config"));
const LayoutPage = lazy(() => import("@/pages/layout"));
const BookDetail = lazy(() => import("@/pages/bookDetail"));
const NotFound = lazy(() => import("@/pages/404"));
const Library = lazy(() => import("@/pages/library"));
const Vocabulary = lazy(() => import("@/pages/vocabulary"));
//import Library from "@/pages/library";

const WebLayoutPage = lazy(() => import("@/pages/webLayout"));
const routeList: RouteObject[] = [
  {
    element: (
      <WrapperRouteComponent>
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
    path: "/login",
    element: <LoginPage />,
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
