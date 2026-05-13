import axios from "axios";

// Dynamic API URL based on environment
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // Development: use local backend (no /api prefix locally)
    return "http://localhost:5000";
  }
  // Production: use Vercel backend
  return "https://cinephiles-inc-api.vercel.app/api";
};

// All backend calls go through this base URL
const api = axios.create({
  baseURL: getBaseURL(),
});

// --- Movies ---
export const getTrendingMovies = () => api.get("/movies/trending");
export const searchMovies = (query) => api.get(`/movies/search?q=${query}`);
export const getMovieById = (id) => api.get(`/movies/${id}`);

// --- Library ---
export const getLibrary = () => api.get("/library");
export const getLibraryItem = (tmdb_id) => api.get(`/library/${tmdb_id}`);
export const addToLibrary = (item) => api.post("/library", item);
export const updateLibraryItem = (tmdb_id, updates) =>
  api.put(`/library/${tmdb_id}`, updates);
export const removeFromLibrary = (tmdb_id) => api.delete(`/library/${tmdb_id}`);

// --- XP ---
export const getXP = () => api.get("/xp");
export const awardXP = (action, tmdb_id) =>
  api.post("/xp", { action, tmdb_id });

// --- Trophies ---
export const getTrophies = () => api.get("/trophies");
export const checkTrophies = () => api.post("/trophies/check");

// --- Watch Providers ---
export const getWatchProviders = (tmdb_id, type = "movie") =>
  api.get(`/watch-providers/${tmdb_id}?type=${type}`);
