const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

// This is the axios instance we'll reuse for every TMDB call
const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Fetch trending movies (changes every week)
const getTrendingMovies = async () => {
  const response = await tmdb.get("/trending/movie/week");
  return response.data;
};

// Search movies by title
const searchMovies = async (query) => {
  const response = await tmdb.get("/search/movie", {
    params: { query },
  });
  return response.data;
};

// Get full detail of a single movie by its TMDB id
const getMovieById = async (id) => {
  const response = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,similar" },
  });
  return response.data;
};

module.exports = { getTrendingMovies, searchMovies, getMovieById };
