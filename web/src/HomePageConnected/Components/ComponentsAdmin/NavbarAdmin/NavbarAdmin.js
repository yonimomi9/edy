import React from "react";
import styles from "./NavbarAdmin.module.css";
import Logo from "../../../../app/Logo/Logo";
import UserIcon from "../../UserIcon/UserIcon";
import SearchBar from "../SearchBarAdmin/SearchBarAdmin";

const NavbarAdmin = ({ isDarkMode, toggleTheme, userName, profilePicture }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Logo /> {/* Ensure the Logo is rendered here */}
        <div className={styles.navbarLinks}>
          <a href="/home-admin">Home</a>
          <a href="/movies-admin">Movies</a>
          <a href="/main-page-admin">Admin</a>
        </div>
      </div>
      <SearchBar />
      <div className={styles.navbarRight}>
        <UserIcon
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          userName={userName}
          profilePicture={profilePicture} // Pass profile picture
        />
      </div>
    </nav>
  );
};

export default NavbarAdmin;

