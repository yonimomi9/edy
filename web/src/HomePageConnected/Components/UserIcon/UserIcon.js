import React, { useState } from "react";
import styles from "./UserIcon.module.css";
import SwitchButton from "../SwitchButton/SwitchButton";

const UserIcon = ({ isDarkMode, toggleTheme, userName, profilePicture }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const validImageUrl = profilePicture
    ? profilePicture
    : "http://localhost:8000/profilePictures/default_profile_pic.png";


  console.log("Profile Picture URL:", validImageUrl); // Debugging log


  const handleLogout = async () => {
    const token = sessionStorage.getItem("token");
  
    if (!token) {
      window.location.href = "/login"; // Redirect if no token
      return;
    }
  
    try {
      await fetch("http://localhost:3000/api/tokens/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      sessionStorage.removeItem("token"); // Remove token from storage
      window.location.href = "/"; // Redirect to login
    } catch (error) {
      console.error("Error during logout:", error.message);
      window.location.href = "/login";
    }
  };

  
  return (
    <div className={styles.userIconContainer}>
      <div
        className={`${styles.userIcon} ${
          isMenuOpen ? styles.userIconClicked : ""
        }`}
        onClick={toggleMenu}
      >
        <span className={styles.greetingText}>Hello! {userName}</span>
        <img
          src={validImageUrl}
          alt="User Icon"
          className={styles.userAvatar}
          onError={(e) => {
            console.error("Error loading profile picture:", e.target.src);
            e.target.src = "http://localhost:8000/profilePictures/default_profile_pic.png"; // Updated fallback
          }}
        />
      </div>
      <div
        className={`${styles.userMenu} ${
          isMenuOpen ? styles.userMenuVisible : ""
        }`}
      >
        <ul>
          <li className={styles.menuItem} onClick={handleLogout}>
            Logout
          </li>
          <li className={styles.themeToggleRow}>
            <span>Dark Theme:</span>
            <SwitchButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserIcon;
