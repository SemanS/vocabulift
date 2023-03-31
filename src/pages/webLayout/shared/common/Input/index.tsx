import { Container, StyledInput } from "./styles";
import { Label } from "../TextArea/styles";
import { IInputProps } from "../types";
import React from "react";

export const Input = ({ name, placeholder, onChange }: IInputProps) => (
  <Container>
    <Label htmlFor={name}>{name}</Label>
    <StyledInput
      placeholder={placeholder}
      name={name}
      id={name}
      onChange={onChange}
    />
  </Container>
);

export default Input;
