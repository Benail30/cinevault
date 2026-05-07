const express = require("express");
const router = express.Router();
const {
  getAll,
  getByTmdbId,
  addToLibrary,
  updateItem,
  removeFromLibrary,
  getByStatus,
} = require("../models/library");

// GET /api/library — get everything in the library
router.get("/", (req, res) => {
  try {
    const { status } = req.query;
    const items = status ? getByStatus(status) : getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch library" });
  }
});

// GET /api/library/:tmdb_id — check if a title is in the library
router.get("/:tmdb_id", (req, res) => {
  try {
    const item = getByTmdbId(parseInt(req.params.tmdb_id));
    if (!item) return res.status(404).json({ error: "Not found in library" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// POST /api/library — add a title to the library
router.post("/", (req, res) => {
  try {
    const {
      tmdb_id,
      media_type,
      title,
      poster_path,
      backdrop_path,
      overview,
      release_date,
      vote_average,
      genres,
      status,
    } = req.body;

    // Check if already exists
    const existing = getByTmdbId(tmdb_id);
    if (existing) {
      return res.status(409).json({ error: "Title already in library" });
    }

    addToLibrary({
      tmdb_id,
      media_type,
      title,
      poster_path: poster_path || null,
      backdrop_path: backdrop_path || null,
      overview: overview || null,
      release_date: release_date || null,
      vote_average: vote_average || null,
      genres: genres ? JSON.stringify(genres) : null,
      status: status || "watchlist",
    });

    const newItem = getByTmdbId(tmdb_id);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to library" });
  }
});

// PUT /api/library/:tmdb_id — update status, rating, review
router.put("/:tmdb_id", (req, res) => {
  try {
    const tmdb_id = parseInt(req.params.tmdb_id);
    const existing = getByTmdbId(tmdb_id);
    if (!existing)
      return res.status(404).json({ error: "Not found in library" });

    const allowed = [
      "status",
      "personal_rating",
      "review_note",
      "is_favorite",
      "date_watched",
    ];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // If status is being set to watched, record the date
    if (updates.status === "watched" && !updates.date_watched) {
      updates.date_watched = new Date().toISOString();
    }

    updateItem(tmdb_id, updates);
    const updatedItem = getByTmdbId(tmdb_id);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE /api/library/:tmdb_id — remove from library
router.delete("/:tmdb_id", (req, res) => {
  try {
    const tmdb_id = parseInt(req.params.tmdb_id);
    const existing = getByTmdbId(tmdb_id);
    if (!existing)
      return res.status(404).json({ error: "Not found in library" });

    removeFromLibrary(tmdb_id);
    res.json({ message: `"${existing.title}" removed from library` });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item" });
  }
});

module.exports = router;
