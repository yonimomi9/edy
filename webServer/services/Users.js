const mongoose = require('mongoose');
const User = mongoose.models.User || require('../models/User');

const createUser = async (username, password, profileImageBase64, nameForDisplay) => {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        return null;
    }

    const user = new User({
        username,
        password, // Add hashing here if needed
        profileImage: profileImageBase64, // Store base64-encoded image
        nameForDisplay,
    });

    return await user.save();
};
const getUserById = async (id) => {
    return await User.findOne({ id }).select('-password');
};

const getUsers = async () => {
    return await User.find().select('-password');
};

const updateUser = async (id, password, newMovies, photo, nameForDisplay) => {
    const user = await getUserById(id);
    if (!user) return null;

    // Logic for updating watchedMovies
    if (newMovies && Array.isArray(newMovies)) {
        // Ensure no duplicate movie IDs in the array
        user.watchedMovies = Array.from(new Set([...user.watchedMovies, ...newMovies]));
    }

    if (password) {
        user.password = password; // Add password hashing if needed
    }

    if (photo) {
        user.profileImage = photo;
    }

    if (nameForDisplay) {
        user.nameForDisplay = nameForDisplay;
    }

    return await user.save();
};


const getRegisterUser = async (username, password) => {
    const user = await User.findOne({ username, password }); // Replace this with hashed password comparison if applicable
    return user;
};

module.exports = { createUser, getUserById, updateUser, getUsers, getRegisterUser };
