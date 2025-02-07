import React from 'react';
import styles from './SwitchButton.module.css';

const SwitchButton = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className={styles['switch-container']}>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};

export default SwitchButton;
