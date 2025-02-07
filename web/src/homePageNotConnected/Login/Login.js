import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = ({ setLoggedUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setError("");

    try {
      // Send login request to the backend
      const response = await fetch("http://localhost:3000/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Login Response:", responseData);

        const { accessToken, user } = responseData;

        if (!accessToken || !user) {
          throw new Error("Invalid response from server.");
        }

        // Save accessToken and username in sessionStorage
        sessionStorage.setItem("token", accessToken);

        console.log("Token and Username stored:", accessToken, user.username);

        // Redirect based on user role
        if (user.roles && user.roles.admin) {
          navigate("/home-admin");
        } else {
          navigate("/home_logged");
        }
        // Set logged user in state
        setLoggedUser(user);
        sessionStorage.setItem("username", user.username); // Store username for persistence

        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err.message);
      setError("An error occurred while logging in.");
    }
  };

  // Redirect to the register page
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Log in to your</h2>
        <h2 className={styles.loginTitle}>EDY user.</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
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
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <div className={styles.registerPromptContainer}>
          <span className={styles.registerPrompt}>
            Not registered yet to EDY? Register now!
          </span>
          <button className={styles.registerButton} onClick={handleRegisterClick}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
