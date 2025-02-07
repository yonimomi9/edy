import React, { useState } from "react";
import styles from "./Category.module.css";
import Arrow from "../../Arrow/Arrow";
import MovieThumbnail from "../MovieThumbnail/MovieThumbnail";

const Category = ({ title, movies = [] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const maxVisibleMovies = 5;

  console.log("Category Title:", title);
  console.log("Movies in Category:", movies);

  const handleNext = () => {
    if (startIndex + maxVisibleMovies < movies.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + maxVisibleMovies < movies.length;

  if (!movies.length) {
    console.log(`No movies found for category: ${title}`);
    return <p>No movies available in this category.</p>;
  }

  return (
    <div className={styles["category-container"]}>
      <h2 className={styles["category-title"]}>{title}</h2>
      <div className={styles["movie-thumbnails-container"]}>
        {movies.length > maxVisibleMovies && showLeftArrow && (
          <Arrow direction="left" onClick={handlePrev} />
        )}
        <div className={styles["movie-thumbnails"]}>
          {movies.map((movie, index) => {
            console.log(`Rendering movie in category "${title}":`, movie);
            return (
              <MovieThumbnail
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
            );
          })}
        </div>
        {movies.length > maxVisibleMovies && showRightArrow && (
          <Arrow direction="right" onClick={handleNext} />
        )}
      </div>
    </div>
  );
};

export default Category;
