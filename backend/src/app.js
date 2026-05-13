const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://cinephiles-inc.vercel.app", // your production frontend
      "https://cinephiles-98e4aa7z8-benali-ghassens-projects.vercel.app", // preview deploys
    ],
  }),
);
app.use(express.json());

// Routes
const moviesRouter = require("./routes/movies");
const libraryRouter = require("./routes/library");
const xpRouter = require("./routes/xp");
const trophiesRouter = require("./routes/trophies");
const watchProvidersRouter = require("./routes/watchProviders");

app.use("/movies", moviesRouter);
app.use("/library", libraryRouter);
app.use("/xp", xpRouter);
app.use("/trophies", trophiesRouter);
app.use("/watch-providers", watchProvidersRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Cinephiles Inc. API" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CineVault backend is running!",
  });
});

// Initialize database and create tables
const { createTables } = require("./db/schema");

// Ensure tables are created before first request
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await createTables();
      dbInitialized = true;
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }
  next();
});

// EXPORT for Vercel serverless functions
module.exports = app;

// TEMP: Local testing only (remove before Vercel deploy)
if (require.main === module || process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🎬 CineVault server running on http://localhost:${PORT}`);
  });
}
