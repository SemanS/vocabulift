import React, { useRef, useState } from "react";

import "../index.module.less";
import Card from "./Card";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "../index.module.less";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CustomSliderProps {
  items: LibraryItem[];
  sliderId: string;
  category: string;
  progress: number;
  selectedLanguageTo: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  items,
  sliderId,
  category,
  progress,
  selectedLanguageTo,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    draggable: false,
    className: "slick-slider",
    responsive: [
      {
        breakpoint: 1980,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 1490,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const sliderClassName = `slider_${sliderId}`;
  const onCardHover = (hoveredIndex: number | null) => {
    setTimeout(() => {
      setHoveredCardIndex(hoveredIndex);
    });
  };
  return (
    <div
      className={`${
        showControls ? styles.showControls : ""
      } ${sliderClassName}`}
      onMouseEnter={() => {
        if (timeoutId) clearTimeout(timeoutId);

        // Set a new timeout
        setTimeoutId(setTimeout(() => setShowControls(true), 800));
      }}
      onMouseLeave={() => {
        if (timeoutId) clearTimeout(timeoutId);

        // Set a new timeout
        setTimeoutId(setTimeout(() => setShowControls(false), 500));
      }}
    >
      <h1 style={{ color: "white" }}>{category}</h1>
      <div className={`${styles.slider}`}>
        <Slider {...settings} ref={sliderRef}>
          {items.map((item, index) => {
            return (
              <Card
                key={index}
                itemData={item}
                onCardHover={onCardHover}
                cardIndex={index}
                isHovered={hoveredCardIndex === index}
                progress={progress}
                selectedLanguageTo={selectedLanguageTo}
              />
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default CustomSlider;
