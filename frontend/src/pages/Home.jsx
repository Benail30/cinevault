import { useState, useEffect } from "react";
import { getTrendingMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import "../styles/MovieCard.css";
import "../styles/Home.css";

function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await getTrendingMovies();
        setTrending(response.data.results);
      } catch (err) {
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">
          Your Personal
          <br />
          Cinema Universe
        </h1>
        <p className="hero-subtitle">
          Track every film, earn trophies, discover what to watch next.
        </p>
      </div>

      {/* Trending Section */}
      <section className="section">
        <h2 className="section-title">🔥 Trending This Week</h2>

        {loading && <p className="status-text">Loading movies...</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && (
          <div className="movies-row">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
