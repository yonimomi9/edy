import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./MovieThumbnailAdmin.module.css";

const MovieThumbnailAdmin = ({ id, title, thumbnailUrl, style }) => {
  const navigate = useNavigate();

  console.log("Rendering thumbnail for:", { id, title, thumbnailUrl });

  const handleMovieInfoClick = () => {
    if (id !== "unknown-id") {
      console.log(`Navigating to Movie Info: ${id}`);
      navigate(`/movie-info-admin?id=${id}`);
    } else {
      console.error("Invalid movie data. Cannot navigate to movie info.");
    }
  };

  return (
    <div className={styles["movie-thumbnail"]} style={style}>
      <img
        src={thumbnailUrl || "http://localhost:8000/thumbnails/default_thumbnail.png"}
        alt={title || "No Title"}
        className={styles["thumbnail-image"]}
        onError={(e) => {
          console.error("Error loading thumbnail:", thumbnailUrl);
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = "http://localhost:8000/thumbnails/default_thumbnail.png"; // Fallback URL
        }}
      />
      <div className={styles["movie-info-bar"]}>
        <span className={styles["movie-title"]}>{title || "Unknown Title"}</span>
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

export default MovieThumbnailAdmin;
