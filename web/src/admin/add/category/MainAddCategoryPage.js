import React, { useState } from "react";
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import CategoryName from "./CategoryName";
import Promoted from "./Promoted";
import ChooseMovies from "./ChooseMovies"; // Import the new component
import ConfirmButton from "../../ConfirmButton/ConfirmButton";
import styles from "./MainAddCategoryPage.module.css";

function MainAddCategoryPage({ allMovies = [] }) { // Accept allMovies as a prop
  const [categoryName, setCategoryName] = useState(""); // State for category name
  const [selectedMovies, setSelectedMovies] = useState([]); // State for selected movies
  const [isPromoted, setIsPromoted] = useState(false); // State for promoted status

  const handleConfirm = async () => {
    console.log("Token being sent:", sessionStorage.getItem('token'));

    if (!categoryName) {
      alert("Category name is required!");
      return;
    }

    if (!Array.isArray(selectedMovies) || !selectedMovies.every((movie) => movie.id && Number.isInteger(parseInt(movie.id)))) {
      alert("Selected movies must contain valid IDs.");
      return;
    }

    const newCategory = {
      name: categoryName,
      promoted: isPromoted,
      movies: selectedMovies.map((movie) => parseInt(movie.id)), // Convert IDs to integers
    };

    try {
      const response = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        alert("Category added successfully!");
        setCategoryName("");
        setSelectedMovies([]);
        setIsPromoted(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to add category: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("An error occurred while adding the category.");
    }
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <div className={`card p-4 ${styles.contentContainer}`}>
          {/* Pass props to CategoryName */}
          <CategoryName value={categoryName} onChange={setCategoryName} />

          {/* Pass props to ChooseMovies */}
          <ChooseMovies
            value={selectedMovies} // Pass selectedMovies state
            onChange={setSelectedMovies} // Pass setSelectedMovies updater function
            allMovies={allMovies} // Pass allMovies here
          />

          {/* Pass props to Promoted */}
          <Promoted value={isPromoted} onChange={setIsPromoted} />

          {/* Confirm button to trigger category creation */}
          <ConfirmButton onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

export default MainAddCategoryPage;
