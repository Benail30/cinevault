const express = require("express");
const router = express.Router();
const { getAllTrophies, checkTrophies } = require("../models/trophies");

// GET /api/trophies — all trophies with locked/unlocked status
router.get("/", (req, res) => {
  try {
    const trophies = getAllTrophies();
    const unlocked = trophies.filter((t) => t.unlocked).length;
    const total = trophies.length;

    res.json({ unlocked, total, trophies });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trophies" });
  }
});

// POST /api/trophies/check — run trophy check after any library update
router.post("/check", (req, res) => {
  try {
    const newlyUnlocked = checkTrophies();
    res.json({
      newlyUnlocked,
      count: newlyUnlocked.length,
      message:
        newlyUnlocked.length > 0
          ? `🏆 You unlocked ${newlyUnlocked.length} new trophy!`
          : "No new trophies yet — keep watching!",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check trophies" });
  }
});

module.exports = router;
