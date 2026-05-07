import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieById,
  addToLibrary,
  getLibraryItem,
  updateLibraryItem,
} from "../services/api";
import "../styles/MovieDetail.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [libraryItem, setLibraryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch movie data and check if it's in the library
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, libraryRes] = await Promise.allSettled([
          getMovieById(id),
          getLibraryItem(id),
        ]);

        if (movieRes.status === "fulfilled") setMovie(movieRes.value.data);
        if (libraryRes.status === "fulfilled")
          setLibraryItem(libraryRes.value.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Add movie to library with a given status
  const handleAddToLibrary = async (status) => {
    setActionLoading(true);
    try {
      await addToLibrary({
        tmdb_id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genres: movie.genres,
        status,
      });

      const updated = await getLibraryItem(movie.id);
      setLibraryItem(updated.data);
      setMessage(`✅ Added to ${status}!`);
    } catch (err) {
      setMessage("❌ Already in your library.");
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Update status of an existing library item
  const handleUpdateStatus = async (status) => {
    setActionLoading(true);
    try {
      await updateLibraryItem(movie.id, { status });
      const updated = await getLibraryItem(movie.id);
      setLibraryItem(updated.data);
      setMessage(`✅ Marked as ${status}!`);
    } catch (err) {
      setMessage("❌ Failed to update.");
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!movie) return <div className="detail-loading">Movie not found.</div>;

  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const year = movie.release_date?.split("-")[0];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="detail-page">
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-content">
        {/* Poster */}
        <div className="detail-poster">
          {posterUrl && <img src={posterUrl} alt={movie.title} />}
        </div>

        {/* Info */}
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-meta">
            <span className="meta-badge">{year}</span>
            <span className="meta-badge">{runtime}</span>
            <span className="meta-badge rating">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
          </div>

          {/* Genres */}
          <div className="detail-genres">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre-tag">
                {g.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="detail-overview">{movie.overview}</p>

          {/* Director */}
          {director && (
            <p className="detail-director">
              🎬 Directed by <strong>{director.name}</strong>
            </p>
          )}

          {/* Library Actions */}
          <div className="detail-actions">
            {message && <p className="action-message">{message}</p>}

            {!libraryItem ? (
              // Not in library yet
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToLibrary("watchlist")}
                  disabled={actionLoading}
                >
                  📌 Add to Watchlist
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleAddToLibrary("watched")}
                  disabled={actionLoading}
                >
                  ✅ Mark as Watched
                </button>
              </div>
            ) : (
              // Already in library — show current status + update options
              <div className="action-buttons">
                <p className="current-status">
                  Status: <strong>{libraryItem.status}</strong>
                </p>
                {libraryItem.status !== "watched" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdateStatus("watched")}
                    disabled={actionLoading}
                  >
                    ✅ Mark as Watched
                  </button>
                )}
                {libraryItem.status !== "watching" && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleUpdateStatus("watching")}
                    disabled={actionLoading}
                  >
                    ▶️ Currently Watching
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="detail-cast">
              <h3>Top Cast</h3>
              <div className="cast-list">
                {cast.map((actor) => (
                  <div key={actor.id} className="cast-item">
                    <div className="cast-avatar">
                      {actor.profile_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                          alt={actor.name}
                        />
                      ) : (
                        <div className="cast-avatar-placeholder">👤</div>
                      )}
                    </div>
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
