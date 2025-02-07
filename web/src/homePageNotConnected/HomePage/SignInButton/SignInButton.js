import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SignInButton.module.css';

const SignInButton = () => {
    return (
        <Link to="/login" className={styles.button}>
            Sign In
        </Link>
    );
};

export default SignInButton;