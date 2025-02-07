import React, { useState } from 'react';
import AdminNavbar from '../../AdminNavbar/AdminNavbar';
import ChooseCategories from './ChooseCategories';
import ConfirmButton from '../../ConfirmButton/ConfirmButton';
import styles from './MainRemoveCategoryPage.module.css';

function MainRemoveCategoryPage() {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const handleConfirm = async () => {
    if (selectedCategoryIds.length === 0) {
      alert("No category selected.");
      return;
    }

    const selectedCategoryId = selectedCategoryIds[0]; // Assuming single selection

    try {
      const deleteResponse = await fetch(
        `http://localhost:3000/api/categories/${selectedCategoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        alert(errorData.message || "Failed to delete category.");
        return;
      }

      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error during category deletion process:", error);
      alert("An error occurred during the process.");
    }
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <div className={`card p-4 ${styles.contentContainer}`}>
          <h3>Choose the categories you want to delete</h3>
          <ChooseCategories value={selectedCategoryIds} onChange={setSelectedCategoryIds} />
          <ConfirmButton onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

export default MainRemoveCategoryPage;
