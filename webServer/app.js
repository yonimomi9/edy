const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const categories = require("./routes/Categories");
const movies = require("./routes/movies");
const users = require("./routes/Users");
const tokens = require("./routes/Tokens");
const errorHandler = require("./middlewares/errorsHandler");

require("dotenv").config(); // Load environment variables

// Connect to MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("[ERROR] MongoDB connection failed:", err);
    process.exit(1); // Exit on failure
  });

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:8000", // Adjust for your frontend origin
  credentials: true, // Allow cookies
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookies());

// Serve static files
const staticPaths = {
  profilePictures: path.join(__dirname, "app/web/public/profilePictures"),
  public: path.join(__dirname, "app/web/public"),
};

for (const [route, filePath] of Object.entries(staticPaths)) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
    console.log(`[DEBUG] Created missing static directory: ${filePath}`);
  }
  app.use(`/${route}`, express.static(filePath));
}

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] [${new Date().toISOString()}] [${req.method}] ${req.url}`);
  console.log("[DEBUG] Headers:", req.headers);
  console.log("[DEBUG] Body:", req.body);
  console.log("[DEBUG] Files:", req.files || "No files uploaded");
  next();
});

// API Routes
app.use("/api/categories", categories);
app.use("/api/users", users);
app.use("/api/tokens", tokens);
app.use("/api/movies", movies);

// Default 404 Route
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler Middleware
app.use(errorHandler);

// Database Clearing Function
async function clearDatabase() {
  try {
    const db = mongoose.connection.db;
    if (!db) throw new Error("No database connection established.");

    // Clear collections in MongoDB
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
      console.log(`[DEBUG] Cleared collection: ${collection.name}`);
    }

    // Clear local database file (if exists)
    const databaseFilePath = path.resolve(__dirname, "data", "database.txt");
    if (fs.existsSync(databaseFilePath)) {
      fs.unlinkSync(databaseFilePath);
      console.log(`[DEBUG] Deleted file: ${databaseFilePath}`);
    } else {
      console.log(`[DEBUG] File not found: ${databaseFilePath}`);
    }

    console.log("[DEBUG] Database cleared successfully.");
    process.exit(0); // Exit successfully
  } catch (err) {
    console.error("[ERROR] Error clearing database:", err);
    process.exit(1); // Exit with failure
  }
}

// Check for --clear-db argument
if (process.argv.includes("--clear-db")) {
  mongoose.connection.once("open", clearDatabase);
} else {
  // Start the server normally
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
