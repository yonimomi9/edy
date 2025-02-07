const express = require('express');
const router = express.Router();
const userController = require('../controllers/Users');
const upload = require('../multer'); // Multer configuration
const { validate } = require('../middlewares/verifyJWT');
const User = require('../models/Users');

router.post('/register', upload.single('profilePicture'), userController.signUp);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from the database
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;