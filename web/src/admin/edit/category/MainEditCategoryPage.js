import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../AdminNavbar/AdminNavbar";
import styles from "./MainEditCategoryPage.module.css";

function MainEditCategoryPage({ categories, fetchCategories }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories(); // Fetch categories if not already loaded
    }
  }, [categories, fetchCategories]);

  const handleEditCategory = () => {
    if (!selectedCategory) {
      alert("Please select a category to edit.");
      return;
    }
    navigate(`/main-edit-category/${selectedCategory}`);
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className={`d-flex flex-grow-1 justify-content-center align-items-center`}>
        <div className={`card ${styles.contentContainer}`}>
          <h2 className={styles.heading}>Edit Category</h2>
          <label htmlFor="categorySelect" className={styles.label}>
            Select a Category:
          </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`form-select ${styles.selectBox}`}
          >
            <option value="">-- Select a Category --</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleEditCategory}
            className={`btn btn-danger mt-3 ${styles.editButton}`}
          >
            Edit Selected Category
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainEditCategoryPage;
