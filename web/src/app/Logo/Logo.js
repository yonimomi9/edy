import React from 'react';
import styles from './Logo.module.css';
import logoImage from '../../assets/edy_logo.png';

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <img src={logoImage} alt="App Logo" className={styles.logo} />
    </div>
  );
};

export default Logo;
