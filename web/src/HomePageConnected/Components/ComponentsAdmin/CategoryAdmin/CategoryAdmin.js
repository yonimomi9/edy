import React, { useState } from "react";
import styles from "./CategoryAdmin.module.css";
import Arrow from "../../Arrow/Arrow";
import MovieThumbnailAdmin from "../MovieThumbnailAdmin/MovieThumbnailAdmin";

const CategoryAdmin = ({ title, movies = [] }) => {
  const [startIndex, setStartIndex] = useState(0); // Track the start index for visible movies
  const maxVisibleMovies = 5;

  console.log("CategoryAdmin Title:", title);
  console.log("CategoryAdmin Movies:", movies);

  if (!movies || movies.length === 0) {
    console.warn(`No movies found for category "${title}".`);
  }

  const handleNext = () => {
    if (startIndex + maxVisibleMovies < movies.length) {
      setStartIndex(startIndex + 1); // Move to the right
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1); // Move to the left
    }
  };

  // Determine if arrows should be shown
  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + maxVisibleMovies < movies.length;

  return (
    <div className={styles["category-container"]}>
      <h2 className={styles["category-title"]}>{title}</h2>
      {(!movies || movies.length === 0) && (
        <p className={styles["no-movies-message"]}>
          No movies available in this category.
        </p>
      )}
      {movies && movies.length > 0 && (
        <div className={styles["movie-thumbnails-container"]}>
          {movies.length > maxVisibleMovies && showLeftArrow && (
            <Arrow direction="left" onClick={handlePrev} />
          )}
          <div className={styles["movie-thumbnails"]}>
            {movies.map((movie, index) => (
              <MovieThumbnailAdmin
                key={movie.id}
                id={movie.id}
                title={movie.title}
                thumbnailUrl={movie.thumbnailUrl}
                style={{
                  display:
                    movies.length > maxVisibleMovies &&
                    (index < startIndex || index >= startIndex + maxVisibleMovies)
                      ? "none"
                      : "block",
                }}
              />
            ))}
          </div>
          {movies.length > maxVisibleMovies && showRightArrow && (
            <Arrow direction="right" onClick={handleNext} />
          )}
        </div>
      )}
    </div>
  );  
};

export default CategoryAdmin;
