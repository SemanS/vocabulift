import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./TranslateWord.module.less";

const { Text, Link } = Typography;

interface TranslateWordProps {
  word: string;
  translation: string;
  onClick: (word: string) => void;
}

const TranslateWord: React.FC<TranslateWordProps> = ({
  word,
  translation,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip
      showArrow={false}
      overlayInnerStyle={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "10px",
      }}
      getPopupContainer={(trigger) => {
        return trigger;
      }}
      title={translation}
    >
      <Text
        className={classNames(
          isHovered ? styles.bubbleHovered : "",
          styles.textbox
        )}
        onClick={() => onClick(word)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {word + " "}
      </Text>
    </Tooltip>
  );
};

export default TranslateWord;
