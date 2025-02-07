import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import Promoted from "../../add/category/Promoted";
import ChooseMovies from "../../add/category/ChooseMovies";
import ConfirmButton from "../../ConfirmButton/ConfirmButton";
import styles from "./MainEditCategoryPageWithId.module.css";

function MainEditCategoryPageWithId({ categories, fetchCategories, allMovies = [] }) {
  const { id: categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [isPromoted, setIsPromoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories(); // Fetch categories if not already loaded
    }
  }, [categories, fetchCategories]);

  useEffect(() => {
    const fetchCategoryDetails = () => {
      try {
        const category = categories.find((cat) => cat._id === categoryId);
        if (!category) {
          throw new Error("Category not found.");
        }

        setCategoryName(category.name || "");
        setIsPromoted(category.promoted || false);

        // Preselect movies already in the category
        const preselectedMovies = allMovies.filter((movie) =>
          category.movies.some((catMovie) => catMovie.id === movie.id)
        );
        setSelectedMovies(preselectedMovies);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category details:", error);
        alert("Category not found.");
        setIsLoading(false);
      }
    };

    if (categories.length > 0 && allMovies.length > 0) {
      fetchCategoryDetails();
    }
  }, [categories, categoryId, allMovies]);

  const handleConfirm = async () => {
    const updatedCategory = {
      name: categoryName,
      movies: selectedMovies.map((movie) => movie.id), // Use movie IDs
      promoted: isPromoted,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedCategory),
      });

      if (response.ok) {
        alert("Category updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to update category: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
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
          {/* Fixed Category Name */}
          <div>
            <label className={styles.label}>Category Name:</label>
            <p className={styles.categoryName}>{categoryName}</p>
          </div>
          <ChooseMovies
            value={selectedMovies}
            onChange={setSelectedMovies}
            allMovies={allMovies}
          />
          <Promoted value={isPromoted} onChange={setIsPromoted} />
          <ConfirmButton onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

export default MainEditCategoryPageWithId;
