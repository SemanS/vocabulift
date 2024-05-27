import React from "react";
import { Container, TextWrapper, Content } from "./styles";

interface Props {
  title: string;
  content: string;
}

export const Block = ({ title, content }: Props) => {
  return (
    <Container>
      <div className="custom-heading">{title}</div>
      <TextWrapper>
        <Content>{content}</Content>
      </TextWrapper>
    </Container>
  );
};

export default Block;
