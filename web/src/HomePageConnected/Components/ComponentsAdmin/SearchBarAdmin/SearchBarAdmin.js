import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBarAdmin.module.css";

const SearchBarAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-admin?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search for movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default SearchBarAdmin;
