import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VideoPlayer.css";
import { FaArrowLeft } from "react-icons/fa";

const VideoPlayer = ({ allMovies, loggedUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoSrc, setVideoSrc] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const [error, setError] = useState(null);

  // Check if the loggedUser prop is passed correctly
  useEffect(() => {
    console.log("Logged User in VideoPlayer:", loggedUser);
    if (!loggedUser || !loggedUser.id) {
      console.error("Error: User not logged in or loggedUser prop is invalid.");
      setError("User not logged in.");
    } else {
      console.log("Logged User ID:", loggedUser.id);
    }
  }, [loggedUser]);

  // Parse movie ID from URL and find movie details
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const movieIdParam = parseInt(params.get("id"), 10);
    setMovieId(movieIdParam);

    const selectedMovie = allMovies.find((movie) => movie.id === movieIdParam);

    if (selectedMovie) {
      setVideoSrc(selectedMovie.filePath || selectedMovie.movieClip);
    } else {
      console.warn("No matching movie found for the given ID.");
    }
  }, [location.search, allMovies]);

  // Handle playing the movie
  const handleMoviePlay = async () => {
    if (!loggedUser || !loggedUser.id) {
      setError("User not logged in.");
      return;
    }

    try {
      // API call to update watched movies
      const watchedResponse = await fetch(
        `http://localhost:3000/api/users/${loggedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newMovies: [movieId] }),
        }
      );

      if (watchedResponse.ok) {
        console.log("Movie ID added to watchedMovies successfully.");
        setError(null); // Clear any errors
      } else {
        const errorData = await watchedResponse.json();
        console.error("Failed to update watchedMovies:", errorData);
        setError(errorData.message || "Failed to update watchedMovies.");
        return; // Exit if the first API call fails
      }
      console.log("🛠️ [DEBUG] Sending request with userId:", loggedUser.id);
      // Additional API call to recommend the movie
      const recommendResponse = await fetch(
        `http://localhost:3000/api/movies/${movieId}/recommend/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: loggedUser.id, // Include user ID in the body
          }),
        }
      );

      if (recommendResponse.ok) {
        console.log("Movie recommendation successfully recorded.");
      } else {
        const errorData = await recommendResponse.json();
        console.error("Failed to recommend movie:", errorData);
        setError(errorData.message || "Failed to recommend movie.");
      }
    } catch (err) {
      console.error("Error during API calls:", err);
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <div className="video-player-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      {videoSrc ? (
        <div className="video-section">
          <video className="video" controls autoPlay onPlay={handleMoviePlay}>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="error-message">
          <h2>Video not found or invalid ID in URL.</h2>
        </div>
      )}
      {error && <div className="error-alert">{error}</div>}
    </div>
  );
};

export default VideoPlayer;
