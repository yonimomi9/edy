import React, { useState, useMemo } from "react";
import styles from "./HomeAfterLog.module.css";
import Navbar from "../../Components/ComponentsUser/Navbar/Navbar";
import Category from "../../Components/ComponentsUser/Category/Category";
import PreviewMovie from "../../Components/ComponentsUser/PreviewMovie/PreviewMovie";

const HomeAfterLog = ({ isDarkMode, toggleTheme, loggedUser, allMovies = [], categories = [] }) => {
  const [previewMovieIndex, setPreviewMovieIndex] = useState(() =>
    allMovies.length > 0 ? Math.floor(Math.random() * allMovies.length) : 0
  );

  console.log("All Movies in HomeAfterLog:", allMovies);
  console.log("Categories in HomeAfterLog (raw):", categories);

  // Sort categories by promoted status before processing
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => b.promoted - a.promoted);
  }, [categories]);

  const categorizedMovies = useMemo(() => {
    return sortedCategories.map((category) => {
      const movies = (category.movies || [])
        .map((movieId) => {
          const movie = allMovies.find(
            (m) => m.id.toString() === movieId.toString()
          ); // Compare as strings for consistency
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

  const selectedPreviewMovie =
    allMovies.length > 0
      ? {
          ...allMovies[previewMovieIndex],
          filePath: allMovies[previewMovieIndex]?.filePath || "",
          thumbnailPath:
            allMovies[previewMovieIndex]?.thumbnailPath ||
            "http://localhost:8000/thumbnails/default_thumbnail.png",
        }
      : null;

  console.log("Selected Preview Movie:", selectedPreviewMovie);

  if (!allMovies.length || !categories.length) {
    console.log("No movies or categories found. Showing loading screen.");
    return <p className={styles.loadingText}>Loading...</p>;
  }  

  return (
    <div className={styles.home}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        userName={loggedUser?.nameForDisplay || "User"}
        profilePicture={
          loggedUser?.profilePicture ||
          "http://localhost:8000/profilePictures/default_profile_pic.png"
        }
      />
      <div className={styles.previewContainer}>
        {selectedPreviewMovie && <PreviewMovie movies={[selectedPreviewMovie]} />}
      </div>
      <div className={styles.content}>
        {categorizedMovies.map((category, index) => (
          <Category key={index} title={category.title} movies={category.movies} />
        ))}
      </div>
    </div>
  );
};

export default HomeAfterLog;
