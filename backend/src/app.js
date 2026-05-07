const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Initialize database and create tables
require("./db/schema");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const moviesRouter = require("./routes/movies");
const libraryRouter = require("./routes/library");

app.use("/api/movies", moviesRouter);
app.use("/api/library", libraryRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CineVault API" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CineVault backend is running!",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎬 CineVault server running on http://localhost:${PORT}`);
});
