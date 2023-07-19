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
import Flag from "react-world-flags";
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
    icon: <Flag code={getFlagCode("es")} height="16" />,
  },
  {
    name: "French",
    key: "fr-FR",
    messages: frFR,
    icon: <Flag code={getFlagCode("fr")} height="16" />,
  },
  {
    name: "German",
    key: "de-DE",
    messages: deDE,
    icon: <Flag code={getFlagCode("de")} height="16" />,
  },
  {
    name: "Czech",
    key: "cs-CZ",
    messages: csCZ,
    icon: <Flag code={getFlagCode("cz")} height="16" />,
  },
  {
    name: "Slovak",
    key: "sk-SK",
    messages: skSK,
    icon: <Flag code={getFlagCode("sk")} height="16" />,
  },
  {
    name: "Polish",
    key: "pl-PL",
    messages: plPL,
    icon: <Flag code={getFlagCode("pl")} height="16" />,
  },
  {
    name: "Hungarian",
    key: "hu-HU",
    messages: huHU,
    icon: <Flag code={getFlagCode("hu")} height="16" />,
  },
  {
    name: "Italian",
    key: "it-IT",
    messages: itIT,
    icon: <Flag code={getFlagCode("it")} height="16" />,
  },
];
