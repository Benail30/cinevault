const Database = require("better-sqlite3");
const path = require("path");

// This creates the .db file in the backend folder if it doesn't exist yet
const dbPath = path.join(__dirname, "../../cinevault.db");
const db = new Database(dbPath);

// Enable WAL mode — makes SQLite faster for reads and writes
db.pragma("journal_mode = WAL");

console.log("✅ Database connected:", dbPath);

module.exports = db;
