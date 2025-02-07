import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminNavbar.module.css';
import Logo from '../../app/Logo/Logo';

function AdminNavbar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbar}`}>
      <div className="container">
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Logo />
        </div>

        {/* Admin Panel */}
        <Link
          to="/main-page-admin"
          className={`navbar-brand ${styles.navLink} ${styles.noArrow}`}
        >
          Admin Panel
        </Link>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse`} id="navbarNav">
          <ul className={`navbar-nav ${styles.navbarLinks}`}>
            <li className={styles.menuContainer}>
              <button
                className={styles.navLink}
                onClick={() => toggleMenu('add')}
              >
                Add ▼
              </button>
              <div
                className={`${styles.menu} ${
                  openMenu === 'add' ? styles.menuVisible : ''
                }`}
              >
                <Link className={styles.menuItem} to="/main-add-category">
                  Category
                </Link>
                <Link className={styles.menuItem} to="/main-add-movie">
                  Movie
                </Link>
              </div>
            </li>

            <li className={styles.menuContainer}>
              <button
                className={styles.navLink}
                onClick={() => toggleMenu('edit')}
              >
                Edit ▼
              </button>
              <div
                className={`${styles.menu} ${
                  openMenu === 'edit' ? styles.menuVisible : ''
                }`}
              >
                <Link className={styles.menuItem} to="/main-edit-category">
                  Category
                </Link>
                <Link className={styles.menuItem} to="/main-edit-movie">
                  Movie
                </Link>
              </div>
            </li>

            <li className={styles.menuContainer}>
              <button
                className={styles.navLink}
                onClick={() => toggleMenu('remove')}
              >
                Delete ▼
              </button>
              <div
                className={`${styles.menu} ${
                  openMenu === 'remove' ? styles.menuVisible : ''
                }`}
              >
                <Link className={styles.menuItem} to="/main-remove-category">
                  Category
                </Link>
                <Link className={styles.menuItem} to="/main-remove-movie">
                  Movie
                </Link>
              </div>
            </li>
          </ul>

          {/* Home Button */}
          <div className={styles.homeButtonContainer}>
            <Link
              to="/home-admin"
              className={`btn btn-outline-light ${styles.homeButton}`}
            >
              <i className="bi bi-house"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
