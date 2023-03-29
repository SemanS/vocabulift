import React, { lazy, FC } from "react";

import Dashboard from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import LayoutPage from "@/pages/layout";
import WrapperRouteComponent from "./config";
import { useRoutes, RouteObject } from "react-router-dom";
import BookDetail from "@/pages/bookDetail";
import Books from "@/pages/books";
import Vocabulary from "@/pages/vocabulary";
import WebLayoutPage from "@/pages/webLayout";

const NotFound = lazy(() => import("@/pages/404"));
//const Project = lazy(() => import("@/pages/project"));

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
        path: "/books/:libraryId",
        element: (
          <WrapperRouteComponent auth={true}>
            <BookDetail />
          </WrapperRouteComponent>
        ),
      },
      {
        path: "/books",
        element: (
          <WrapperRouteComponent auth={true}>
            <Books />
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
      <WrapperRouteComponent>
        <WebLayoutPage />
      </WrapperRouteComponent>
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
