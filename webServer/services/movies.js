const net = require('net');
const Movie = require('../models/movies');
const CategoryModels = require('../models/Categories');
const CategoryServices = require('../services/Categories');
const User = require('../models/Users');

/**
 * Create a new movie
 * @param {String} title - Movie title
 * @param {Array} categories - Array of category ObjectIds
 * @returns {Object} - The created movie
 */
const createMovie = async (title, categoryNames, movieFileName, thumbnailFileName) => {
  const categories = await CategoryModels.find({ name: { $in: categoryNames } });

  if (categories.length !== categoryNames.length) {
    throw new Error('Some categories do not exist.');
  }

  const movie = new Movie({
    title,
    categories: categories.map((cat) => cat.name), // Use category names instead of ObjectId
    filePath: movieFileName,
    thumbnailPath: thumbnailFileName,
  });

  await movie.save();

  // Update categories with the movie's `id` (or `title`)
  await Promise.all(
    categories.map((category) => {
      category.movies.push(movie.id); // Use the movie's unique ID
      return category.save();
    })
  );

  return movie;
};

const getMoviesForUser = async (userId) => {
  try {
    // Step 1: Fetch user and their watched movies
    const user = await User.findOne({ id: userId });
    if (!user) throw new Error('User not found');
    const watchedMovieIds = user.watchedMovies; // Array of watched movie IDs

    // Step 2: Fetch promoted categories with their movies
    const promotedCategories = await CategoryModels.find({ promoted: true }).populate({
      path: 'movies',
      select: 'id title categories', // Fetch relevant fields only
    });

    const promotedMovies = await Promise.all(
      promotedCategories.map(async (category) => {
        // Fetch full movie details for each movie ID in the category
        const fullMovies = await Movie.find({ id: { $in: category.movies } }).select('id title categories');

        const unwatchedMovies = fullMovies.filter((movie) => {
          const isUnwatched = !watchedMovieIds.includes(movie.id);
          return isUnwatched;
        });

        // Shuffle movies and limit to 20
        const shuffledMovies = unwatchedMovies.sort(() => Math.random() - 0.5).slice(0, 20);

        return {
          category: category.name,
          movies: shuffledMovies.map((movie) => ({
            id: movie.id,
            title: movie.title || 'Title Missing',
            categories: movie.categories || [],
          })),
        };
      })
    );

    // Step 3: Fetch the 20 most recently watched movies for this user
    const recentlyWatchedMovies = await Movie.find({ id: { $in: watchedMovieIds } })
      .sort({ _id: -1 }) // Sort by most recently added
      .limit(20);

    // Shuffle the recently watched movies
    const shuffledRecentlyWatched = recentlyWatchedMovies.sort(() => Math.random() - 0.5);

    const recentlyViewed = {
      category: 'Recently Viewed',
      movies: shuffledRecentlyWatched.map((movie) => ({
        id: movie.id,
        title: movie.title,
      })),
    };

    // Step 4: Construct the final response
    const result = {
      promotedCategories: promotedMovies.filter((cat) => cat.movies.length > 0), // Include only categories with unwatched movies
      recentlyViewed,
    };

    return result;
  } catch (error) {
    console.error('Error fetching movies for user:', error);
    throw new Error('Failed to fetch movies for user');
  }
};


const getMovieByMovieId = async (movieId) => {
  const movie = await Movie.findOne({ id: movieId });
  return movie;
};

const updateMovieByMovieId = async (id, title, categories, files) => {
  try {
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error("Invalid or missing categories.");
    }

    const movie = await getMovieByMovieId(id);
    if (!movie) {
      console.error("Service: Movie not found for ID:", id);
      return null;
    }
    // Update title
    movie.title = title;

    // Update categories
    movie.categories = categories;

    // Update file paths
    if (files?.file) {
      movie.filePath = `/movies/${files.file[0].filename}`;
    }
    if (files?.thumbnail) {
      movie.thumbnailPath = `/thumbnails/${files.thumbnail[0].filename}`;
    }

    await movie.save();

    // Update category associations using updateCategory
    const allCategories = await CategoryModels.find();

    // Remove the movie from categories it no longer belongs to
    await Promise.all(
      allCategories.map(async (category) => {
        if (!categories.includes(category.name) && category.movies.includes(movie.id)) {
          await CategoryServices.updateCategory(category.id, undefined, undefined, [], movie.id);
        }
      })
    );

    // Add the movie to the categories it belongs to
    await Promise.all(
      categories.map(async (categoryName) => {
        const category = await CategoryModels.findOne({ name: categoryName });
        if (category && !category.movies.includes(movie.id)) {
          await CategoryServices.updateCategory(category.id, undefined, undefined, [movie.id]);
        }
      })
    );
    console.log("Service: Movie is: ",movie);
    return movie;
  } catch (error) {
    console.error("Service: Error in updateMovieByMovieId:", error.message);
    throw new Error("Failed to update movie.");
  }
};


/**
 * Delete a movie by its sequential movie ID
 * @param {Number} movieId - The sequential movie ID
 * @returns {Number} - Status code (204 if deleted, 404 if not found).
 */
const deleteMovieByMovieId = async (userId, movieId) => {
  try {
    // Step 1: Check if the movie exists in the database
    const movieExists = await Movie.findOne({ id: movieId });
    if (!movieExists) {
      console.error(`Movie with ID ${movieId} not found in the database.`);
      return 404; // Movie not found
    }

    console.log(`Found movie in database: ${JSON.stringify(movieExists)}`);

    // Step 2: Find all users who still have this movie in their watchedMovies
    const allUsersWithMovie = await User.find({ watchedMovies: movieId });

    // Step 3: Remove the movie from the specific user's watchedMovies array
    await User.updateOne(
      { id: userId },
      { $pull: { watchedMovies: movieId } }
    );
    console.log(`Removed movie ID ${movieId} from user ${userId}'s watchedMovies.`);    

    // Step 4: Communicate with the server for all users who have this movie
    for (const user of allUsersWithMovie) {
      const message = `DELETE ${user.id} ${movieId}`;
      try {
        console.log(`🛠️ [DEBUG] Sending message to server: "DELETE ${user.id} ${movieId}"`);
        const serverResponse = await communicateWithServer(message);
        console.log(`Server response for user ${user.id}: ${serverResponse}`);

        if (!serverResponse.startsWith("204")) {
          console.error(`Failed to delete movie ID ${movieId} for user ${user.id} on the external server.`);
          return 500; // External server error
        }

        // Remove the movie from the user's watchedMovies array
        await User.updateOne(
          { id: user.id },
          { $pull: { watchedMovies: movieId } }
        );
        console.log(`Removed movie ID ${movieId} from user ${user.id}'s watchedMovies.`);
      } catch (serverError) {
        console.error(`Error communicating with the external server for user ${user.id}: ${serverError.message}`);
        return 500; // Internal server error during external communication
      }
    }

    // Step 5: Remove the movie from all categories it belongs to
    await CategoryModels.updateMany(
      { movies: movieId },
      { $pull: { movies: movieId } }
    );
    console.log(`Removed movie ID ${movieId} from categories.`);

    // Step 6: Finally, delete the movie from the movies collection
    // const deletedMovie = await Movie.findOneAndDelete({ id: movieId });
    // console.log(`Deleted movie: ${JSON.stringify(deletedMovie)}`);

    return 204; // Successfully handled deletion
  } catch (error) {
    console.error("Error during movie deletion:", error.message);
    return 400; // Internal server error
  }
};


/**
 * Search for movies by a query string
 * @param {String} query - The search query
 * @returns {Array} - The list of matching movies
 */
const searchMovies = async (regex) => {
  try {
    if (!(regex instanceof RegExp)) {
      throw new Error('Provided parameter is not a valid regular expression.');
    }

    // Find movies with matching titles or categories
    const movies = await Movie.find({
      $or: [
        { title: { $regex: regex } }, // Match movie titles
      ],
    })
      .populate({
        path: 'categories', // Populate the categories field
        select: 'name', // Only include the 'name' field from categories
      })
      .exec();

    // Manually add movies whose categories match the regex
    const additionalMovies = await Movie.find()
      .populate({
        path: 'categories',
        match: { name: { $regex: regex } }, // Match categories by name
        select: 'name', // Only include the 'name' field
      })
      .exec();

    // Merge results, ensuring no duplicates
    const allMovies = [...movies];
    additionalMovies.forEach((movie) => {
      if (!allMovies.some((m) => m.id === movie.id)) {
        allMovies.push(movie);
      }
    });

    // Filter movies to include only those with matched titles or populated categories
    const filteredMovies = allMovies.filter(
      (movie) => regex.test(movie.title) || (movie.categories && movie.categories.length > 0)
    );

    return filteredMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      categories: movie.categories.map((category) => category.name),
    }));
  } catch (error) {
    throw new Error('Error fetching movies: ' + error.message);
  }
};

const communicateWithServer = (message) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    // Use the RECOMMEND_PORT environment variable, or fallback to a default value (e.g., 5000)
    const recommendPort = process.env.RECOMMEND_PORT || 5000;

    console.log(`Attempting to connect to server on port ${recommendPort}`);

    client.connect(recommendPort, 'server', () => {
      console.log(`Connected to server. Sending message: "${message}"`);
      client.write(message);
    });

    let response = '';

    client.on('data', (data) => {
      console.log(`Data received from server: "${data.toString()}"`);
      response += data.toString();
      client.destroy();
    });

    client.on('close', () => {
      console.log(`Connection closed by server. Full response: "${response.trim()}"`);
      resolve(response.trim());
    });

    client.on('error', (err) => {
      console.error(`Error during TCP communication: ${err.message}`);
      reject(err);
    });
  });
};


const getRecommendedMovies = async (userId, movieId) => {
  const message = `GET ${userId} ${movieId}`;
  try {
    console.log(`Sending message to the server: "${message}"`);
    const response = await communicateWithServer(message);

    console.log(`Received response from server: "${response}"`);

    if (!response.startsWith("200 Ok")) {
      console.error("Unexpected response from server:", response);
      console.log("Raw server response:", response);
      return { error: "Failed to fetch recommended movies. Server error." };
    }

    const movieIds = response
      .split("\n")[2] // Get the fourth line of the response (movie IDs)
      .trim()
      .split(" ")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    console.log(`Extracted movie IDs: ${movieIds}`);

    //const movies = await Movie.find({ id: { $in: movieIds } }).select("id title categories");
    const movies = await Movie.find({}).select("id title categories");
    console.log(`Movies fetched from database: ${movies}`);

    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      categories: movie.categories,
    }));
  } catch (err) {
    console.error("Error during GET communication:", err);
    return { error: "Failed to fetch recommended movies." };
  }
};



/**
 * Update that a user has watched a specific movie.
 * @param {String} userId - The ID of the user.
 * @param {Number} movieId - The ID of the movie watched.
 * @returns {Number} - The status code (201, 204, 400, or 404).
 */
const updateUserWatchedMovie = async (userId, movieId) => {
  const patchAction = 'PATCH';
  const postAction = 'POST';

  // Ensure both userId and movieId are strings
  if (typeof userId !== 'string' && typeof userId !== 'number') {
    console.error("❌ Error: userId must be a string or number.");
    return 400;
  }
  if (typeof movieId !== 'string' && typeof movieId !== 'number') {
    console.error("❌ Error: movieId must be a string or number.");
    return 400;
  }

  // Convert to strings
  const userIdString = String(userId);
  const movieIdString = String(movieId);

  const patchMessage = `${patchAction} ${userIdString} ${movieIdString}`;
  const postMessage = `${postAction} ${userIdString} ${movieIdString}`;

  try {
    const patchResponse = await communicateWithServer(patchMessage);
    console.log("[DEBUG] PATCH Response:", patchResponse);

    if (patchResponse.startsWith("204")) {
      await updateUserWatchedMoviesArray(userIdString, movieIdString);
      return 204;
    }

    if (patchResponse.startsWith("404")) {
      const postResponse = await communicateWithServer(postMessage);

      if (postResponse.startsWith("201")) {
        await updateUserWatchedMoviesArray(userIdString, movieIdString);
        return 201;
      }
      if (postResponse.startsWith("404")) return 404;
    }

    console.error("Unexpected response from server.");
    return 400;
  } catch (error) {
    console.error('Error during PATCH or POST communication:', error);
    return 400;
  }
};

/**
 * Helper function to update the user's watchedMovies array in the database.
 * @param {String} userId - The ID of the user.
 * @param {Number} movieId - The ID of the movie to add to watchedMovies.
 */
const updateUserWatchedMoviesArray = async (userId, movieId) => {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Check if the movie is already in the watchedMovies array
    if (!user.watchedMovies.includes(movieId)) {
      user.watchedMovies.push(movieId);
      await user.save(); // Save the updated user document
    } else {
      console.log(`Movie ID ${movieId} is already in User ID ${userId}'s watchedMovies.`);
    }
  } catch (err) {
    console.error(`Error updating watchedMovies for User ID ${userId}:`, err);
    throw new Error('Failed to update watchedMovies.');
  }
};


module.exports = {
  createMovie,
  getMoviesForUser,
  getMovieByMovieId,
  updateMovieByMovieId,
  deleteMovieByMovieId,
  searchMovies,
  getRecommendedMovies,
  updateUserWatchedMovie,
};
