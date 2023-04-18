import React, { useState } from "react";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "./Card.module.less";

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
    <div className={styles.card}>
      <img
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${styles.cardImg} ${isHovered ? styles.zoomedImage : ""} ${
          isHovered ? styles.hoverTransition : ""
        }`}
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
        <h3>{itemData.title}</h3>
        <div>{itemData.description}</div>
      </div>
    </div>
  );
};

export default Card;
