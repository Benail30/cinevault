const db = require("../db/database");

// Get all items in the library
const getAll = async () => {
  const result = await db.execute(
    "SELECT * FROM library ORDER BY date_added DESC",
  );
  return result.rows;
};

// Get a single item by its TMDB id
const getByTmdbId = async (tmdb_id) => {
  const result = await db.execute("SELECT * FROM library WHERE tmdb_id = ?", [
    tmdb_id,
  ]);
  return result.rows[0] || null;
};

// Add a new title to the library
const addToLibrary = async (item) => {
  await db.execute({
    sql: `
      INSERT INTO library (
        tmdb_id, media_type, title, poster_path, backdrop_path,
        overview, release_date, vote_average, genres, status
      ) VALUES (
        @tmdb_id, @media_type, @title, @poster_path, @backdrop_path,
        @overview, @release_date, @vote_average, @genres, @status
      )
    `,
    args: item,
  });
};

// Update status, rating, or review of an existing item
const updateItem = async (tmdb_id, updates) => {
  const fields = Object.keys(updates)
    .map((key) => `${key} = @${key}`)
    .join(", ");
  await db.execute({
    sql: `UPDATE library SET ${fields} WHERE tmdb_id = @tmdb_id`,
    args: { ...updates, tmdb_id },
  });
};

// Remove a title from the library
const removeFromLibrary = async (tmdb_id) => {
  await db.execute("DELETE FROM library WHERE tmdb_id = ?", [tmdb_id]);
};

// Get library items filtered by status
const getByStatus = async (status) => {
  const result = await db.execute(
    "SELECT * FROM library WHERE status = ? ORDER BY date_added DESC",
    [status],
  );
  return result.rows;
};

module.exports = {
  getAll,
  getByTmdbId,
  addToLibrary,
  updateItem,
  removeFromLibrary,
  getByStatus,
};
