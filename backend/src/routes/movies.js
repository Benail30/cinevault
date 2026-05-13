const express = require("express");
const router = express.Router();
const {
  getTrendingMovies,
  searchMovies,
  getMovieById,
} = require("../services/tmdb");

// GET /api/movies/trending
router.get("/trending", async (req, res) => {
  try {
    const data = await getTrendingMovies();
    res.json(data);
  } catch (error) {
    console.error("Trending movies error:", error.message || error);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

// GET /api/movies/search?q=batman
router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const data = await searchMovies(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to search movies" });
  }
});

// GET /api/movies/123
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await getMovieById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

module.exports = router;
