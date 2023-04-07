import React, { useEffect, useState } from "react";
import { List, Progress, Col, Row, Card, Typography } from "antd";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { getLibraryItems } from "@/services/libraryService";
import { LibraryItem } from "@/models/libraryItem.interface";
import classNames from "classnames";
import styles from "./index.module.less";
import { ReadOutlined } from "@ant-design/icons";
import { getUserLibraryItems } from "@/services/userService";
import { UserLibraryItem } from "@/models/userLibraryItem.interface";
import { PageContainer } from "@ant-design/pro-layout";
import { mergeObjects } from "@/utils/mergeItems";
import {
  libraryIdState,
  currentPageState,
  pageSizeState,
} from "@/stores/library";

const Library: React.FC = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [activeCard, setActiveCard] = useState<string>("");
  const [userLibraryItems, setUserLibraryItems] = useState<UserLibraryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const setLibraryId = useSetRecoilState(libraryIdState);
  const setCurrentPage = useSetRecoilState(currentPageState);
  const setPageSize = useSetRecoilState(pageSizeState);

  const fetchData = async () => {
    await getLibraryItems(
      sessionStorage.getItem("access_token"),
      (data: LibraryItem[]) => {
        setLibraryItems(data);
      }
    );
    await getUserLibraryItems(
      sessionStorage.getItem("access_token"),
      (data: UserLibraryItem[]) => {
        setUserLibraryItems(data);
      }
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  function calculateBookPercentage(
    page: number,
    sentencesPerPage: number,
    totalSentences: number
  ) {
    const totalPages = Math.ceil(totalSentences / sentencesPerPage);
    const percentage = (Math.min(page, totalPages) / totalPages) * 100;
    return Math.floor(percentage) === 99 && page < totalSentences
      ? 99
      : Math.ceil(percentage);
  }

  const combinedItems = mergeObjects(
    libraryItems,
    userLibraryItems,
    (libraryItem, userLibraryItem) =>
      userLibraryItem.libraryId === libraryItem.id,
    (libraryItem, userLibraryItem) => ({
      ...libraryItem,
      userLibrary: {
        id: userLibraryItem.id,
        libraryId: userLibraryItem.libraryId,
        sourceLanguage: userLibraryItem.sourceLanguage,
        targetLanguage: userLibraryItem.targetLanguage,
        pageSize: userLibraryItem.pageSize,
        lastReadPage: userLibraryItem.lastReadPage,
      },
    })
  );

  const handleLibraryItemClick = (
    libraryId: string,
    currentPage: number,
    pageSize: number
  ) => {
    setLibraryId(libraryId);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  return (
    <PageContainer loading={loading}>
      <Card
        style={{ borderRadius: 0, marginTop: "12px" }}
        className={classNames(styles.gridLayout)}
        loading={loading}
      >
        {combinedItems.map((item) => (
          <Card.Grid
            key={item.title}
            className={classNames({
              [styles.gridItemHover]: activeCard === item.title,
            })}
            onMouseEnter={() => setActiveCard(item.title)}
            onMouseLeave={() => setActiveCard("")}
          >
            <Link
              onClick={() => handleLibraryItemClick(item.id, 1, 10)}
              to={item.id + "?currentPage=" + 1 + "&pageSize=" + 10}
              style={{ color: "inherit" }}
            >
              <Row gutter={[32, 32]}>
                <Col xs={24} sm={24} md={24} xl={12} xxl={12}>
                  <div className={classNames(styles.gridItemContent)}>
                    <div>
                      <ReadOutlined style={{ marginRight: "5px" }} />
                      <strong>{item.title}</strong>
                    </div>
                    <div style={{ marginTop: "16px" }}>{item.description}</div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12} xxl={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div className={classNames(styles.imageWrapper)}>
                      <img
                        style={{ width: "100%", height: "100%" }}
                        alt="logo"
                        src={`src/assets/books/The_Adventures_of_huckleberry_Finn.jpg`}
                      />
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <Typography.Text strong>Level:</Typography.Text>
                      <Typography.Text> C2</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text strong>Sentences:</Typography.Text>
                      <Typography.Text> 5603</Typography.Text>
                    </div>
                    <div
                      className={classNames(styles.progressContainer)}
                      style={{ marginTop: "auto" }}
                    >
                      {/* {item.totalSentences == 5603 && (
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
                      )} */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Link>
          </Card.Grid>
        ))}
      </Card>

      <Card
        title="Card title"
        style={{ borderRadius: "0px" }}
        className={classNames(styles.listLayout)}
      >
        <List
          itemLayout="vertical"
          dataSource={libraryItems}
          renderItem={(item) => (
            <List.Item key={item.title}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <img
                    style={{ width: "100%", height: "auto" }}
                    alt="logo"
                    src={`src/assets/books/Alice_in_the_wonderland.jpg`}
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
                          <Link
                            to={
                              ""
                              /* item.href +
                          "?currentPage=" +
                          item.lastReadPage +
                          "&pageSize=" +
                          item.pageSize */
                            }
                          >
                            {item.title}
                          </Link>
                        }
                        description={item.description}
                      />
                      {item.description}
                    </div>
                    <div>
                      {/* <Progress
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
                  /> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default Library;
