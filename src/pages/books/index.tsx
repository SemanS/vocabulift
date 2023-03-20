import React, { useState, useEffect } from "react";
import { List, Card, Avatar, Progress, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

interface Book {
  name: string;
  title: string;
  author: string;
  cover: string;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  const data = [
    {
      href: "/books/The Adventures of Huckleberry Finn",
      title: `The Adventures of Huckleberry Finn`,
      description: "Book",
      image: "The_Adventures_of_Huckleberry_Finn.jpg",
      content:
        "The Adventures of Huckleberry Finn, written by Mark Twain, is a classic American novel that follows the story of Huck Finn, a young boy who embarks on a journey of self-discovery and moral growth along the Mississippi River.",
    },
    {
      href: "/books/Alice in the wonderland",
      title: `Alice in the Wonderland`,
      description: "Book",
      image: "Alice_in_the_wonderland.jpg",
      content:
        "Alice's Adventures in Wonderland, penned by Lewis Carroll, is a whimsical and imaginative tale that chronicles the journey of a young girl named Alice as she falls down a rabbit hole into a fantastical world filled with peculiar characters and nonsensical logic.",
    },
  ];

  return (
    <List
      itemLayout="vertical"
      dataSource={data}
      renderItem={(item) => (
        <List.Item key={item.title}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <img
                style={{ width: "100%", height: "auto" }}
                alt="logo"
                src={`src/assets/books/${item.image}`}
              />
            </Col>
            <Col xs={24} md={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <div>
                  <List.Item.Meta
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.description}
                  />
                  {item.content}
                </div>
                <div>
                  <Progress
                    percent={20}
                    strokeColor={{ "0%": "#000", "100%": "#000" }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default Books;
