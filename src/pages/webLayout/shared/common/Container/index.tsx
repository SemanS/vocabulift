import { StyledContainer } from "./styles";
import { IContainerProps } from "../types";
import React from "react";

const Container = ({ border, children }: IContainerProps) => (
  <StyledContainer border={border}>{children}</StyledContainer>
);

export default Container;
