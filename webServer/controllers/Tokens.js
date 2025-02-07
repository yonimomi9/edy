const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Import the User model
const Token = require('../models/Tokens'); // Import the Tokens model
const userService = require('../services/Users'); // Import your user service if needed

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Validate user credentials
        const user = await userService.getRegisterUser(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Username or Password are incorrect.' });
        }

        // Generate JWT
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: user.username,
                    roles: user.roles, // Include roles
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Save token to the tokens collection
        await Token.create({
            username: user.username,
            token: accessToken,
        });

        // Include user info in the response
        res.status(200).json({
            accessToken,
            user: {
                nameForDisplay: user.nameForDisplay,
                roles: user.roles,
            },
        });
    } catch (error) {
        console.error('Error in handleLogin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getLoggedUser = async (req, res) => {
    try {
        console.log("Decoded username from token:", req.user); // Debug username

        // Find user by username and exclude password field
        const user = await User.findOne({ username: req.user }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Construct the profile image URL
        const profileImage = user.profileImage
            ? `http://localhost:8000${user.profileImage}` // Use stored profile image
            : "http://localhost:8000/profilePictures/default_profile_pic.png"; // Fallback to default

        console.log("Resolved Profile Image:", profileImage); // Log for debugging

        // Return user's ID along with the display name and profile picture
        res.status(200).json({
            id: user.id, // Include the user's ID
            nameForDisplay: user.nameForDisplay,
            profilePicture: profileImage,
        });
    } catch (err) {
        console.error("Error fetching logged user:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const handleLogout = async (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.split(" ")[1];
  
      if (!token) {
        return res.status(400).json({ message: "Token is required for logout" });
      }
  
      // Remove token from the database
      await Token.deleteOne({ token });
  
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error in handleLogout:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports = { handleLogin, getLoggedUser, handleLogout };
