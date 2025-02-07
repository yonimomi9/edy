import React, { useEffect, useState } from "react";
import styles from "./PreviewMovie.module.css";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PreviewMovie = ({ movies }) => {
  const [previewMovie, setPreviewMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (movies && movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setPreviewMovie(movies[randomIndex]); // Pick a random movie
      console.log("Randomly selected preview movie:", movies[randomIndex]);
    }
  }, [movies]);

  const handlePlayMovie = () => {
    if (previewMovie && previewMovie.id) {
      console.log(`Navigating to play movie with ID: ${previewMovie.id}`);
      navigate(`/video-player?id=${previewMovie.id}`);
    }
  };

  const handleMovieInfo = () => {
    if (previewMovie && previewMovie.id) {
      console.log(`Navigating to movie info with ID: ${previewMovie.id}`);
      navigate(`/movie-info?id=${previewMovie.id}`);
    }
  };

  if (!previewMovie) {
    console.log("No preview movie selected.");
    return null; // Render nothing if no preview movie is selected
  }

  console.log("Preview Movie File Path:", previewMovie.filePath);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewOverlay}></div>
      {previewMovie.filePath ? (
        <video
          className={styles.previewVideo}
          src={previewMovie.filePath}
          autoPlay
          loop
          muted
          onError={() => console.error("Failed to load preview video:", previewMovie.filePath)}
        />
      ) : (
        <div className={styles.noPreview}>
          <h2>No Preview Available</h2>
        </div>
      )}
      <div className={styles.previewContent}>
        <h1 className={styles.previewTitle}>{previewMovie.title}</h1>
        <div className={styles.buttonsContainer}>
          <button
            className={`${styles.previewButton} ${styles.play}`}
            onClick={handlePlayMovie}
          >
            <FaPlay style={{ marginRight: "5px" }} /> Play Movie
          </button>
          <button
            className={`${styles.previewButton} ${styles.info}`}
            onClick={handleMovieInfo}
          >
            <FaInfoCircle style={{ marginRight: "5px" }} /> Movie Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewMovie;
