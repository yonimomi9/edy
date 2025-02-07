import React, { useState, useEffect } from "react";
import styles from "./ChooseCategories.module.css";

function ChooseCategories({ value = [], onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Assuming authentication
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          setFilteredCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories]);

  const toggleCategorySelection = (category) => {
    const isSelected = value.includes(category._id); // Check if the ID exists in the selected value
    const updatedSelection = isSelected
      ? value.filter((id) => id !== category._id) // Remove the category ID
      : [...value, category._id]; // Add the category ID

    if (onChange) {
      onChange(updatedSelection); // Call the parent's onChange handler with updated IDs
    } else {
      console.error("onChange function is not provided");
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Search and Choose Categories:</label>
      <input
        type="text"
        placeholder="Search for a category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.categoryList}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category._id}
              className={`${styles.categoryItem} ${
                value.includes(category._id) ? styles.selected : ""
              }`}
              onClick={() => toggleCategorySelection(category)}
            >
              {category.name}
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No categories found</p>
        )}
      </div>
      <div className={styles.selectedCategories}>
        {value.length > 0 ? (
          <p>
            Selected Categories:{" "}
            {value
              .map((id) => categories.find((cat) => cat._id === id)?.name) // Find category names
              .filter(Boolean) // Remove any `undefined` values
              .join(", ")}
          </p>
        ) : (
          <p>No categories selected</p>
        )}
      </div>
    </div>
  );
}

export default ChooseCategories;
