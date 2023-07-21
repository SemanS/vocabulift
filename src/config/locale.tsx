import React from "react";

import { ReactComponent as EnUsSvg } from "@/assets/header/en_US.svg";
import { ReactComponent as SkSkSvg } from "@/assets/header/sk_SK.svg";

import enUS from "@/locales/en-us";
import skSK from "@/locales/sk-sk";
import esES from "@/locales/es-es";
import frFR from "@/locales/fr-fr";
import deDE from "@/locales/de-de";
import csCZ from "@/locales/cs-cz";
import plPL from "@/locales/pl-pl";
import huHU from "@/locales/hu-hu";
import itIT from "@/locales/it-it";
import { getFlagCode } from "@/utils/utilMethods";
import { SvgIcon } from "@/pages/webLayout/shared/common/SvgIcon";

export const localeConfig = [
  {
    name: "English",
    key: "en-US",
    messages: enUS,
    icon: <SvgIcon code={getFlagCode("en")} height="16" />,
  },
  {
    name: "Spanish",
    key: "es-ES",
    messages: esES,
    icon: <SvgIcon code={getFlagCode("es")} height="16" />,
  },
  {
    name: "French",
    key: "fr-FR",
    messages: frFR,
    icon: <SvgIcon code={getFlagCode("fr")} height="16" />,
  },
  {
    name: "German",
    key: "de-DE",
    messages: deDE,
    icon: <SvgIcon code={getFlagCode("de")} height="16" />,
  },
  {
    name: "Czech",
    key: "cs-CZ",
    messages: csCZ,
    icon: <SvgIcon code={getFlagCode("cz")} height="16" />,
  },
  {
    name: "Slovak",
    key: "sk-SK",
    messages: skSK,
    icon: <SvgIcon code={getFlagCode("sk")} height="16" />,
  },
  {
    name: "Polish",
    key: "pl-PL",
    messages: plPL,
    icon: <SvgIcon code={getFlagCode("pl")} height="16" />,
  },
  {
    name: "Hungarian",
    key: "hu-HU",
    messages: huHU,
    icon: <SvgIcon code={getFlagCode("hu")} height="16" />,
  },
  {
    name: "Italian",
    key: "it-IT",
    messages: itIT,
    icon: <SvgIcon code={getFlagCode("it")} height="16" />,
  },
];
