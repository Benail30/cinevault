const { createClient } = require("@libsql/client");

// Defer database connection until credentials are available
let db = null;

const initializeDb = () => {
  if (db) return db;

  if (!process.env.TURSO_DB_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.warn(
      "⚠️  Warning: TURSO_DB_URL or TURSO_AUTH_TOKEN not set. Database will not connect properly.",
    );
    console.warn(
      "Make sure to add these environment variables to your Vercel project settings.",
    );
    throw new Error("Database credentials not configured");
  }

  db = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log(
    "✅ Turso database client initialized:",
    process.env.TURSO_DB_URL ? "URL configured" : "URL not configured",
  );

  return db;
};

// Initialize on first use
try {
  module.exports = initializeDb();
} catch (error) {
  console.error("Database initialization error:", error.message);
  // Create a stub that will throw errors when methods are called
  module.exports = {
    execute: async () => {
      throw new Error(
        "Database not initialized. Make sure TURSO_DB_URL and TURSO_AUTH_TOKEN are set.",
      );
    },
  };
}
