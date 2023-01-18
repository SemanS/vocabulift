import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';
import {useNavigate} from "react-router-dom"

interface Book {
  name: string;
  title: string;
  author: string;
  cover: string;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setBooks([
        { name: 'book1', title: 'book1', author: 'Author 1', cover: 'image1.jpg' },
        { name: 'book2', title: 'book2', author: 'Author 2', cover: 'image2.jpg' },
        { name: 'book3', title: 'book3', author: 'Author 3', cover: 'image3.jpg' },
        { name: 'book4', title: 'book4', author: 'Author 4', cover: 'image4.jpg' },
      ]);
    }, 10);
  }, []);

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={books}
      renderItem={(book: Book) => (
        <List.Item>
          <Card
            hoverable
            cover={<img alt={book.title} />}
            onClick={() => {
              navigate(`/books/${book.title}`);
            }}
          >
            <Card.Meta title={book.title} description={book.author} />
          </Card>
        </List.Item>
      )}
    />
  );
};
