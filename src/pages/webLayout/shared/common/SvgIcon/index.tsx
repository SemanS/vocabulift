import React from "react";
import { ISvgIconProps } from "../types";

export const SvgIcon = ({ src, width, height }: ISvgIconProps) => (
  <img src={`/img/svg/${src}`} alt={src} width={width} height={height} />
);
