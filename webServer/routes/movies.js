const express = require('express');
const router = express.Router();
const upload = require('../multer');
const movieController = require('../controllers/movies');
const { validate } = require('../middlewares/verifyJWT');
const { verifyRoles } = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/roles_list.js');

router.route('/')
  .all(validate)
  .get(movieController.getMoviesForUser)
  .post(
    (req, res, next) => {
      console.log("[DEBUG] Incoming request for file upload:", req.body, req.files);
      next();
    },
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    async (req, res, next) => {
      try {
        console.log("[DEBUG] Uploaded files:", req.files);
        if (!req.files || !req.files.file || !req.files.thumbnail) {
          console.error("[ERROR] Missing required files in request.");
          return res.status(400).json({ error: "Missing required files." });
        }
        next();
      } catch (error) {
        console.error("[ERROR] Unexpected error during file validation:", error);
        res.status(500).json({ error: "Unexpected server error during file validation." });
      }
    },
    movieController.createMovie
  );  

router.route('/:id/recommend/')
  .all(validate)
  .get(movieController.getRecommendedMovies)
  .post(movieController.updateUserWatchedMovie);

router.route('/:id')
  .all(validate)
  .get(movieController.getMovieByMovieId)
  .put(
    validate,
    verifyRoles(ROLES_LIST.admin),
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    movieController.updateMovieByMovieId
  )
  .delete(verifyRoles(ROLES_LIST.admin), movieController.deleteMovieByMovieId);

router.route('/:id/users')
  .all(validate, verifyRoles(ROLES_LIST.admin)) // Only admins can perform this action
  .delete(movieController.deleteMovieFromDatabase);
  
router.route('/search/:query/')
  .all(validate)
  .get(movieController.searchMovies);

module.exports = router;
