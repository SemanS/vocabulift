import React, { useState, useEffect } from "react";
import { List, Progress, Col, Row } from "antd";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";

const Books: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

  function calculateBookPercentage(
    page: number,
    sentencesPerPage: number,
    totalSentences: number
  ) {
    const totalPages = Math.ceil(totalSentences / sentencesPerPage);
    const currentPage = Math.min(page, totalPages);
    const percentage = (currentPage / totalPages) * 100;
    return Math.ceil(percentage);
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={user.books}
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
                    title={
                      <a
                        href={
                          item.href +
                          "?currentPage=" +
                          item.lastReadPage +
                          "&pageSize=" +
                          item.pageSize
                        }
                      >
                        {item.title}
                      </a>
                    }
                    description={item.description}
                  />
                  {item.content}
                </div>
                <div>
                  <Progress
                    percent={
                      item.lastReadPage == 1
                        ? 1
                        : calculateBookPercentage(
                            item.lastReadPage,
                            item.pageSize,
                            item.totalSentences
                          )
                    }
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
