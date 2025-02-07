import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa"; // Import the play icon
import styles from "./PreviewMovieInfo.module.css";

const PreviewMovieInfo = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) {
    console.warn("PreviewMovieInfo component received no movie data.");
    return (
      <div className={styles.noPreview}>
        <h2>No Preview Available</h2>
      </div>
    );
  }

  const handlePlayMovie = () => {
    if (movie.id) {
      navigate(`/video-player?id=${movie.id}`);
    } else {
      console.error("Invalid movie ID. Cannot navigate to video player.");
    }
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewOverlay}></div>
      {movie.filePath ? (
        <video
          className={styles.previewVideo}
          src={movie.filePath}
          poster={movie.thumbnailPath || "default_thumbnail.png"}
          autoPlay
          loop
          muted
        />
      ) : (
        <div className={styles.noPreview}>
          <h2>No Preview Available</h2>
        </div>
      )}
      <div className={styles.previewContent}>
        <h1 className={styles.previewTitle}>{movie.title || "Untitled Movie"}</h1>
        <div className={styles.buttonsContainer}>
          <button
            className={`${styles.previewButton} ${styles.play}`}
            onClick={handlePlayMovie}
          >
            <FaPlay style={{ marginRight: "5px" }} /> Play Movie
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewMovieInfo;
