import React from "react";

import { ReactComponent as ZhCnSvg } from "@/assets/header/zh_CN.svg";
import { ReactComponent as EnUsSvg } from "@/assets/header/en_US.svg";
import { ReactComponent as SkSkSvg } from "@/assets/header/sk_SK.svg";

import enUS from "@/locales/en-us";
import zhCN from "@/locales/zh-cn";
import skSK from "@/locales/sk-sk";

export const localeConfig = [
  {
    name: "English",
    key: "en-us",
    messages: enUS,
    icon: <EnUsSvg />,
  },
  {
    name: "简体中文",
    key: "zh-cn",
    messages: zhCN,
    icon: <ZhCnSvg />,
  },
  {
    name: "Slovak",
    key: "sk-sk",
    messages: skSK,
    icon: <SkSkSvg />,
  },
];
