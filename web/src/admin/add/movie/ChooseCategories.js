import React, { useEffect, useState } from "react";
import styles from "./ChooseCategories.module.css";

function ChooseCategories({ onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          setFilteredCategories(data);
        } else {
          alert("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const toggleCategorySelection = (category) => {
    const updatedSelection = selectedCategories.includes(category.name)
      ? selectedCategories.filter((c) => c !== category.name)
      : [...selectedCategories, category.name];

    setSelectedCategories(updatedSelection);
    onChange(updatedSelection);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Search and Choose Categories:</label>
      <input
        type="text"
        placeholder="Search for a category..."
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />
      <div className={styles.categoryList}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category._id}
              className={`${styles.categoryItem} ${
                selectedCategories.includes(category.name) ? styles.selected : ""
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
        {selectedCategories.length > 0 ? (
          <p>Selected Categories: {selectedCategories.join(", ")}</p>
        ) : (
          <p>No categories selected</p>
        )}
      </div>
    </div>
  );
}

export default ChooseCategories;
