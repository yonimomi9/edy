import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SignUpButton.module.css';

const SignUpButton = () => {
    return (
        <Link to="/register" className={styles.button}>
            Sign Up
        </Link>
    );
};

export default SignUpButton;