const db = require("../db/database");

// XP required to reach each level
const LEVELS = [
  { level: 1, xp: 0, title: "🎞️ Casual Viewer" },
  { level: 2, xp: 100, title: "🍿 Movie Fan" },
  { level: 3, xp: 300, title: "🎬 Film Buff" },
  { level: 4, xp: 600, title: "🎭 Cinephile" },
  { level: 5, xp: 1000, title: "🏆 Film Critic" },
  { level: 6, xp: 2000, title: "🎖️ Legendary Auteur" },
];

// XP earned for each action
const XP_REWARDS = {
  watched_movie: 10,
  watched_episode: 3,
  completed_season: 25,
  completed_show: 50,
  added_rating: 5,
  added_review: 5,
  top_rated_bonus: 20, // TMDB score >= 8.0
  classic_bonus: 15, // released before 1980
};

// Get total XP by summing the xp_log table
const getTotalXP = () => {
  const row = db.prepare("SELECT SUM(xp_earned) as total FROM xp_log").get();
  return row.total || 0;
};

// Calculate level from total XP
const getLevelInfo = (totalXP) => {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
      break;
    }
  }

  const xpIntoLevel = nextLevel ? totalXP - currentLevel.xp : 0;
  const xpNeeded = nextLevel ? nextLevel.xp - currentLevel.xp : 0;
  const progress = nextLevel ? Math.round((xpIntoLevel / xpNeeded) * 100) : 100;

  return { currentLevel, nextLevel, totalXP, xpIntoLevel, xpNeeded, progress };
};

// Award XP for an action
const awardXP = (action, tmdb_id = null) => {
  const xp_earned = XP_REWARDS[action];
  if (!xp_earned) return null;

  db.prepare(
    `
    INSERT INTO xp_log (action, xp_earned, tmdb_id)
    VALUES (?, ?, ?)
  `,
  ).run(action, xp_earned, tmdb_id);

  const totalXP = getTotalXP();
  return { action, xp_earned, totalXP, levelInfo: getLevelInfo(totalXP) };
};

// Get full XP log history
const getXPLog = () => {
  return db.prepare("SELECT * FROM xp_log ORDER BY created_at DESC").all();
};

module.exports = {
  getTotalXP,
  getLevelInfo,
  awardXP,
  getXPLog,
  XP_REWARDS,
  LEVELS,
};
