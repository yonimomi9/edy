import React from "react";
import styles from "./Navbar.module.css";
import Logo from "../../../../app/Logo/Logo";
import UserIcon from "../../UserIcon/UserIcon";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ isDarkMode, toggleTheme, userName, profilePicture }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Logo />
        <div className={styles.navbarLinks}>
          <a href="/home_logged">Home</a>
          <a href="/movies">Movies</a>
        </div>
      </div>
      <SearchBar
        onSearch={(query) => {
          if (query.trim()) {
            window.location.href = `/search=${query}`;
          }
        }}
      />
      <div className={styles.navbarRight}>
        <UserIcon
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          userName={userName}
          profilePicture={profilePicture}
        />
      </div>
    </nav>
  );
};

export default Navbar;
