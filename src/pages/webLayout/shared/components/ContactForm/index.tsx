import { Row, Col, Card } from "antd";
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
import { notification } from "antd";

const Contact = ({ title, content, id }: IContactProps) => {
  const { values, errors, handleChange } = useForm(validate) as any;

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate the form data

    fetch(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values), // Where values are the form data
    })
      .then((response) => {
        if (response.ok) {
          // If the response was successful, show a success notification
          notification.success({
            message: "Success",
            description: "Your message has been sent successfully.",
          });
          return response.json();
        } else {
          // If the response was unsuccessful, throw an error
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        // Handle response data
      })
      .catch((error) => {
        // If there was an error, show an error notification
        notification.error({
          message: "Error",
          description: "There was an error sending your message.",
        });
      });
  };

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
      <Card style={{ borderRadius: "15px" }}>
        <Row gutter={[24, 24]} style={{ marginTop: "25px" }}>
          <Col lg={2} md={2} sm={2} xs={2} />
          <Col lg={8} md={8} sm={20} xs={20}>
            <Slide direction="left" triggerOnce>
              <Block
                title={"Crafted in Slovakia"}
                content={
                  "Your thoughts and feedback fuel our innovation. Whether it's a question, suggestion, or just a hello, we're excited to hear from you."
                }
              />
            </Slide>
          </Col>
          <Col lg={2} md={2} sm={2} xs={2} />
          <Col lg={2} md={2} sm={2} xs={2} />
          <Col lg={8} md={8} sm={20} xs={20}>
            <Slide direction="right" triggerOnce>
              <FormGroup autoComplete="off" onSubmit={handleSubmit}>
                <Row>
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

                  <Col span={24}>
                    <ButtonContainer
                      style={{ marginTop: "15px", marginBottom: "10px" }}
                    >
                      <Button name="submit">{"Submit"}</Button>
                    </ButtonContainer>
                  </Col>
                </Row>
              </FormGroup>
            </Slide>
          </Col>
          <Col lg={2} md={2} sm={2} xs={2} />
        </Row>
      </Card>
    </ContactContainer>
  );
};

export default Contact;
