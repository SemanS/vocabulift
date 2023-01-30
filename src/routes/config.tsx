import React, { FC } from "react";
import { Route } from "react-router-dom";
import { PathRouteProps } from "react-router";
import PrivateRoute from "./privateRoute";
import { useIntl } from "react-intl";

export interface WrapperRouteProps extends PathRouteProps {
  /** authorization？ */
  auth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, children }) => {
  const { formatMessage } = useIntl();

  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return <>{children}</>;
};

export default WrapperRouteComponent;
