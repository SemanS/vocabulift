import { Row, Col, Typography, Carousel } from "antd";
import { SvgIcon } from "../../../common/SvgIcon";
import { IContentBlockProps } from "../types";
import { Fade } from "react-awesome-reveal";
import {
  LeftContentSection,
  Content,
  ContentWrapper,
  ServiceWrapper,
  MinTitle,
  MinPara,
} from "./styles";
import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import styled from "styled-components";

const StyledCarouselContainer = styled.div`
  background: #364d79; // Set the background color to match the Carousel
  padding-top: 50px; // Add top padding to create space in the color of the Carousel
`;

const LeftContentBlock = ({
  icon,
  title,
  content,
  section,
  id,
  className,
}: IContentBlockProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  const contentStyle: React.CSSProperties = {
    height: "auto",
    color: "#fff",
    lineHeight: "1.5",
    textAlign: "center",
    background: "#364d79",
    padding: "40px",
  };

  const testimonials = [
    {
      id: 1,
      author: "Libor, Executive at a leading tech company",
      position: "CEO",
      company: "Innovatech",
      quote:
        "VocabuLift has prepared all the lessons, content, quizzes, and everything according to our needs. All content was created with our business focus in mind, so our employees get acquainted with the focus of our business exclusively through VocabuLift. We also use the entire platform as a tool for education in cooperation with instructors provided by VocabuLift.",
      imageUrl: "https://example.com/path/to/image.jpg",
    },
    {
      id: 2,
      author: "Juan, Lector",
      position: "Marketing Director",
      company: "Creatix",
      quote:
        "In my role as a VocabuLift instructor, I deliver a curriculum that is precisely customized to reflect the goals and needs of each organization. The platform provides a comprehensive suite of educational tools that includes lessons, content, and quizzes, all designed to align closely with the company's core objectives. This approach ensures that the training is relevant and directly supports the business’s strategic initiatives, making it a pivotal element of their professional development framework.",
      imageUrl: "https://example.com/path/to/image2.jpg",
    },
    {
      id: 3,
      author: "Joseph, User",
      position: "Product Manager",
      company: "TechAdventures",
      quote:
        "As a user, I found Duolingo's gamification appealing, yet its one-size-fits-all approach and gentle learning curve did not meet my personalized learning needs. In contrast, VocabuLift has proven to be a sophisticated tool that effectively leverages AI to tailor content specifically to my professional and personal learning objectives. This advanced customization facilitates a more rigorous and relevant educational experience, significantly enhancing my learning efficiency and engagement.",
      imageUrl: "https://example.com/path/to/image3.jpg",
    },
  ];

  return (
    <StyledCarouselContainer>
      <Fade direction="right" triggerOnce>
        <Carousel autoplay id={id} dotPosition="top" autoplaySpeed={5000}>
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              <p style={contentStyle}>
                {testimonial.quote}
                <br />
                <br />
                <br />
                <small>- {testimonial.author}</small>
              </p>
            </div>
          ))}
        </Carousel>
      </Fade>
    </StyledCarouselContainer>
  );
};

export default LeftContentBlock;
