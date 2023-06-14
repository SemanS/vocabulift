import React from "react";

import { ReactComponent as EnUsSvg } from "@/assets/header/en_US.svg";
import { ReactComponent as SkSkSvg } from "@/assets/header/sk_SK.svg";

import enUS from "@/locales/en-us";
import skSK from "@/locales/sk-sk";

export const localeConfig = [
  {
    name: "English",
    key: "en-US",
    messages: enUS,
    icon: <EnUsSvg />,
  },
  {
    name: "Slovak",
    key: "sk-SK",
    messages: skSK,
    icon: <SkSkSvg />,
  },
];
