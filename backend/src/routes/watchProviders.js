const express = require("express");
const router = express.Router();
const { getTmdbData } = require("../services/tmdb");

// GET /api/watch-providers/:tmdb_id?type=movie
router.get("/:tmdb_id", async (req, res) => {
  try {
    const { tmdb_id } = req.params;
    const type = req.query.type || "movie";

    const data = await getTmdbData(`/${type}/${tmdb_id}/watch/providers`);

    // Return all results — client picks what to show
    const results = data.results || {};
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watch providers" });
  }
});

module.exports = router;
