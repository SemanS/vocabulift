import React, { useState } from "react";
import { Slider } from "antd";
import styles from "./LevelSlider.module.less";

interface LevelSliderProps {
  handleChange: (value: number | [number, number]) => void;
}

const LevelSlider: React.FC<LevelSliderProps> = ({ handleChange }) => {
  const customRange = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    0,
    customRange.length - 1,
  ]);

  const marks = customRange.reduce((acc, value, index) => {
    acc[index] = value;
    return acc;
  }, {} as { [key: number]: string });

  return (
    <div className={styles.sliderContainer}>
      <Slider
        style={{ width: "100%" }}
        range
        min={0}
        max={customRange.length - 1}
        value={sliderValue}
        onChange={(value) => {
          handleChange(value);
          setSliderValue(value as [number, number]);
        }}
        marks={marks}
        tooltip={{ open: false }}
      />
    </div>
  );
};

export default LevelSlider;
