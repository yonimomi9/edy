import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import ConfirmButton from "../../ConfirmButton/ConfirmButton";
import ChooseCategories from "../../add/movie/ChooseCategories";
import UploadMovie from "../../add/movie/UploadMovie";
import styles from "./MainEditMoviePageWithId.module.css";

function MainEditMoviePageWithId({ allMovies, fetchMovies, fetchCategories, categories }) {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const [movieName, setMovieName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
  const [currentMovieFile, setCurrentMovieFile] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!movieId || isNaN(Number(movieId))) {
      console.error("Invalid movie ID provided.");
      alert("Invalid movie ID. Redirecting...");
      navigate("/main-page-admin");
      return;
    }

    if (allMovies.length === 0) {
      fetchMovies();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [movieId, allMovies, categories, fetchMovies, fetchCategories, navigate]);

  useEffect(() => {
    if (allMovies.length > 0) {
      const movie = allMovies.find((movie) => String(movie.id) === String(movieId));
      if (!movie) {
        alert("Movie not found.");
        navigate("/main-edit-movie");
        return;
      }
      setMovieName(movie.title || "");
      setSelectedCategories(movie.categories || []);
      setCurrentMovieFile(movie.filePath || "");
      setCurrentThumbnail(movie.thumbnailPath || "");
      setIsLoading(false);
    }
  }, [allMovies, movieId, navigate]);

  const handleConfirm = async () => {
    if (!movieName || selectedCategories.length === 0) {
      alert("Please provide a movie title and select at least one category.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", movieName);
    formData.append("categories", JSON.stringify(selectedCategories));
    if (uploadedFile) formData.append("file", uploadedFile);
    if (uploadedThumbnail) formData.append("thumbnail", uploadedThumbnail);
  
    console.log("FormData payload:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${movieId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Frontend: Movie updated successfully:", responseData);
        alert("Movie updated successfully!");
        navigate('/main-page-admin'); // Redirect to the admin page after update
      } else {
        const errorData = await response.json();
        console.error("Frontend: Error updating movie:", errorData);
        alert(`Failed to update movie: ${errorData.errors?.join(", ") || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Frontend: Error updating movie:", error);
      alert("Unexpected movie update error occured. Check if it has been updated and try again if neccessary.");
    }
  };  

  if (isLoading) {
    return (
      <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
        <AdminNavbar />
        <div className="d-flex flex-grow-1 justify-content-center align-items-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <div className={`card p-4 ${styles.contentContainer}`}>
          <h3 className={styles.header}>Edit Movie</h3>
          <label className={styles.label}>Edit Movie Name:</label>
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className={styles.inputField}
          />
          <ChooseCategories
            value={selectedCategories}
            onChange={setSelectedCategories}
            allCategories={categories}
          />
          <UploadMovie onFileChange={setUploadedFile} onThumbnailChange={setUploadedThumbnail} />
          <ConfirmButton onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

export default MainEditMoviePageWithId;
