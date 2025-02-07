import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/ComponentsUser/Navbar/Navbar";
import PreviewMovieInfo from "../../Components/PreviewMovieInfo/PreviewMovieInfo";
import RecommendedMovies from "../../Components/ComponentsUser/RecommendedMovies/RecommendedMovies";
import Description from "../../Components/Description/Description"; // Import the Description component
import styles from "./MovieInfo.module.css";

const MovieInfo = ({ isDarkMode, toggleTheme, movies, categories, loggedUser }) => {
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const movieId = searchParams.get("id");

    if (!movies || movies.length === 0 || !categories || categories.length === 0) {
      console.warn("No movies or categories available.");
      setIsLoading(false);
      return;
    }

    // Enrich movie data with category names
    const enrichedMovies = movies.map((movie) => {
      const associatedCategories = categories
        .filter((category) => category.movies.includes(movie.id.toString()))
        .map((cat) => cat.name);

      return {
        ...movie,
        categories: associatedCategories,
        thumbnailUrl: movie.thumbnailPath || "http://localhost:8000/default_thumbnail.png",
      };
    });

    const foundMovie = enrichedMovies.find(
      (movie) => movie.id === parseInt(movieId, 10)
    );

    if (foundMovie) {
      setMovie(foundMovie);

      // Set recommended movies (excluding the current movie)
      const relatedMovies = enrichedMovies.filter((m) => m.id !== foundMovie.id).slice(0, 10);
      setRecommendedMovies(relatedMovies);
    } else {
      setMovie(null);
      setRecommendedMovies([]);
    }

    setIsLoading(false);
  }, [location, movies, categories]);

  if (isLoading) {
    return (
      <div className={styles.movieInfoContainer}>
        <p>Loading movie information...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.movieInfoContainer}>
        <Navbar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          userName={loggedUser?.nameForDisplay || "User"}
          profilePicture={loggedUser?.profilePicture || "/default_profile_pic.png"}
        />
        <h1 className={styles.notFound}>Movie not found.</h1>
      </div>
    );
  }

  return (
    <div className={styles.movieInfoContainer}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        userName={loggedUser?.nameForDisplay || "User"}
        profilePicture={loggedUser?.profilePicture || "/default_profile_pic.png"}
      />

      <div className={styles.topSection}>
        <div className={styles.previewSection}>
          <PreviewMovieInfo movie={movie} />
        </div>

        <div className={styles.detailsSection}>
          <h1>{movie.title}</h1>
          <h2>Categories:</h2>
          <ul>
            {movie.categories.length > 0 ? (
              movie.categories.map((category, index) => <li key={index}>{category}</li>)
            ) : (
              <li>No categories available</li>
            )}
          </ul>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <RecommendedMovies movies={recommendedMovies || []} />
      </div>
    </div>
  );
};

export default MovieInfo;
