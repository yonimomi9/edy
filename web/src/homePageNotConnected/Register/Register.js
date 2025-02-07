import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        displayName: '',
        username: '',
        password: '',
        confirmPassword: '',
        profilePicture: null,
    });
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (
            !formData.displayName.trim() ||
            !formData.username.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim() ||
            !formData.profilePicture
        ) {
            setError('All fields must be filled, and a profile picture must be uploaded.');
            return;
        }

        // Validate password length
        if (formData.password.length < 8) {
            setError('Your password must contain at least 8 characters.');
            return;
        }

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Clear any existing errors
        setError('');

        const data = new FormData();
        data.append('nameForDisplay', formData.displayName);
        data.append('username', formData.username);
        data.append('password', formData.password);
        data.append('profilePicture', formData.profilePicture);

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                body: data,
            });
            if (response.ok) {
                alert('User registered successfully!\n Log in to continue.');
                navigate('/login'); // Redirect to login after successful registration
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user');
        }
    };

    return (
        <div className={styles.registerPage}>
            <div className={styles.registerContainer}>
                <h2 className={styles.registerTitle}>Create your EDY user</h2>
                <h2 className={styles.registerTitle}>to start your membership.</h2>
                <form className={styles.registerForm} onSubmit={handleSubmit}>
                    <label htmlFor="displayName">Display Name</label>
                    <input
                        type="text"
                        name="displayName"
                        placeholder="Enter your display name"
                        className={styles.inputField}
                        required
                        onChange={handleChange}
                    />
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        className={styles.inputField}
                        required
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className={styles.inputField}
                        required
                        onChange={handleChange}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className={styles.inputField}
                        required
                        onChange={handleChange}
                    />
                    {error && <p className={styles.errorText}>{error}</p>}
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        className={styles.inputField}
                        onChange={handleChange}
                    />
                    <button type="submit" className={styles.registerButton}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
