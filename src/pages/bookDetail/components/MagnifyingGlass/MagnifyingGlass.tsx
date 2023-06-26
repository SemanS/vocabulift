import React from "react";
import styles from "./index.module.less";

function MagnifyingGlass({ style, words, sentence }) {
  return (
    <div style={{ ...style }} className={styles.magnifyingGlass}>
      <span
        style={{ marginRight: "5px", fontWeight: "bolder" }}
        className={styles.sentenceBox}
      >
        {sentence}{" "}
      </span>
      <div className={styles.words}>
        {words.map((word, index) => (
          <span
            key={index}
            style={{ marginRight: "5px", fontWeight: "bolder" }}
            className={styles.wordBox} // Use the custom CSS class
          >
            {word.word}{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MagnifyingGlass;
