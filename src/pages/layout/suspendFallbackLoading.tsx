import React, { FC } from "react";
import { Spin, Alert } from "antd";
import CustomSpinnerComponent from "@/pages/spinner/CustomSpinnerComponent";

const SuspendFallbackLoading: FC = () => {
  return <CustomSpinnerComponent spinning={true}></CustomSpinnerComponent>;
};

export default SuspendFallbackLoading;
