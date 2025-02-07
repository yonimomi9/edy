const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/Tokens');
const { validate } = require('../middlewares/verifyJWT');

// POST /tokens: Handle login and token generation
router.post('/', tokenController.handleLogin);

// GET /tokens: Get logged-in user details (with token validation middleware)
router.get('/', validate, tokenController.getLoggedUser);

// POST /tokens/logout: Handle logout
router.post("/logout", tokenController.handleLogout);

module.exports = router;
