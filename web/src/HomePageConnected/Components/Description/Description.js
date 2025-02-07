import React from "react";
import styles from "./Description.module.css";

const Description = ({ movie, isDarkMode }) => {
  if (!movie) {
    console.warn("Description component received no movie data.");
    return <p>No movie details available.</p>;
  }

  // Filter out "Uncategorized" if it is automatically added
  const categories = (movie.categories || []).filter((category) => category !== "Uncategorized");
  console.log("Categories in Description:", categories);

  return (
    <div
      className={`${styles.descriptionContainer} ${
        isDarkMode ? "dark-theme" : "light-theme"
      }`}
    >
      <h1>{movie.title || "Untitled Movie"}</h1>
      <div className={styles.divider}></div>
      <h2>Categories</h2>
      {categories.length > 0 ? (
        <ul>
          {categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      ) : (
        <p>No categories available.</p> // Fallback when no valid categories exist
      )}
    </div>
  );
};

export default Description;
