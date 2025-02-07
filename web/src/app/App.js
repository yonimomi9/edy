import React, { useEffect, useState } from "react";
import "../index.css";
import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeAfterLog from "../HomePageConnected/ScreensUser/HomeAfterLog/HomeAfterLog";
import HomePageAdmin from "../HomePageConnected/ScreensAdmin/HomePageAdmin/HomePageAdmin";
import Login from "../homePageNotConnected/Login/Login";
import Register from "../homePageNotConnected/Register/Register";
import Home from "../homePageNotConnected/HomePage/Home/Home";
import VideoPlayer from "../HomePageConnected/VideoPlayer/VideoPlayer";
import Logo from "./Logo/Logo";
import MainPage from "../admin/MainPage/MainPage";
import MainAddCategoryPage from "../admin/add/category/MainAddCategoryPage";
import MainAddMoviePage from "../admin/add/movie/MainAddMoviePage";
import MoviesPage from "../HomePageConnected/ScreensUser/MoviesPage/MoviesPage";
import MoviesPageAdmin from "../HomePageConnected/ScreensAdmin/MoviesPageAdmin/MoviesPageAdmin";
import SearchPage from "../HomePageConnected/ScreensUser/SearchPage/SearchPage";
import SearchPageAdmin from "../HomePageConnected/ScreensAdmin/SearchPageAdmin/SearchPageAdmin";
import MovieInfo from "../HomePageConnected/ScreensUser/MovieInfo/MovieInfo";
import MovieInfoAdmin from "../HomePageConnected/ScreensAdmin/MovieInfoAdmin/MovieInfoAdmin";
import MainRemoveCategoryPage from "../admin/remove/category/MainRemoveCategoryPage";
import MainRemoveMoviePage from "../admin/remove/movie/MainRemoveMoviePage";
import MainEditCategoryPage from "../admin/edit/category/MainEditCategoryPage";
import MainEditCategoryPageWithId from "../admin/edit/categoryWithID/MainEditCategoryPageWithId";
import MainEditMoviePage from "../admin/edit/movie/MainEditMoviePage";
import MainEditMoviePageWithId from "../admin/edit/movieWithID/MainEditMoviePageWithId";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [loggedUser, setLoggedUser] = useState(null); // `null` means not yet determined
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [categories, setCategories] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Unified loading state

  const toggleTheme = () => setIsDarkMode((prevMode) => !prevMode);

  const fetchLoggedUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.warn("No token found in sessionStorage.");
      return null;
    }
    try {
      const response = await fetch("http://localhost:3000/api/tokens", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const user = await response.json();
        sessionStorage.setItem("username", user.username); // Store the username
        return user; // Ensure user is returned
      } else {
        console.error("Failed to fetch logged user:", response.status);
        sessionStorage.removeItem("token");
        return null;
      }
    } catch (error) {
      console.error("Error fetching logged user:", error);
      sessionStorage.removeItem("token");
      return null;
    }
  };  

  const fetchMovies = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Raw API Response:", data); // Log to ensure categories are included in the response
  
        // Include categories in each movie object
        const moviesWithCategories = data.flatMap((category) =>
          (category.movies || []).map((movie) => ({
            ...movie,
            categories: [category.name], // Add the category name to the movie
          }))
        );
  
        console.log("Processed Movies with Categories:", moviesWithCategories);
        setAllMovies(moviesWithCategories);
      } else {
        console.error("Failed to fetch movies:", response.status);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };  

  const fetchCategories = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories:", response.status);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUsers = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const users = await response.json();
        setAllUsers(users);
        
        // Debug step 3: Check user count and an example user object
        console.log("All Users Count:", users.length || "Not an array");
        console.log("User Object Example:", users[0] || "Users is not an array");
  
        // Debug step 4: Verify data type and structure
        console.log("Type of Users:", typeof users);
        if (Array.isArray(users)) {
          console.log("Users is an array:", users);
        } else {
          console.log("Users is not an array, its keys are:", Object.keys(users));
        }
  
        console.log("Fetched All Users:", JSON.stringify(users, null, 2)); // Logs a formatted string version
      } else {
        console.error("Failed to fetch users:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  // Fetch user and then movies/categories on app load
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const user = await fetchLoggedUser();
      console.log("Fetched Logged User:", user);
      setLoggedUser(user);

      if (user) {
        console.log("Fetching movies and categories for user:", user.username);
        await Promise.all([fetchMovies(), fetchCategories(), fetchUsers()]);
      }
      setIsLoading(false);
    };
    initialize();
  }, []);

  if (isLoading) {
    return <div className={styles.app}>Loading...</div>; // Loading state
  }
  
  return (
    <Router>
      <div data-theme={isDarkMode ? "dark" : "light"} className={styles.app}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/video-player"
            element={<VideoPlayer allMovies={allMovies} loggedUser={loggedUser} />} 
          />
          <Route
            path="/home-admin"
            element={
              <PrivateRoute>
                <HomePageAdmin
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  loggedUser={loggedUser}
                  allMovies={allMovies}
                  categories={categories}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/home_logged"
            element={
              <PrivateRoute>
                <HomeAfterLog
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  loggedUser={loggedUser}
                  allMovies={allMovies}
                  categories={categories}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <PrivateRoute>
                <MoviesPage
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  loggedUser={loggedUser}
                  allMovies={allMovies}
                  categories={categories}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies-admin"
            element={
              <PrivateRoute>
                <MoviesPageAdmin
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  loggedUser={loggedUser}
                  allMovies={allMovies}
                  categories={categories}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  loggedUser={loggedUser}
                  allMovies={allMovies}
                  categories={categories}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/search-admin"
            element={
              <PrivateRoute>
                <SearchPageAdmin
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  loggedUser={loggedUser}
                  allMovies={allMovies}
                  categories={categories}
                />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login setLoggedUser={setLoggedUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main-page-admin" element={<MainPage />} />
          <Route
            path="/main-add-category"
            element={
              <MainAddCategoryPage
                allMovies={allMovies}
              />
            }
          />
          <Route path="/main-add-movie" element={<MainAddMoviePage />} />
          <Route
            path="/movie-info"
            element={
              <PrivateRoute>
                <MovieInfo
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  movies={allMovies}
                  categories={categories}
                  loggedUser={loggedUser}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/movie-info-admin"
            element={
              <PrivateRoute>
                <MovieInfoAdmin
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  movies={allMovies}
                  categories={categories}
                  loggedUser={loggedUser}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/main-remove-category" element={<MainRemoveCategoryPage />} />
          <Route
            path="/main-remove-movie"
            element={
            <MainRemoveMoviePage
              allMovies={allMovies}
              allUsers={allUsers} 
             />
             } />
          <Route
            path="/main-edit-category"
            element={
              <MainEditCategoryPage
                categories={categories}
                allMovies={allMovies}
                fetchCategories={fetchCategories}
              />
            }
          />
          <Route
            path="/main-edit-category/:id"
            element={
              <MainEditCategoryPageWithId
                categories={categories}
                fetchCategories={fetchCategories}
                allMovies={allMovies}
              />
            }
          />
          <Route
            path="/main-edit-movie"
            element={
              <MainEditMoviePage
                allMovies={allMovies}
                fetchMovies={fetchMovies} // Pass the fetchMovies function
                fetchCategories={fetchCategories} // Pass the fetchCategories function
                categories={categories}
              />
            }
          />
          <Route
            path="/main-edit-movie/:id"
            element={
              <MainEditMoviePageWithId
                allMovies={allMovies}
                fetchMovies={fetchMovies} // Pass the fetchMovies function
                fetchCategories={fetchCategories} // Pass the fetchCategories function
                categories={categories}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
