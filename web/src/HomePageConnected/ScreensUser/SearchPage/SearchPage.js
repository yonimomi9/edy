import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/ComponentsUser/Navbar/Navbar";
import styles from "./SearchPage.module.css";
import { FaInfoCircle } from "react-icons/fa";
import thumbnailStyles from "../../Components/ComponentsUser/MovieThumbnail/MovieThumbnail.module.css";

const SearchPage = ({
  isDarkMode,
  toggleTheme,
  loggedUser,
  allMovies = [],
  categories = [],
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query")?.toLowerCase() || "";

  const navigate = useNavigate();

  const handleMovieInfo = (movieId) => {
    navigate(`/movie-info?id=${movieId}`);
  };

  // Movies matching the search query
  const matchingMoviesByTitle = allMovies.filter(
    (movie) =>
      typeof movie.title === "string" &&
      movie.title.toLowerCase().includes(searchQuery)
  );

  // Categories matching the search query
  const matchingCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery)
  );

  // Collect movies related to the matching categories
  const matchingMoviesByCategory = matchingCategories.flatMap((category) =>
    allMovies.filter((movie) => movie.categories.includes(category.name))
  );

  // Combine all matching movies and remove duplicates
  const filteredMovies = Array.from(
    new Map(
      [...matchingMoviesByTitle, ...matchingMoviesByCategory].map((movie) => [
        movie.id,
        movie,
      ])
    ).values()
  );

  return (
    <div className={styles.searchPage}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        userName={loggedUser?.nameForDisplay || "Guest"}
        profilePicture={loggedUser?.profilePicture || "/default_profile_pic.png"}
      />
      <div className={styles.resultsHeader}>
        <h1 className={styles.title}>
          Search results for: "{searchQuery || "No Query"}"
        </h1>
      </div>
      <div className={styles.moviesContainer}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className={`${thumbnailStyles["movie-thumbnail"]}`}
            >
              <img
                src={
                  movie.thumbnailPath.startsWith("http")
                    ? movie.thumbnailPath
                    : `http://localhost:8000${movie.thumbnailPath}`
                }
                alt={movie.title}
                className={thumbnailStyles["thumbnail-image"]}
              />
              <div className={thumbnailStyles["movie-info-bar"]}>
                <p className={thumbnailStyles["movie-title"]}>{movie.title}</p>
                <button
                  className={thumbnailStyles["movie-info-button"]}
                  onClick={() => handleMovieInfo(movie.id)}
                >
                  <FaInfoCircle className={styles["info-icon"]} /> Movie Info
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

