import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./MovieThumbnail.module.css";

const MovieThumbnail = ({ id, title, thumbnailUrl, style }) => {
  const navigate = useNavigate();

  // Handles the navigation to the movie info page
  const handleMovieInfoClick = () => {
    console.log(`Navigating to Movie Info: ${id}`);
    navigate(`/movie-info?id=${id}`);
  };
  

  return (
    <div className={styles["movie-thumbnail"]} style={style}>
      {/* Movie Thumbnail Image */}
      <img
        src={thumbnailUrl}
        alt={title}
        className={styles["thumbnail-image"]}
      />
      <div className={styles["movie-info-bar"]}>
        {/* Movie Title */}
        <span className={styles["movie-title"]}>{title}</span>
        {/* Movie Info Button */}
        <button
          className={styles["movie-info-button"]}
          onClick={handleMovieInfoClick}
        >
          <FaInfoCircle className={styles["info-icon"]} /> Movie Info
        </button>
      </div>
    </div>
  );
};

export default MovieThumbnail;
