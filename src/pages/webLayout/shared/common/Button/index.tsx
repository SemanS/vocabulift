import { StyledButton } from "./styles";
import { IButtonProps } from "../types";
import React from "react";

export const Button = ({
  color,
  fixedWidth,
  children,
  onClick,
  disabled,
}: IButtonProps) => (
  <StyledButton
    color={color}
    fixedWidth={fixedWidth}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </StyledButton>
);

export default Button;
