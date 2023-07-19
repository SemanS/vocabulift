import React from "react";
import { ISvgIconProps } from "../types";

export const SvgIcon = ({
  src,
  code,
  width,
  height,
  onClick,
  className,
  style,
}: ISvgIconProps) => {
  // If a code is provided, use it to build the source string. Otherwise, use the provided src directly.
  const source = code ? `src/assets/flags/${code}.svg` : src;

  return (
    <img
      src={source}
      alt={source}
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      style={style}
    />
  );
};
