import React, { useState, useMemo, useEffect } from "react";
import styles from "./MoviesPageAdmin.module.css";
import NavbarAdmin from "../../Components/ComponentsAdmin/NavbarAdmin/NavbarAdmin";
import CategoryAdmin from "../../Components/ComponentsAdmin/CategoryAdmin/CategoryAdmin";
import PreviewMovieAdmin from "../../Components/ComponentsAdmin/PreviewMovieAdmin/PreviewMovieAdmin";

const MoviesPageAdmin = ({ isDarkMode, toggleTheme, loggedUser, allMovies = [], categories = [] }) => {
  const [previewMovieIndex, setPreviewMovieIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Movies");
  const [showCategories, setShowCategories] = useState(false);

  console.log("All Movies in MoviesPageAdmin:", allMovies);
  console.log("Categories in MoviesPageAdmin (raw):", categories);

  // Sort categories by promoted status
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => b.promoted - a.promoted);
  }, [categories]);

  // Categorize movies based on sorted categories
  const categorizedMovies = useMemo(() => {
    return sortedCategories.map((category) => {
      const movies = (category.movies || [])
        .map((movieId) => {
          const movie = allMovies.find((m) => m.id.toString() === movieId.toString());
          if (!movie) {
            console.warn(`Invalid movie object in category: ${category.name}`, movieId);
            return null;
          }
          return {
            id: movie.id,
            title: movie.title,
            thumbnailUrl: movie.thumbnailPath || "http://localhost:8000/thumbnails/default_thumbnail.png",
            filePath: movie.filePath || "",
          };
        })
        .filter(Boolean); // Remove null values
      return { title: category.name, movies };
    });
  }, [sortedCategories, allMovies]);

  console.log("Categorized Movies after processing:", categorizedMovies);

  // Filter movies based on selected category
  const filteredMovies = useMemo(() => {
    if (selectedCategory === "All Movies") {
      return allMovies;
    }
    const category = categorizedMovies.find((cat) => cat.title === selectedCategory);
    return category ? category.movies : [];
  }, [selectedCategory, categorizedMovies, allMovies]);

  useEffect(() => {
    if (filteredMovies.length > 0) {
      setPreviewMovieIndex(Math.floor(Math.random() * filteredMovies.length));
    } else {
      setPreviewMovieIndex(0); // Reset to 0 if no movies are available
    }
  }, [filteredMovies]);

  console.log("Filtered Movies for selected category:", filteredMovies);
  console.log("Preview Movie Index:", previewMovieIndex);

  const selectedPreviewMovie =
    filteredMovies.length > 0
      ? filteredMovies[previewMovieIndex] || filteredMovies[0]
      : null;

  console.log("Selected Preview Movie Details:", selectedPreviewMovie);

  const toggleCategories = () => {
    setShowCategories((prev) => !prev);
  };

  if (!allMovies.length || !categories.length) {
    console.log("No movies or categories found. Showing loading screen.");
    return <p className={styles.loadingMessage}>Loading...</p>;
  }

  return (
    <div className={styles.moviesPage}>
      <NavbarAdmin
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        userName={loggedUser?.nameForDisplay || "Guest"}
        profilePicture={
          loggedUser?.profilePicture ||
          "http://localhost:8000/profilePictures/default_profile_pic.png"
        }
      />

      <div className={styles.previewContainer}>
        <button onClick={toggleCategories} className={styles.categoriesButton}>
          Categories
        </button>

        {showCategories && (
          <div className={`${styles.categoriesMenu} ${styles.categoriesMenuVisible}`}>
            <div
              className={styles.categoryItem}
              onClick={() => {
                setSelectedCategory("All Movies");
                setShowCategories(false);
              }}
            >
              All Movies
            </div>
            {sortedCategories.map((category, index) => (
              <div
                key={index}
                className={styles.categoryItem}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setShowCategories(false);
                }}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.previewMovie}>
        <h2 className={styles.selectedCategoryTitle}>{selectedCategory}</h2>
        {selectedPreviewMovie && selectedPreviewMovie.filePath ? (
          <PreviewMovieAdmin movies={[selectedPreviewMovie]} />
        ) : (
          <p className={styles.noMoviesMessage}>No preview available for this category.</p>
        )}
      </div>

      <div className={styles.content}>
        {selectedCategory === "All Movies"
          ? categorizedMovies.map((category, index) => (
              <CategoryAdmin key={index} title={category.title} movies={category.movies} />
            ))
          : categorizedMovies
              .filter((category) => category.title === selectedCategory)
              .map((filteredCategory, index) => (
                <CategoryAdmin
                  key={index}
                  title={filteredCategory.title}
                  movies={filteredCategory.movies}
                />
              ))}
      </div>
    </div>
  );
};

export default MoviesPageAdmin;
