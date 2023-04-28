import React, { useState } from "react";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./Card.module.less";
import {
  Col,
  Divider,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DislikeOutlined,
  LikeOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

interface CardProps {
  itemData: LibraryItem;
}

export const Card: React.FC<CardProps> = ({ itemData }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={itemData.id + "?currentPage=" + 1 + "&pageSize=" + 10}
        style={{ color: "inherit" }}
      >
        <img
          className={`${styles.cardImg} ${
            isHovered ? styles.zoomedImage : ""
          } ${isHovered ? styles.hoverTransition : ""}`}
          src={itemData.videoThumbnail}
          alt="card"
        />

        <div
          className={`${styles.details} ${
            isHovered ? styles.visibleDetails : ""
          } ${isHovered ? styles.zoomedDetails : ""} ${
            isHovered ? styles.hoverDetailsTransition : ""
          }`}
        >
          <Row>
            <Col span={4}>
              <PlayCircleOutlined
                className={`${styles.playIcon} ${
                  isHovered ? styles.playIconHovered : ""
                }`}
              />
            </Col>
            <Col span={20}>
              <Typography.Text strong style={{ fontSize: "11px" }}>
                {itemData.title}
              </Typography.Text>
            </Col>
          </Row>
          <Row align="middle" className={styles.stats}>
            <Col span={4}>
              <Tooltip title="Likes">
                <LikeOutlined style={{ fontSize: "10px" }} />
              </Tooltip>
              <Typography.Text className={styles.likeDislikeCount}>
                <span style={{ fontSize: "10px" }}>{4}</span>
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Tooltip title="Dislikes">
                <DislikeOutlined style={{ fontSize: "10px" }} />
              </Tooltip>
              <Typography.Text className={styles.likeDislikeCount}>
                <span style={{ fontSize: "10px" }}>{2}</span>
              </Typography.Text>
            </Col>
          </Row>
          <Typography.Text
            className={styles.description}
            style={{ fontSize: "10px" }}
          >
            {itemData.description}
          </Typography.Text>

          <div className={styles.customDivider} />

          <Row justify="space-between">
            <Col>
              <Typography.Text style={{ fontSize: "10px" }}>
                Level: C1
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text style={{ fontSize: "10px" }}>
                Duration: 11:22
              </Typography.Text>
            </Col>
          </Row>
        </div>
      </Link>
    </div>
  );
};

export default Card;
