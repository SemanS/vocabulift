import { Tooltip, Typography } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./TranslateWord.module.less";

const { Text, Link } = Typography;

interface TranslateWordProps {
  word: string;
  translation: string;
  onClick: (word: string) => void;
  mode: string;
}

const TranslateWord: React.FC<TranslateWordProps> = ({
  word,
  translation,
  onClick,
  mode,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip
      arrow={false}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      overlayInnerStyle={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "10px",
        fontSize: "14px",
      }}
      getPopupContainer={(trigger) => {
        return trigger;
      }}
      title={translation}
    >
      <Text
        style={{
          cursor: mode == "word" ? "pointer" : "default",
        }}
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
