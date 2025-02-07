import React, { useState } from "react";
import styles from "./RecommendedMovies.module.css";
import Arrow from "../../Arrow/Arrow";
import MovieThumbnail from "../MovieThumbnail/MovieThumbnail";

const RecommendedMovies = ({ title = "Recommended Movies", movies = [] }) => {
  const [startIndex, setStartIndex] = useState(0); // Start index for visible movies
  const maxVisibleMovies = 5; // Display up to 5 movies at a time

  const handleNext = () => {
    if (startIndex + maxVisibleMovies < movies.length) {
      setStartIndex(startIndex + 1); // Move one movie to the right
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1); // Move one movie to the left
    }
  };

  // Determine if arrows should be shown
  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + maxVisibleMovies < movies.length;

  if (!movies.length) {
    return (
      <div className={styles["recommended-container"]}>
        <h2>{title}</h2>
        <p>No recommended movies available.</p>
      </div>
    );
  }

  return (
    <div className={styles["recommended-container"]}>
      <h2>{title}</h2>
      <div className={styles["movie-thumbnails-container"]}>
        {showLeftArrow && <Arrow direction="left" onClick={handlePrev} />}
        <div className={styles["movie-thumbnails"]}>
        {movies.map((movie, index) => (
          <MovieThumbnail
            key={`movie-${movie.id}-${index}`}
            id={movie.id}
            title={movie.title}
            thumbnailUrl={movie.thumbnailUrl || "http://localhost:8000/default_thumbnail.png"} // Default fallback
            style={{
              display:
                index >= startIndex && index < startIndex + maxVisibleMovies
                  ? "block"
                  : "none",
            }}
          />
        ))}
        </div>
        {showRightArrow && <Arrow direction="right" onClick={handleNext} />}
      </div>
    </div>
  );
};

export default RecommendedMovies;
