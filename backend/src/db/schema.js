const db = require("./database");

const createTables = () => {
  // Library table — every movie/show the user saves
  db.exec(`
    CREATE TABLE IF NOT EXISTS library (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      tmdb_id         INTEGER NOT NULL UNIQUE,
      media_type      TEXT NOT NULL,
      title           TEXT NOT NULL,
      poster_path     TEXT,
      backdrop_path   TEXT,
      overview        TEXT,
      release_date    TEXT,
      vote_average    REAL,
      genres          TEXT,
      status          TEXT DEFAULT 'watchlist',
      personal_rating REAL,
      review_note     TEXT,
      is_favorite     INTEGER DEFAULT 0,
      date_added      TEXT DEFAULT (datetime('now')),
      date_watched    TEXT
    );
  `);

  // XP log — every action that earned XP
  db.exec(`
    CREATE TABLE IF NOT EXISTS xp_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      action      TEXT NOT NULL,
      xp_earned   INTEGER NOT NULL,
      tmdb_id     INTEGER,
      created_at  TEXT DEFAULT (datetime('now'))
    );
  `);

  // Trophies the user has unlocked
  db.exec(`
    CREATE TABLE IF NOT EXISTS trophies (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      trophy_id   TEXT NOT NULL UNIQUE,
      unlocked_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Episode tracking for TV shows
  db.exec(`
    CREATE TABLE IF NOT EXISTS episode_progress (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      tmdb_id        INTEGER NOT NULL,
      season_number  INTEGER NOT NULL,
      episode_number INTEGER NOT NULL,
      watched_at     TEXT DEFAULT (datetime('now')),
      UNIQUE(tmdb_id, season_number, episode_number)
    );
  `);

  // Daily usage — for streak tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS usage_log (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      log_date TEXT NOT NULL UNIQUE
    );
  `);

  console.log("✅ All tables created");
};

createTables();

module.exports = { createTables };
