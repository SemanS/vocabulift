import React, { FC } from "react";
import { Spin, Alert } from "antd";

const SuspendFallbackLoading: FC = () => {
  return <Spin tip="Loading..."></Spin>;
};

export default SuspendFallbackLoading;
