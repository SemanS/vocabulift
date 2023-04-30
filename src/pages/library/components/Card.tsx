import React, { useEffect, useState } from "react";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./Card.module.less";
import { Col, Row, Tooltip, Typography } from "antd";
import {
  DislikeOutlined,
  LikeOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface CardProps {
  itemData: LibraryItem;
  onCardHover: (hoveredIndex: number | null) => void;
  cardIndex: number;
  isHovered: boolean;
}

export const Card: React.FC<CardProps> = ({
  itemData,
  onCardHover,
  cardIndex,
  isHovered,
}) => {
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isDelayPassed, setIsDelayPassed] = useState(false);
  const [transitionState, setTransitionState] = useState("");

  useEffect(() => {
    let timeoutId: any;
    if (isHovered) {
      timeoutId = setTimeout(() => {
        setIsDelayPassed(true);
      }, 300);
    } else {
      timeoutId = setTimeout(() => {
        setIsDelayPassed(false);
      }, 300);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isHovered, isDelayPassed]);

  const handleMouseEnter = () => {
    setIsImgHovered(true);
    onCardHover(cardIndex);
    setTransitionState("scalingUp");
  };

  const handleMouseLeave = () => {
    setIsImgHovered(false);
    onCardHover(null);
    setTransitionState("scalingDown");
  };

  const cardClassName = classNames("slick-slide", {
    conditionalZIndex: isDelayPassed,
  });

  return (
    <div
      className={cardClassName}
      data-index={cardIndex}
      onMouseEnter={() => onCardHover(cardIndex)}
      onMouseLeave={() => onCardHover(null)}
    >
      <div
        className={`${styles.cardContainer} ${
          isImgHovered ? styles.zoomedImage : ""
        } ${styles[transitionState]}`}
      >
        <Link
          to={itemData.id + "?currentPage=" + 1 + "&pageSize=" + 10}
          style={{ color: "inherit" }}
        >
          <img
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`${styles.cardImg} `}
            src={itemData.videoThumbnail}
            alt="card"
          />
        </Link>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`${styles.details} ${
            isImgHovered ? styles.visibleDetails : ""
          } ${isImgHovered ? styles.zoomedDetails : ""} ${
            isImgHovered ? styles.hoverDetailsTransition : ""
          }`}
          style={{ pointerEvents: isImgHovered ? undefined : "none" }}
        >
          <Row>
            <Col span={4}>
              <PlayCircleOutlined
                className={`${styles.playIcon} ${
                  isImgHovered ? styles.playIconHovered : ""
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
                Level: {itemData.level}
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text style={{ fontSize: "10px" }}>
                Duration: 11:22
              </Typography.Text>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Card;
