import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import styles from "./MainEditMoviePage.module.css";

function MainEditMoviePage({ allMovies, fetchMovies, fetchCategories, categories }) {
  const [selectedMovie, setSelectedMovie] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (allMovies.length === 0) {
      fetchMovies();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [allMovies, categories, fetchMovies, fetchCategories]);

  const uniqueMovies = Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values());

  const handleEditMovie = () => {
    if (!selectedMovie) {
      alert("Please select a movie to edit.");
      return;
    }
    navigate(`/main-edit-movie/${selectedMovie}`);
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className={`d-flex flex-grow-1 justify-content-center align-items-center`}>
        <div className={`card ${styles.contentContainer}`}>
          <h2 className={styles.heading}>Edit Movie</h2>
          <label htmlFor="movieSelect" className={styles.label}>
            Select a Movie:
          </label>
          <select
            id="movieSelect"
            className={styles.selectBox}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            <option value="">-- Select a Movie --</option>
            {uniqueMovies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleEditMovie}
            className={`btn btn-danger mt-3 ${styles.editButton}`}
          >
            Edit Selected Movie
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainEditMoviePage;
