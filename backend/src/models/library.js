const db = require("../db/database");

// Get all items in the library
const getAll = () => {
  return db.prepare("SELECT * FROM library ORDER BY date_added DESC").all();
};

// Get a single item by its TMDB id
const getByTmdbId = (tmdb_id) => {
  return db.prepare("SELECT * FROM library WHERE tmdb_id = ?").get(tmdb_id);
};

// Add a new title to the library
const addToLibrary = (item) => {
  const stmt = db.prepare(`
    INSERT INTO library (
      tmdb_id, media_type, title, poster_path, backdrop_path,
      overview, release_date, vote_average, genres, status
    ) VALUES (
      @tmdb_id, @media_type, @title, @poster_path, @backdrop_path,
      @overview, @release_date, @vote_average, @genres, @status
    )
  `);
  return stmt.run(item);
};

// Update status, rating, or review of an existing item
const updateItem = (tmdb_id, updates) => {
  const fields = Object.keys(updates)
    .map((key) => `${key} = @${key}`)
    .join(", ");
  const stmt = db.prepare(
    `UPDATE library SET ${fields} WHERE tmdb_id = @tmdb_id`,
  );
  return stmt.run({ ...updates, tmdb_id });
};

// Remove a title from the library
const removeFromLibrary = (tmdb_id) => {
  return db.prepare("DELETE FROM library WHERE tmdb_id = ?").run(tmdb_id);
};

// Get library items filtered by status
const getByStatus = (status) => {
  return db
    .prepare("SELECT * FROM library WHERE status = ? ORDER BY date_added DESC")
    .all(status);
};

module.exports = {
  getAll,
  getByTmdbId,
  addToLibrary,
  updateItem,
  removeFromLibrary,
  getByStatus,
};
