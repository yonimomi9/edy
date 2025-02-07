import React, { useState, useEffect } from "react";
import styles from "./ChooseMovies.module.css";

function ChooseMovies({ value = [], onChange, allMovies = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Memoize uniqueMovies to prevent recalculating it on every render
  const uniqueMovies = React.useMemo(() => {
    return Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values());
  }, [allMovies]);

  // Filter movies whenever the search term changes
  useEffect(() => {
    const filtered = uniqueMovies.filter((movie) => {
      const title = movie?.title || "Untitled Movie"; // Handle undefined titles
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredMovies(filtered);
  }, [searchTerm, uniqueMovies]);

  // Toggle movie selection
  const toggleMovieSelection = (movie) => {
    const isSelected = value.some((m) => m.id === movie.id);
    const updatedSelection = isSelected
      ? value.filter((m) => m.id !== movie.id) // Remove if already selected
      : [...value, movie]; // Add to selection if not already selected

    onChange(updatedSelection); // Update parent state
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Search and Choose Movies:</label>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.movieList}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id} // Unique key
              className={`${styles.movieItem} ${
                value.some((m) => m.id === movie.id) ? styles.selected : ""
              }`}
              onClick={() => toggleMovieSelection(movie)}
            >
              {movie.title || "Untitled Movie"} {/* Fallback for undefined titles */}
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No movies found</p>
        )}
      </div>
      <div className={styles.selectedMovies}>
        {value.length > 0 ? (
          <p>
            Selected Movies: {value.map((movie) => movie?.title || "Untitled Movie").join(", ")}
          </p>
        ) : (
          <p>No movies selected</p>
        )}
      </div>
    </div>
  );
}

export default ChooseMovies;
