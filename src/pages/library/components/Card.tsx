import React, { useEffect, useState } from "react";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./Card.module.less";
import { Alert, Col, Progress, Row, Spin, Tooltip, Typography } from "antd";
import {
  CheckCircleOutlined,
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
  progress: number;
  selectedLanguageTo: string;
}

export const Card: React.FC<CardProps> = ({
  itemData,
  onCardHover,
  cardIndex,
  isHovered,
  progress,
  selectedLanguageTo,
}) => {
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isDelayPassed, setIsDelayPassed] = useState(false);
  const [transitionState, setTransitionState] = useState("");
  const [alertOneDone, setAlertOneDone] = useState(false);
  const [alertTwoDone, setAlertTwoDone] = useState(false);
  const [alertThreeDone, setAlertThreeDone] = useState(false);

  useEffect(() => {
    if (progress >= 33) {
      setAlertOneDone(true);
    }
    if (progress >= 66) {
      setAlertTwoDone(true);
    }
    if (progress >= 99) {
      setAlertThreeDone(true);
    }
  }, [progress]);

  const isOngoingEvent =
    localStorage.getItem("ongoingEventId") === itemData.eventId;

  useEffect(() => {
    let timeoutId: any;
    if (isHovered) {
      timeoutId = setTimeout(() => {
        console.log("isDelayPassed" + JSON.stringify(isDelayPassed, null, 2));
        setIsImgHovered(true);
        setIsDelayPassed(true);
      }, 400);
    } else {
      timeoutId = setTimeout(() => {
        setIsDelayPassed(false);
        setIsImgHovered(false);
      }, 100);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isHovered, isDelayPassed, isImgHovered]);

  const handleMouseEnter = () => {
    onCardHover(cardIndex);
    setTransitionState("scalingUp");
  };

  const handleMouseLeave = () => {
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
          to={
            itemData._id +
            "?currentPage=" +
            1 +
            "&pageSize=" +
            10 +
            "&targetLanguage=" +
            selectedLanguageTo
          }
          style={{ color: "inherit" }}
        >
          {isOngoingEvent || itemData._id === "temp-item" ? (
            <div className={styles.imageContainer}>
              <img
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`${styles.cardImg}`}
                src={itemData.videoThumbnail}
                alt="card"
              />
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={styles.whiteOverlay}
              ></div>
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={styles.progressCircle}
              >
                <Progress
                  type="circle"
                  percent={progress}
                  showInfo={false}
                  width={90}
                />
                <div className={styles.spinnerContainer}>
                  <Spin size="default" />
                  <div className={styles.percentage}>{progress}%</div>
                </div>
              </div>
              <div className={styles.alertsContainer}>
                <Alert
                  style={{ padding: "2px 10px" }}
                  message={
                    alertOneDone ? (
                      <span>
                        <CheckCircleOutlined style={{ marginRight: "5px" }} />
                        <Typography.Text>
                          Text is processed by AI
                        </Typography.Text>
                      </span>
                    ) : (
                      <span>
                        <Spin size="small" style={{ marginRight: "5px" }} />
                        <Typography.Text>
                          Text is processing by AI
                        </Typography.Text>
                      </span>
                    )
                  }
                  showIcon={false}
                  banner
                />
                <Alert
                  style={{ padding: "2px 10px" }}
                  message={
                    alertTwoDone ? (
                      <span>
                        <CheckCircleOutlined style={{ marginRight: "5px" }} />
                        <Typography.Text>
                          Sentences are translated
                        </Typography.Text>
                      </span>
                    ) : (
                      <span>
                        <Spin size="small" style={{ marginRight: "5px" }} />
                        <Typography.Text>
                          Sentences are translating
                        </Typography.Text>
                      </span>
                    )
                  }
                  showIcon={false}
                  banner
                />
                <Alert
                  style={{ padding: "2px 10px" }}
                  message={
                    alertThreeDone ? (
                      <span>
                        <CheckCircleOutlined style={{ marginRight: "5px" }} />
                        <Typography.Text>Words are translated</Typography.Text>
                      </span>
                    ) : (
                      <span>
                        <Spin size="small" style={{ marginRight: "5px" }} />
                        <Typography.Text>Words are translating</Typography.Text>
                      </span>
                    )
                  }
                  showIcon={false}
                  banner
                />
              </div>
            </div>
          ) : (
            <img
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.cardImg}`}
              src={itemData.videoThumbnail}
              alt="card"
            />
          )}
        </Link>
        {itemData._id !== "temp-item" ? (
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Card;
