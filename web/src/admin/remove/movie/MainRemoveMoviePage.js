import React, { useState } from 'react';
import AdminNavbar from '../../AdminNavbar/AdminNavbar';
import ChooseMovies from './ChooseMovies';
import ConfirmButton from '../../ConfirmButton/ConfirmButton';
import styles from './MainRemoveMoviePage.module.css';

function MainRemoveMoviePage({ allMovies, allUsers }) {
  const [selectedMovies, setSelectedMovies] = useState([]);

  const handleConfirm = async () => {
    if (selectedMovies.length === 0) {
      alert("No movie selected.");
      return;
    }
  
    try {
      for (const movie of selectedMovies) {
        console.log(`Deleting movie ${movie.id} (${movie.title}) from all users and the database.`);
  
        // Step 1: Delete the movie for each user
        for (const user of allUsers) {
          if (!user.watchedMovies || !user.watchedMovies.includes(movie.id)) {
            console.log(`Skipping user ID ${user.id}: Movie ${movie.id} not in watchedMovies`);
            continue;
          }
  
          const response = await fetch(
            `http://localhost:3000/api/movies/${movie.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                "user-id": user.id,
              },
            }
          );
  
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to delete movie ${movie.title} for user ${user.id}:`, errorData.error);
            alert(`Failed to delete movie ${movie.title} for user ${user.id}: ${errorData.error}`);
            return; // Exit on error
          }
  
          console.log(`Movie ${movie.title} deleted successfully for user ${user.id}`);
        }
  
        // Step 2: Delete the movie from the database (happens only once per movie)
        const finalResponse = await fetch(
          `http://localhost:3000/api/movies/${movie.id}/users`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
  
        if (!finalResponse.ok) {
          const finalErrorData = await finalResponse.json();
          console.error(`Failed to delete movie ${movie.title} from database:`, finalErrorData.error);
          alert(`Failed to delete movie ${movie.title} from database: ${finalErrorData.error}`);
          return; // Exit on error
        }
  
        console.log(`Movie ${movie.title} deleted successfully from the database.`);
      }
  
      alert("Selected movies deleted successfully!");
      setSelectedMovies([]); // Clear the selection
    } catch (error) {
      console.error("Error deleting movies:", error);
      alert("An error occurred while deleting movies.");
    }
  };
  

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.pageContainer}`}>
      <AdminNavbar />
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <div className={`card p-4 ${styles.contentContainer}`}>
          <h3>Choose the movies you want to delete</h3>
          <ChooseMovies
            value={selectedMovies}
            onChange={setSelectedMovies}
            allMovies={allMovies}
          />
          <ConfirmButton onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

export default MainRemoveMoviePage;
