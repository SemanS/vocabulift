import React from "react";
import styles from "./index.module.less";

function MagnifyingGlass({ style, words, sentence }) {
  if (sentence === "" && (!words || words.length === 0)) {
    return null;
  }
  return (
    <div style={{ ...style }} className={styles.magnifyingGlass}>
      <span className={styles.sentenceBox}>{sentence} </span>
      <div className={styles.words}>
        {words.map((word, index) => (
          <span key={index} className={styles.wordBox}>
            {word.word}{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MagnifyingGlass;
