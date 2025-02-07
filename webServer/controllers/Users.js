const userService = require('../services/Users');
const path = require('path');
const fs = require('fs');

const signUp = async (req, res) => {
  try {
    const { username, password, nameForDisplay } = req.body;

    if (!username || !password || !nameForDisplay) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let profileImagePath = 'profilePictures/default_profile_pic.png'; // Default profile image path
    if (req.file) {
      profileImagePath = `/profilePictures/${path.basename(req.file.path)}`; // Use the saved file's path
    }

    // Call the user service to create the user
    const user = await userService.createUser(username, password, profileImagePath, nameForDisplay);

    if (!user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'User ID required' });
  }

  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

const updateUser = async (req, res) => {
  const { password, newMovies, nameForDisplay } = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'User ID required' });
  }

  try {
    // Check and process the uploaded file for profile image if provided
    let profileImagePath;
    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png']; // Allowed file types
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG and PNG are allowed.' });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const uploadPath = path.join(__dirname, '../web/public/profilePictures', fileName);

      try {
        // Save the file to the specified directory
        fs.writeFileSync(uploadPath, req.file.buffer);
        profileImagePath = `/profilePictures/${fileName}`;
      } catch (error) {
        console.error('Error saving file:', error);
        return res.status(500).json({ message: 'Failed to save profile image.' });
      }
    }

    // Build update data without including `newMovies` directly
    const updateData = {
      ...(password && { password }),
      ...(nameForDisplay && { nameForDisplay }),
      ...(profileImagePath && { profileImage: profileImagePath }),
    };

    // Update user data and add watchedMovies logic
    const user = await userService.updateUser(id, password, newMovies, profileImagePath, nameForDisplay);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle watchedMovies update
    if (newMovies && Array.isArray(newMovies) && newMovies.length > 0) {
      const uniqueMovies = [...new Set([...user.watchedMovies, ...newMovies])]; // Ensure uniqueness
      user.watchedMovies = uniqueMovies;
      await user.save(); // Save changes to the database
    }

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

module.exports = { signUp, getUser, updateUser };
