import React from "react";
import styles from "./Promoted.module.css";

function Promoted({ value = false, onChange }) {
  return (
    <div className={styles.selectorContainer}>
      <label className={styles.label}>Promoted:</label>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name="promoted"
            checked={value === true}
            onChange={() => onChange(true)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="promoted"
            checked={value === false}
            onChange={() => onChange(false)}
          />
          No
        </label>
      </div>
    </div>
  );
}

export default Promoted;
