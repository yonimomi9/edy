const categoryService = require('../services/Categories');
const Movie = require('../models/movies'); // Import the Movie model

const createCategory = async (req, res) => {
  try {
      const { name, promoted, movies } = req.body;

      if (!name || typeof promoted !== "boolean") {
          return res.status(400).json({ message: "Name and promoted fields are required" });
      }

      if (!Array.isArray(movies) || !movies.every((id) => Number.isInteger(id))) {
          return res.status(400).json({ message: "Movies must be an array of integers" });
      }

      // Validate movie IDs
      const validMovies = await Movie.find({ id: { $in: movies } });
      const validMovieIds = validMovies.map((movie) => movie.id);

      if (validMovieIds.length !== movies.length) {
          return res.status(400).json({ message: "Some movies are invalid" });
      }

      // Create the new category
      const category = await categoryService.createCategory(name, promoted, validMovieIds);

      // Update the movies to include the new category in their `categories` field
      await Promise.all(
          validMovieIds.map(async (movieId) => {
              await Movie.updateOne(
                  { id: movieId },
                  { $addToSet: { categories: name } } // Add the category name to `categories` field
              );
          })
      );

      res.status(201).json(category);
  } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const getCategory = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
  
    try {
      const category = await categoryService.getCategoryById(id);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };  
  

  const getCategories = async (req, res) => {
    try {
      const categories = await categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { name, promoted, movies } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
  
    try {
      let validMovieIds = [];
  
      if (movies) {
        const validMovies = await Movie.find({ id: { $in: movies } });
        validMovieIds = validMovies.map((movie) => movie.id);
  
        if (validMovieIds.length !== movies.length) {
          return res.status(400).json({ message: "Some movies are invalid" });
        }
      }
  
      const category = await categoryService.updateCategory(id, name, promoted, validMovieIds);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(204).json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
  
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }
  
    try {
      // Step 1: Retrieve the category
      const category = await categoryService.getCategoryById(categoryId);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
  
      // Step 2: Check if the category is deletable
      const isDeletable = await categoryService.isCategoryDeletable(category);
      if (!isDeletable) {
        return res.status(400).json({
          message: "Category cannot be deleted because it is the only category for some movies.",
        });
      }
  
      // Step 3: Update movies to remove the category
      await categoryService.updateMoviesCategoryForDelete(category);
  
      // Step 4: Delete the category
      await categoryService.deleteCategory(categoryId);
  
      res.status(200).json({ message: "Category deleted successfully." });
    } catch (err) {
      console.error("Error deleting category:", err);
      res.status(500).json({ message: err.message || "Internal server error." });
    }
  };


module.exports = {createCategory, getCategories, getCategory, updateCategory, deleteCategory};