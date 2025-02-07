import React from 'react';
import styles from './ConfirmButton.module.css';

function ConfirmButton({ onClick, disabled }) {
  return (
    <button
      className={styles.confirmButton}
      onClick={onClick}
      disabled={disabled}
    >
      Confirm
    </button>
  );
}

export default ConfirmButton;
