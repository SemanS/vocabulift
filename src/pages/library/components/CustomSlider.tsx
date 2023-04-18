import React, { useRef, useState } from "react";

import "../index.module.less";
import Card from "./Card";
import { DeleteOutlined } from "@ant-design/icons";
import { LibraryItem } from "@/models/libraryItem.interface";
import styles from "../index.module.less";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CustomSliderProps {
  items: LibraryItem[];
  sliderId: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  items,
  sliderId,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);

  const sliderRef = useRef<Slider>(null);

  const handleDirection = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    if (direction === "left") {
      sliderRef.current.slickPrev();
    } else {
      sliderRef.current.slickNext();
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    draggable: false,
    className: "slick-slider",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
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
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };

  const sliderClassName = `slider_${sliderId}`;
  return (
    <div
      className={`${
        showControls ? styles.showControls : ""
      } ${sliderClassName}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1>{sliderId}</h1>
      <div className={`${styles.slider}`}>
        <Slider {...settings} ref={sliderRef}>
          {items.map((item, index) => {
            return <Card key={index} itemData={item} />;
          })}
        </Slider>
      </div>
    </div>
  );
};

export default CustomSlider;
