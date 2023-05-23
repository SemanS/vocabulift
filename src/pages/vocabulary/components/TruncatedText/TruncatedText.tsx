import { Tooltip } from "antd";
import React from "react";
import styles from "./TruncatedText.module.less";

type TruncatedTextProps = {
  text: string;
  maxTextLength: number;
};

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxTextLength,
}) => {
  if (text.length > maxTextLength) {
    const truncatedText = `${text.slice(0, maxTextLength - 1)}...`;

    return (
      <Tooltip
        title={text}
        overlayInnerStyle={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "10px",
          fontSize: "16px",
        }}
      >
        <span className={styles.truncate}>
          <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
            {truncatedText.split(" ").map((word, index) => (
              <span key={index}>
                {word}
                &nbsp;
              </span>
            ))}
          </div>
        </span>
      </Tooltip>
    );
  } else {
    return <span className={styles.truncate}>{text}</span>;
  }
};

export default TruncatedText;
