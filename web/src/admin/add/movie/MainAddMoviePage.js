import React, { useState } from "react";
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import MovieName from "./MovieName";
import ConfirmButton from "../../ConfirmButton/ConfirmButton";
import ChooseCategories from "./ChooseCategories";
import UploadMovie from "./UploadMovie";
import styles from "./MainAddMoviePage.module.css";

function MainAddMoviePage() {
  const [movieName, setMovieName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleConfirm = async () => {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG] [${timestamp}] Preparing to upload movie...`);
    console.log(`[DEBUG] [${timestamp}] Movie Name:`, movieName);
    console.log(`[DEBUG] [${timestamp}] Selected Categories:`, selectedCategories);
    console.log(`[DEBUG] [${timestamp}] Selected File:`, selectedFile);
    console.log(`[DEBUG] [${timestamp}] Selected Thumbnail:`, selectedThumbnail);
  
    if (!movieName || selectedCategories.length === 0 || !selectedFile || !selectedThumbnail) {
      alert("Please fill all fields and attach both files.");
      console.log(`[DEBUG] [${timestamp}] Response sent to client: Missing required fields alert.`);
      return;
    }
  
    const formData = new FormData();
    formData.append("name", movieName);
    formData.append("categories", JSON.stringify(selectedCategories));
    formData.append("file", selectedFile);
    formData.append("thumbnail", selectedThumbnail);
  
    try {
      setIsLoading(true);
  
      const response = await fetch("http://localhost:3000/api/movies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      // Introduce a delay to ensure server processing completes
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
  
      const serverResponseTime = new Date().toISOString();
      console.log(`[DEBUG] [${serverResponseTime}] Raw response from server:`, response);
  
      if (!response.ok) {
        const errorText = await response.text(); // Log raw error message
        console.error(`[ERROR] [${serverResponseTime}] Server responded with status: ${response.status}`);
        console.log(`[DEBUG] [${serverResponseTime}] Error response text: ${errorText}`);
        alert(`Server Error: ${response.statusText}`);
        return;
      }
  
      const responseData = await response.json();
      console.log(`[DEBUG] [${serverResponseTime}] Parsed response data:`, responseData);
  
      if (responseData.message === "Movie created successfully!") {
        alert("Movie added successfully!");
        console.log(`[DEBUG] [${serverResponseTime}] Response sent to client: Success alert for movie creation.`);
        setSuccessMessage("Movie uploaded successfully.");
        setMovieName("");
        setSelectedCategories([]);
        setSelectedFile(null);
        setSelectedThumbnail(null);
      } else {
        console.error(`[ERROR] [${serverResponseTime}] Unexpected server response format:`, responseData);
        alert("Unexpected server response.");
      }
    } catch (error) {
      const errorTimestamp = new Date().toISOString();
      console.error(`[ERROR] [${errorTimestamp}] Network or Unexpected Error:`, error);
      alert("An unexpected network error occurred. The movie might have been added, check the home page and try again if the movie hasn't been added.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <div className={`card p-4 ${styles.contentContainer}`}>
          <MovieName value={movieName} onChange={setMovieName} />
          <ChooseCategories onChange={setSelectedCategories} />
          <UploadMovie onFileChange={setSelectedFile} onThumbnailChange={setSelectedThumbnail} />
          <ConfirmButton onClick={handleConfirm} />
          {isLoading && <p>Uploading... Please wait.</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default MainAddMoviePage;
