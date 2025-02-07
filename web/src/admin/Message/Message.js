import React from 'react';
import styles from './Message.module.css';

function Message() {
  return (
    <div className={styles.messageContainer}>
      <p className={styles.messageAttention}>Pay attention!</p>
      <p className={styles.messageDetail}>You are on admin editing mode</p>
    </div>
  );
}

export default Message;
