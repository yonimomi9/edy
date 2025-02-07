const path = require('path');
const fs = require('fs');
const movieService = require('../services/movies');
const Movie = require('../models/movies'); // Add this import for the Movie model
const CategoryModels = require('../models/Categories'); // Fix: Import CategoryModels

/**
 * Controller to create a new movie
 */
const createMovie = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[DEBUG] [${timestamp}] Received request to create a movie:`, req.body);
  try {
    const { name, categories } = req.body;

    if (!name || !categories) {
      const errorTimestamp = new Date().toISOString();
      console.error(`[ERROR] [${errorTimestamp}] Name or categories missing in the request.`);
      console.log(`[DEBUG] [${errorTimestamp}] Response sent to client with status 400.`);
      return res.status(400).json({ error: "Name and categories are required." });
    }

    const categoriesArray = JSON.parse(categories);
    console.log(`[DEBUG] [${timestamp}] Parsed categories:`, categoriesArray);

    const movieFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!movieFile || !thumbnailFile) {
      const errorTimestamp = new Date().toISOString();
      console.error(`[ERROR] [${errorTimestamp}] Missing movie file or thumbnail.`);
      console.log(`[DEBUG] [${errorTimestamp}] Response sent to client with status 400.`);
      return res.status(400).json({ error: 'Both movie file and thumbnail are required.' });
    }

    console.log(`[DEBUG] [${timestamp}] Files received for movie creation:`, { movieFile, thumbnailFile });

    const movie = new Movie({
      title: name,
      categories: categoriesArray,
      filePath: `/movies/${movieFile.filename}`,
      thumbnailPath: `/thumbnails/${thumbnailFile.filename}`,
    });

    await movie.save();
    const successTimestamp = new Date().toISOString();
    console.log(`[DEBUG] [${successTimestamp}] Movie saved successfully with ID:`, movie.id);

    // Add movie ID to each category's `movies` array
    await Promise.all(
      categoriesArray.map(async (categoryName) => {
        const category = await CategoryModels.findOne({ name: categoryName });
        if (category) {
          category.movies.push(movie.id); // Add the movie ID
          await category.save();
        }
      })
    );
    
    console.log(`[DEBUG] [${successTimestamp}] Response sent to client with status 201.`);
    return res.status(201).json({
      message: 'Movie created successfully!',
      movie: {
        id: movie.id,
        title: movie.title,
        categories: movie.categories,
        filePath: movie.filePath,
        thumbnailPath: movie.thumbnailPath,
      },
    });
  } catch (error) {
    console.error('Error in createMovie:', error.message);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

/**
 * Controller to update a movie's information
 */
const updateMovieByMovieId = async (req, res) => {
  try {
    const { title, categories } = req.body;
    const parsedCategories = Array.isArray(categories) ? categories : JSON.parse(categories);

    const movie = await movieService.updateMovieByMovieId(req.params.id, title, parsedCategories, req.files);
    console.log("Controller: the movie is: ", movie);
    if (!movie) {
      console.error("Controller: Movie not found for ID:", req.params.id);
      return res.status(404).json({ errors: ["Movie not found"] });
    }
    console.log("Controller: return status 200");
    return res.status(200).json({
      success: true,
      message: "Movie updated successfully.",
      movie,
    });
  } catch (error) {
    console.error("Controller: Error updating movie:", error.message);
    return res.status(500).json({
      success: false,
      errors: [error.message],
    });
  }
};

/**
 * Controller to get movies for a specific user
 */
const getMoviesForUser = async (req, res) => {
  try {
    const categories = await CategoryModels.find(); // Fetch all categories

    const populatedCategories = await Promise.all(
      categories.map(async (category) => {
        // Fetch full movie details for each movie ID
        const movies = await Movie.find({ id: { $in: category.movies } }).select('id title thumbnailPath filePath');
        
        // Construct the response for the category
        return {
          name: category.name,
          promoted: category.promoted,
          movies: movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            thumbnailPath: `http://localhost:8000${movie.thumbnailPath}`,
            filePath: `http://localhost:8000${movie.filePath}`,
          })),
        };
      })
    );

    // Send the response with populated categories
    res.status(200).json(populatedCategories);
  } catch (error) {
    console.error('Error in getMoviesForUser:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to get a movie by its sequential movie ID
 */
const getMovieByMovieId = async (req, res) => {
  const movie = await movieService.getMovieByMovieId(req.params.id);
      if(!movie)
         return res.status(404).json({ errors: ['Movie not found']});
      res.json(movie);
};

/**
 * Controller to delete a movie by its sequential movie ID
 */
const deleteMovieByMovieId = async (req, res) => {
  try {
    const { id: movieId } = req.params; // Extract the movie ID from the URL
    const userId = req.headers['user-id']; // Extract the user ID from headers

    if (!userId) {
      console.error("❌ Error: Missing user-id in request headers.");
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Call the service to delete the movie
    const status = await movieService.deleteMovieByMovieId(userId, parseInt(movieId, 10));

    if (status === 404) {
      return res.status(404).json({ error: 'Movie not found.' }); // 404 Not Found
    } else if (status === 204) {
      return res.status(204).end(); // 204 No Content
    } else {
      return res.status(500).json({ error: 'Failed to delete the movie.' }); // 500 Internal Server Error
    }
  } catch (error) {
    return res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
};


/**
 * Controller to search for movies by a query
 */
const searchMovies = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const regex = new RegExp(query, 'i');
    const movies = await movieService.searchMovies(regex);
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to update user-watched movies
 */
const updateUserWatchedMovie = async (req, res) => {
  try {
   // Extract userId from request
    let userId = req.body?.userId;
    let movieId = req.params?.id;

    // Convert userId if needed
    if (typeof userId === "string") {
      userId = parseInt(userId, 10);
    }

    if (typeof userId !== "number" || isNaN(userId)) {
      console.error("Error: userId is invalid. Received:", userId, "Type:", typeof userId);
      return res.status(400).json({ error: "User ID is required and must be a number." });
    }

    // Convert movieId
    movieId = parseInt(movieId, 10);
    if (isNaN(movieId)) {
      console.error("Error: movieId is invalid. Received:", movieId, "Type:", typeof movieId);
      return res.status(400).json({ error: "Invalid movie ID." });
    }

    // Call service function
    const status = await movieService.updateUserWatchedMovie(userId, movieId);

    if (status === 201) return res.status(201).end();
    if (status === 204) return res.status(204).end();
    if (status === 404) return res.status(404).json({ error: "Movie not found." });
    if (status === 400) return res.status(400).json({ error: "Invalid input." });

    console.error("Unexpected error in updateUserWatchedMovie.");
    return res.status(500).json({ error: "Unexpected error." });
  } catch (error) {
    console.error("Exception in updateUserWatchedMovie:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Controller to get recommended movies for a user and a movie.
 */
const getRecommendedMovies = async (req, res) => {
  try {
    const { id: movieId } = req.params; // Extract the movie ID from the URL parameters

    // Extract the user ID from the request headers or middleware
    const userId = req.userId || req.headers['user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Call the service to get recommended movies
    const recommendedMovies = await movieService.getRecommendedMovies(userId, parseInt(movieId, 10));

    // If no movies are returned, send a 404 status
    if (!recommendedMovies || recommendedMovies.length === 0) {
      return res.status(404).json({ error: 'No recommended movies found.' });
    }

    // Send the recommended movies as a 200 OK response
    return res.status(200).json(recommendedMovies);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch recommended movies.' }); // 500 Internal Server Error
  }
};

const deleteMovieFromDatabase = async (req, res) => {
  try {
    const { id: movieId } = req.params;

    // Check if the movie exists in the database
    const movieExists = await Movie.findOne({ id: movieId });
    if (!movieExists) {
      console.error(`Movie with ID ${movieId} not found in the database.`);
      return res.status(404).json({ error: 'Movie not found.' });
    }

    // Delete the movie from the database
    const deletedMovie = await Movie.findOneAndDelete({ id: movieId });
    console.log(`Deleted movie: ${JSON.stringify(deletedMovie)}`);

    return res.status(204).end(); // Successfully deleted
  } catch (error) {
    console.error('Error deleting movie from database:', error.message);
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createMovie,
  getMoviesForUser,
  getMovieByMovieId,
  updateMovieByMovieId,
  deleteMovieByMovieId,
  getRecommendedMovies: movieService.getRecommendedMovies,
  updateUserWatchedMovie,
  searchMovies,
  deleteMovieFromDatabase,
};