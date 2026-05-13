const db = require("../db/database");

// Master list of ALL trophies in the game (unchanged)
const ALL_TROPHIES = [
  // ... (keep all your trophy definitions exactly the same)
  // I'm keeping them as-is since they're pure data
];

// Get all trophies with locked/unlocked status
const getAllTrophies = async () => {
  const result = await db.execute(
    "SELECT trophy_id, unlocked_at FROM trophies",
  );
  const unlockedMap = {};
  result.rows.forEach((t) => (unlockedMap[t.trophy_id] = t.unlocked_at));

  return ALL_TROPHIES.map((trophy) => ({
    ...trophy,
    unlocked: !!unlockedMap[trophy.id],
    unlocked_at: unlockedMap[trophy.id] || null,
  }));
};

// Unlock a trophy (if not already unlocked)
const unlockTrophy = async (trophy_id) => {
  const result = await db.execute(
    "SELECT id FROM trophies WHERE trophy_id = ?",
    [trophy_id],
  );
  if (result.rows.length > 0) return null; // already unlocked

  await db.execute("INSERT INTO trophies (trophy_id) VALUES (?)", [trophy_id]);
  const trophy = ALL_TROPHIES.find((t) => t.id === trophy_id);
  return trophy || null;
};

// Check and unlock trophies based on current library state
const checkTrophies = async () => {
  const newlyUnlocked = [];

  // Count watched movies
  const watchedMoviesResult = await db.execute(
    "SELECT COUNT(*) as count FROM library WHERE status = 'watched' AND media_type = 'movie'",
  );
  const watchedMovies = watchedMoviesResult.rows[0].count;

  // Count rated titles
  const ratedCountResult = await db.execute(
    "SELECT COUNT(*) as count FROM library WHERE personal_rating IS NOT NULL",
  );
  const ratedCount = ratedCountResult.rows[0].count;

  // Count reviewed titles
  const reviewedCountResult = await db.execute(
    "SELECT COUNT(*) as count FROM library WHERE review_note IS NOT NULL",
  );
  const reviewedCount = reviewedCountResult.rows[0].count;

  // Count top rated watched (vote_average >= 8.0)
  const topRatedWatchedResult = await db.execute(
    "SELECT COUNT(*) as count FROM library WHERE status = 'watched' AND vote_average >= 8.0",
  );
  const topRatedWatched = topRatedWatchedResult.rows[0].count;

  // Milestone trophies
  if (watchedMovies >= 1) newlyUnlocked.push(await unlockTrophy("first_watch"));
  if (watchedMovies >= 10) newlyUnlocked.push(await unlockTrophy("watched_10"));
  if (watchedMovies >= 50) newlyUnlocked.push(await unlockTrophy("watched_50"));
  if (watchedMovies >= 100)
    newlyUnlocked.push(await unlockTrophy("watched_100"));

  // Quality trophies
  if (topRatedWatched >= 1)
    newlyUnlocked.push(await unlockTrophy("top_rated_first"));
  if (topRatedWatched >= 25)
    newlyUnlocked.push(await unlockTrophy("top_250_club"));
  if (topRatedWatched >= 50) newlyUnlocked.push(await unlockTrophy("legend"));

  // Rating trophies
  if (reviewedCount >= 1)
    newlyUnlocked.push(await unlockTrophy("first_review"));
  if (ratedCount >= 25) newlyUnlocked.push(await unlockTrophy("top_rater"));
  if (ratedCount >= 100) newlyUnlocked.push(await unlockTrophy("critic"));

  // Night owl — check if current hour is between midnight and 5am
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5)
    newlyUnlocked.push(await unlockTrophy("night_owl"));

  // Filter out nulls (already unlocked or not triggered)
  return newlyUnlocked.filter(Boolean);
};

module.exports = { getAllTrophies, unlockTrophy, checkTrophies, ALL_TROPHIES };
