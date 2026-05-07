const express = require("express");
const router = express.Router();
const { getTotalXP, getLevelInfo, awardXP, getXPLog } = require("../models/xp");

// GET /api/xp — get current XP, level, and progress
router.get("/", (req, res) => {
  try {
    const totalXP = getTotalXP();
    const levelInfo = getLevelInfo(totalXP);
    res.json(levelInfo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch XP" });
  }
});

// GET /api/xp/log — get full XP history
router.get("/log", (req, res) => {
  try {
    const log = getXPLog();
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch XP log" });
  }
});

// POST /api/xp — award XP for an action
router.post("/", (req, res) => {
  try {
    const { action, tmdb_id } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action is required" });
    }

    const result = awardXP(action, tmdb_id || null);

    if (!result) {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to award XP" });
  }
});

module.exports = router;
