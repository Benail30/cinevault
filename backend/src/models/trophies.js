const db = require("../db/database");

// Master list of ALL trophies in the game
const ALL_TROPHIES = [
  // --- Watching Milestones ---
  {
    id: "first_watch",
    title: "First Watch",
    description: "Watch your first title",
    icon: "🎬",
    category: "milestone",
  },
  {
    id: "watched_10",
    title: "10 Films",
    description: "Watch 10 movies",
    icon: "🎬",
    category: "milestone",
  },
  {
    id: "watched_50",
    title: "50 Films",
    description: "Watch 50 movies",
    icon: "🎬",
    category: "milestone",
  },
  {
    id: "watched_100",
    title: "100 Films",
    description: "Watch 100 movies",
    icon: "🎬",
    category: "milestone",
  },
  {
    id: "first_episode",
    title: "First Episode",
    description: "Watch your first TV episode",
    icon: "📺",
    category: "milestone",
  },
  {
    id: "binge_master",
    title: "Binge Master",
    description: "Complete 5 full TV seasons",
    icon: "📺",
    category: "milestone",
  },
  {
    id: "series_finisher",
    title: "Series Finisher",
    description: "Complete 3 full TV shows",
    icon: "📺",
    category: "milestone",
  },

  // --- Quality Trophies ---
  {
    id: "top_rated_first",
    title: "Top 250",
    description: "Watch a top rated title (≥8.0)",
    icon: "⭐",
    category: "quality",
  },
  {
    id: "top_10",
    title: "Top 10",
    description: "Watch a title rated 9.0 or above",
    icon: "🏅",
    category: "quality",
  },
  {
    id: "top_250_club",
    title: "Top 250 Club",
    description: "Watch 25 top rated titles",
    icon: "🎖️",
    category: "quality",
  },
  {
    id: "legend",
    title: "Legend",
    description: "Watch 50 top rated titles",
    icon: "🏆",
    category: "quality",
  },

  // --- Genre Trophies ---
  {
    id: "scifi_explorer",
    title: "Sci-Fi Explorer",
    description: "Watch 10 Sci-Fi titles",
    icon: "👾",
    category: "genre",
  },
  {
    id: "horror_survivor",
    title: "Horror Survivor",
    description: "Watch 10 Horror titles",
    icon: "😱",
    category: "genre",
  },
  {
    id: "comedy_lover",
    title: "Comedy Lover",
    description: "Watch 10 Comedy titles",
    icon: "😂",
    category: "genre",
  },
  {
    id: "drama_fan",
    title: "Drama Aficionado",
    description: "Watch 20 Drama titles",
    icon: "🎭",
    category: "genre",
  },
  {
    id: "anime_enthusiast",
    title: "Anime Enthusiast",
    description: "Watch 10 Anime titles",
    icon: "🎌",
    category: "genre",
  },
  {
    id: "classic_buff",
    title: "Classic Buff",
    description: "Watch 10 movies before 1980",
    icon: "📽️",
    category: "genre",
  },
  {
    id: "world_cinema",
    title: "World Cinema",
    description: "Watch 10 non-English titles",
    icon: "🌍",
    category: "genre",
  },

  // --- Rating Trophies ---
  {
    id: "first_review",
    title: "First Review",
    description: "Write your first review note",
    icon: "✍️",
    category: "rating",
  },
  {
    id: "top_rater",
    title: "Top Rater",
    description: "Rate 25 titles",
    icon: "🌟",
    category: "rating",
  },
  {
    id: "critic",
    title: "Critic",
    description: "Rate 100 titles",
    icon: "🎯",
    category: "rating",
  },

  // --- Special Trophies ---
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Add a watched title after midnight",
    icon: "🌙",
    category: "special",
  },
  {
    id: "weekly_streak",
    title: "Weekly Streak",
    description: "Use the app 7 days in a row",
    icon: "🗓️",
    category: "special",
  },
  {
    id: "monthly_streak",
    title: "Monthly Streak",
    description: "Use the app 30 days in a row",
    icon: "🔥",
    category: "special",
  },
];

// Get all trophies with locked/unlocked status
const getAllTrophies = () => {
  const unlocked = db
    .prepare("SELECT trophy_id, unlocked_at FROM trophies")
    .all();
  const unlockedMap = {};
  unlocked.forEach((t) => (unlockedMap[t.trophy_id] = t.unlocked_at));

  return ALL_TROPHIES.map((trophy) => ({
    ...trophy,
    unlocked: !!unlockedMap[trophy.id],
    unlocked_at: unlockedMap[trophy.id] || null,
  }));
};

// Unlock a trophy (if not already unlocked)
const unlockTrophy = (trophy_id) => {
  const exists = db
    .prepare("SELECT id FROM trophies WHERE trophy_id = ?")
    .get(trophy_id);
  if (exists) return null; // already unlocked

  db.prepare("INSERT INTO trophies (trophy_id) VALUES (?)").run(trophy_id);
  const trophy = ALL_TROPHIES.find((t) => t.id === trophy_id);
  return trophy || null;
};

// Check and unlock trophies based on current library state
const checkTrophies = () => {
  const newlyUnlocked = [];

  // Count watched movies
  const watchedMovies = db
    .prepare(
      "SELECT COUNT(*) as count FROM library WHERE status = 'watched' AND media_type = 'movie'",
    )
    .get().count;

  // Count rated titles
  const ratedCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM library WHERE personal_rating IS NOT NULL",
    )
    .get().count;

  // Count reviewed titles
  const reviewedCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM library WHERE review_note IS NOT NULL",
    )
    .get().count;

  // Count top rated watched (vote_average >= 8.0)
  const topRatedWatched = db
    .prepare(
      "SELECT COUNT(*) as count FROM library WHERE status = 'watched' AND vote_average >= 8.0",
    )
    .get().count;

  // Milestone trophies
  if (watchedMovies >= 1) newlyUnlocked.push(unlockTrophy("first_watch"));
  if (watchedMovies >= 10) newlyUnlocked.push(unlockTrophy("watched_10"));
  if (watchedMovies >= 50) newlyUnlocked.push(unlockTrophy("watched_50"));
  if (watchedMovies >= 100) newlyUnlocked.push(unlockTrophy("watched_100"));

  // Quality trophies
  if (topRatedWatched >= 1) newlyUnlocked.push(unlockTrophy("top_rated_first"));
  if (topRatedWatched >= 25) newlyUnlocked.push(unlockTrophy("top_250_club"));
  if (topRatedWatched >= 50) newlyUnlocked.push(unlockTrophy("legend"));

  // Rating trophies
  if (reviewedCount >= 1) newlyUnlocked.push(unlockTrophy("first_review"));
  if (ratedCount >= 25) newlyUnlocked.push(unlockTrophy("top_rater"));
  if (ratedCount >= 100) newlyUnlocked.push(unlockTrophy("critic"));

  // Night owl — check if current hour is between midnight and 5am
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) newlyUnlocked.push(unlockTrophy("night_owl"));

  // Filter out nulls (already unlocked or not triggered)
  return newlyUnlocked.filter(Boolean);
};

module.exports = { getAllTrophies, unlockTrophy, checkTrophies, ALL_TROPHIES };
