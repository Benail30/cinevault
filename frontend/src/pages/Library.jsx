import { useState, useEffect } from "react";
import { getLibrary, removeFromLibrary } from "../services/api";
import MovieCard from "../components/MovieCard";
import "../styles/MovieCard.css";
import "../styles/Library.css";

const STATUSES = ["all", "watchlist", "watching", "watched"];

function Library() {
  const [library, setLibrary] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await getLibrary();
      setLibrary(res.data);
    } catch {
      setError("Failed to load library.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (tmdb_id, title) => {
    if (!window.confirm(`Remove "${title}" from your library?`)) return;
    try {
      await removeFromLibrary(tmdb_id);
      setLibrary((prev) => prev.filter((item) => item.tmdb_id !== tmdb_id));
    } catch {
      alert("Failed to remove item.");
    }
  };

  // Filter by active tab
  const filtered =
    activeTab === "all"
      ? library
      : library.filter((item) => item.status === activeTab);

  // Stats
  const watched = library.filter((i) => i.status === "watched").length;
  const watchlist = library.filter((i) => i.status === "watchlist").length;
  const watching = library.filter((i) => i.status === "watching").length;

  return (
    <div className="library">
      <h1 className="library-title">📚 My Library</h1>

      {/* Stats Bar */}
      <div className="library-stats">
        <div className="stat-item">
          <span className="stat-number">{library.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{watched}</span>
          <span className="stat-label">Watched</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{watching}</span>
          <span className="stat-label">Watching</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{watchlist}</span>
          <span className="stat-label">Watchlist</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="library-tabs">
        {STATUSES.map((status) => (
          <button
            key={status}
            className={`tab-btn ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <p className="status-text">Loading library...</p>}
      {error && <p className="status-text error">{error}</p>}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-icon">🎬</p>
          <p className="empty-title">Nothing here yet</p>
          <p className="empty-subtitle">
            {activeTab === "all"
              ? "Go to Discover and start adding movies to your library!"
              : `No movies with status "${activeTab}" yet.`}
          </p>
        </div>
      )}

      {/* Library Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="movies-grid">
          {filtered.map((item) => (
            <div key={item.tmdb_id} className="library-card-wrapper">
              <MovieCard
                movie={{
                  id: item.tmdb_id,
                  title: item.title,
                  poster_path: item.poster_path,
                  release_date: item.release_date,
                  vote_average: item.vote_average,
                }}
              />
              <div className="library-card-meta">
                <span className={`status-badge status-${item.status}`}>
                  {item.status}
                </span>
                {item.personal_rating && (
                  <span className="personal-rating">
                    ⭐ {item.personal_rating}
                  </span>
                )}
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.tmdb_id, item.title)}
                  title="Remove from library"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
