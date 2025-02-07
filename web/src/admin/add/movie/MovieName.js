import React from "react";
import styles from "./MovieName.module.css";

function MovieName({ value, onChange }) {
  return (
    <div className={styles.movieInputContainer}>
      <label htmlFor="movieName" className={styles.label}>
        Movie Name:
      </label>
      <input
        type="text"
        id="movieName"
        placeholder="Enter movie name"
        className={styles.inputField}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default MovieName;
