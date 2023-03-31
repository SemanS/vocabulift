import React, { lazy, FC, Suspense } from "react";

import Dashboard from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import LayoutPage from "@/pages/layout";
import WrapperRouteComponent from "./config";
import { useRoutes, RouteObject, Routes, Route } from "react-router-dom";
import BookDetail from "@/pages/bookDetail";
import Books from "@/pages/books";
import Vocabulary from "@/pages/vocabulary";
//import WebLayoutPage from "@/pages/webLayout";
import Footer from "@/pages/webLayout/shared/components/Footer";
import Header from "@/pages/webLayout/shared/components/Header";
import { GlobalStyles } from "@/pages/webLayout/styles/GlobalStyles";
const NotFound = lazy(() => import("@/pages/404"));
//const Project = lazy(() => import("@/pages/project"));
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
