const Category = require('../models/Categories');
const Movie = require('../models/movies');

class IsNotDeletableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IsNotDeletableError';
    }
}

const createCategory = async (name, promoted, movies) => {
    const category = new Category({ name, promoted, movies });
    return await category.save();
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const getCategories = async () => {
    return await Category.find();
};

const updateCategory = async (id, name, promoted, newMovies, movieId) => {
    try {
        console.log("[DEBUG] Starting update for category ID:", id);
        const category = await getCategoryById(id);
        if (!category) {
            console.error("[ERROR] Category not found for ID:", id);
            return null;
        }

        if (name !== undefined) category.name = name;
        if (promoted !== undefined) category.promoted = promoted;

        if (newMovies !== undefined) {
            if (movieId) {
                const movieIndex = category.movies.indexOf(movieId);
                if (movieIndex !== -1 && !newMovies.includes(movieId)) {
                    console.log(`[DEBUG] Removing movie ID ${movieId} from category: ${category.name}`);
                    category.movies.splice(movieIndex, 1);
                }
            }

            const validMovies = await Movie.find({ id: { $in: newMovies } });
            const validMovieIds = validMovies.map((movie) => movie.id);

            validMovieIds.forEach((validMovieId) => {
                if (!category.movies.includes(validMovieId)) {
                    category.movies.push(validMovieId);
                }
            });
        }

        await category.save();
        console.log("[DEBUG] Category updated successfully:", category);
        return category;
    } catch (error) {
        console.error("[ERROR] Failed to update category:", error.message);
        throw new Error("Failed to update category.");
    }
};

const deleteCategory = async (id) => {
    console.log("[DEBUG] Deleting category with ID:", id);

    // Step 1: Retrieve the category
    const category = await getCategoryById(id);
    if (!category) {
        console.error("[ERROR] Category not found:", id);
        return null;
    }

    // Step 2: Update movies to remove the category
    await updateMoviesCategoryForDelete(category);

    // Step 3: Delete the category from the database
    await category.deleteOne();

    console.log("[DEBUG] Successfully deleted category:", id);
    return category;
};

const isCategoryDeletable = async (category) => {
    console.log("[DEBUG] Checking if category is deletable:", category);

    const results = await Promise.all(
        category.movies.map(async (movieId) => {
            const movie = await Movie.findOne({ id: movieId }).catch((err) => {
                console.error("[ERROR] Movie fetch failed for ID:", movieId, err);
                return null;
            });

            if (!movie) {
                console.log("[DEBUG] Movie not found, skipping:", movieId);
                return true; // Movie not found
            }

            console.log("[DEBUG] Movie found:", movie);
            return movie.categories.length > 1; // Check category count
        })
    );

    console.log("[DEBUG] Deletable checks per movie:", results);
    return results.every(Boolean);
};

const updateMoviesCategoryForDelete = async (category) => {
    try {
        await Promise.all(
            category.movies.map(async (movieId) => {
                const movie = await Movie.findOne({ id: movieId });
                if (!movie) {
                    console.log(`Movie ${movieId} does not exist, skipping...`);
                    return;
                }

                // Remove the category from the movie's categories list
                await Movie.updateOne(
                    { id: movieId },
                    { $pull: { categories: category.name } } // Use category name instead of `_id` to match stored format
                );

                console.log(`[DEBUG] Removed category '${category.name}' from movie '${movie.title}'`);

                // Optionally, handle uncategorized movies
                const updatedMovie = await Movie.findOne({ id: movieId }); // Re-fetch movie after update
                if (updatedMovie.categories.length === 0) {
                    await Movie.updateOne(
                        { id: movieId },
                        { $addToSet: { categories: 'Uncategorized' } }
                    );
                    console.log(`[DEBUG] Movie '${updatedMovie.title}' is now categorized as 'Uncategorized'`);
                }
            })
        );
        console.log("[DEBUG] All movies updated successfully.");
    } catch (error) {
        console.error("[ERROR] Failed to update movies during category deletion:", error);
        throw new Error("Failed to update movies during category deletion.");
    }
};


module.exports = {
    createCategory,
    getCategoryById,
    getCategories,
    updateCategory,
    deleteCategory,
    isCategoryDeletable,
    updateMoviesCategoryForDelete,
};
