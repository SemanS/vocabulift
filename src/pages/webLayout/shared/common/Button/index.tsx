import { StyledButton } from "./styles";
import { IButtonProps } from "../types";
import React from "react";

export const Button = ({
  color,
  fixedWidth,
  children,
  onClick,
}: IButtonProps) => (
  <StyledButton color={color} fixedWidth={fixedWidth} onClick={onClick}>
    {children}
  </StyledButton>
);
