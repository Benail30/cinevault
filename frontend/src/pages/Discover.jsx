import { useState, useEffect } from "react";
import { getTrendingMovies, searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import "../styles/MovieCard.css";
import "../styles/Discover.css";

function Discover() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("trending"); // "trending" or "search"

  // Load trending on first render
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await getTrendingMovies();
        setMovies(res.data.results);
      } catch {
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError(null);
    setMode("search");

    try {
      const res = await searchMovies(query.trim());
      setMovies(res.data.results);
      if (res.data.results.length === 0) {
        setError(`No results found for "${query}"`);
      }
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Clear search and go back to trending
  const handleClear = async () => {
    setQuery("");
    setMode("trending");
    setError(null);
    setLoading(true);
    try {
      const res = await getTrendingMovies();
      setMovies(res.data.results);
    } catch {
      setError("Failed to load trending movies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discover">
      {/* Search Bar */}
      <div className="search-section">
        <h1 className="discover-title">🔍 Discover</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={searching}
          >
            {searching ? "Searching..." : "Search"}
          </button>
          {mode === "search" && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              ✕ Clear
            </button>
          )}
        </form>
      </div>

      {/* Results Title */}
      <h2 className="results-title">
        {mode === "trending"
          ? "🔥 Trending This Week"
          : `Results for "${query}"`}
      </h2>

      {/* States */}
      {(loading || searching) && (
        <p className="status-text">
          {searching ? "Searching..." : "Loading..."}
        </p>
      )}
      {error && <p className="status-text error">{error}</p>}

      {/* Movies Grid */}
      {!loading && !searching && !error && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Discover;
