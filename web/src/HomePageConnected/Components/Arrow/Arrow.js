import React from "react";
import styles from "./Arrow.module.css";

const Arrow = ({ direction, onClick }) => {
  const isLeft = direction === "left";
  return (
    <button
      className={`${styles.arrow} ${isLeft ? styles.left : styles.right}`}
      onClick={onClick}
      aria-label={isLeft ? "Previous" : "Next"}
    >
      {isLeft ? "\u276E" : "\u276F"}
    </button>
  );
};

export default Arrow;
