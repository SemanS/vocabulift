import { Row, Col } from "antd";
import { Slide, Zoom } from "react-awesome-reveal";
import { IContactProps, IValidationTypeProps } from "./types";
import { useForm } from "../../common/utils/useForm";
import validate from "../../common/utils/validationRules";
import { Button } from "../../common/Button";
import Block from "../Block";
import Input from "../../common/Input";
import TextArea from "../../common/TextArea";
import { ContactContainer, FormGroup, Span, ButtonContainer } from "./styles";
import React from "react";

const Contact = ({ title, content, id }: IContactProps) => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    validate
  ) as any;

  const ValidationType = ({ type }: IValidationTypeProps) => {
    const ErrorMessage = errors[type];
    return (
      <Zoom direction="left">
        <Span erros={errors[type]}>{ErrorMessage}</Span>
      </Zoom>
    );
  };

  return (
    <ContactContainer id={id}>
      <Row justify="space-between" align="middle">
        <Col lg={2} md={2} sm={2} xs={2} />
        <Col lg={10} md={10} sm={22} xs={22}>
          <Slide direction="left" triggerOnce>
            <Block
              title={"Proudly crafted in Slovakia"}
              content={
                "Your thoughts and feedback fuel our innovation. Whether it's a question, suggestion, or just a hello, we're excited to hear from you."
              }
            />
          </Slide>
        </Col>
        <Col lg={10} md={10} sm={22} xs={22}>
          <Slide direction="right" triggerOnce>
            <FormGroup autoComplete="off" onSubmit={handleSubmit}>
              <Col span={24}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={values.name || ""}
                  onChange={handleChange}
                />
                <ValidationType type="name" />
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  name="email"
                  placeholder="Your Email"
                  value={values.email || ""}
                  onChange={handleChange}
                />
                <ValidationType type="email" />
              </Col>
              <Col span={24}>
                <TextArea
                  placeholder="Your Message"
                  value={values.message || ""}
                  name="message"
                  onChange={handleChange}
                />
                <ValidationType type="message" />
              </Col>
              <ButtonContainer>
                <Button name="submit">{"Submit"}</Button>
              </ButtonContainer>
            </FormGroup>
          </Slide>
        </Col>
        <Col lg={2} md={2} sm={2} xs={2} />
      </Row>
    </ContactContainer>
  );
};

export default Contact;
