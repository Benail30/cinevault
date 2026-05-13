import { useEffect, useState } from "react";
import { getBaseURL } from "../services/api";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function BarRow({ label, count, max, color }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="bar-count">{count}</div>
    </div>
  );
}

export default function Stats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [libRes, xpRes] = await Promise.all([
          fetch(`${getBaseURL()}/library`),
          fetch(`${getBaseURL()}/xp`),
        ]);
        const library = await libRes.json();
        const xp = await xpRes.json();

        const movies = library.filter((i) => i.media_type === "movie");
        const shows = library.filter((i) => i.media_type === "tv");
        const watched = library.filter((i) => i.status === "watched");
        const watching = library.filter((i) => i.status === "watching");
        const watchlist = library.filter((i) => i.status === "watchlist");
        const favorites = library.filter((i) => i.is_favorite === 1);
        const rated = library.filter((i) => i.personal_rating !== null);
        const reviewed = library.filter(
          (i) => i.review_note && i.review_note.trim() !== "",
        );

        const avgRating =
          rated.length > 0
            ? (
                rated.reduce((sum, i) => sum + i.personal_rating, 0) /
                rated.length
              ).toFixed(1)
            : "—";

        // Genre breakdown
        const genreMap = {};
        library.forEach((item) => {
          try {
            const genres = JSON.parse(item.genres || "[]");
            genres.forEach((g) => {
              genreMap[g.name] = (genreMap[g.name] || 0) + 1;
            });
          } catch {}
        });
        const topGenres = Object.entries(genreMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        setData({
          total: library.length,
          movies: movies.length,
          shows: shows.length,
          watched: watched.length,
          watching: watching.length,
          watchlist: watchlist.length,
          favorites: favorites.length,
          rated: rated.length,
          reviewed: reviewed.length,
          avgRating,
          topGenres,
          xp,
        });
      } catch (err) {
        console.error("Stats fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="loading">Loading stats...</div>;
  if (!data) return <div className="loading">Failed to load stats.</div>;

  const { xp } = data;
  const level = xp.currentLevel;
  const nextLevel = xp.nextLevel;
  const maxGenre = data.topGenres[0]?.[1] || 1;

  const GENRE_COLORS = [
    "#4f98a3",
    "#ffd700",
    "#ff8c00",
    "#a86fdf",
    "#6daa45",
    "#dd6974",
  ];

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>📊 Stats</h1>
        <p className="stats-subtitle">Your cinephile journey at a glance</p>
      </div>

      {/* XP Level Banner */}
      <div className="xp-banner">
        <div className="xp-banner-left">
          <div className="xp-level-badge">{level.title}</div>
          <div className="xp-level-num">Level {level.level}</div>
        </div>
        <div className="xp-banner-right">
          <div className="xp-bar-row">
            <span>{xp.totalXP} XP</span>
            {nextLevel && <span>{nextLevel.xp} XP</span>}
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${xp.progress}%` }} />
          </div>
          {nextLevel ? (
            <div className="xp-next">Next: {nextLevel.title}</div>
          ) : (
            <div className="xp-next">🏆 Max level reached!</div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <StatCard
          icon="🎬"
          label="Total Titles"
          value={data.total}
          color="#4f98a3"
        />
        <StatCard
          icon="📽️"
          label="Movies"
          value={data.movies}
          color="#ffd700"
        />
        <StatCard
          icon="📺"
          label="TV Shows"
          value={data.shows}
          color="#a86fdf"
        />
        <StatCard
          icon="✅"
          label="Watched"
          value={data.watched}
          color="#6daa45"
        />
        <StatCard
          icon="▶️"
          label="Watching"
          value={data.watching}
          color="#ff8c00"
        />
        <StatCard
          icon="🔖"
          label="Watchlist"
          value={data.watchlist}
          color="#4f98a3"
        />
        <StatCard
          icon="❤️"
          label="Favorites"
          value={data.favorites}
          color="#dd6974"
        />
        <StatCard
          icon="⭐"
          label="Avg Rating"
          value={data.avgRating}
          sub={`${data.rated} rated`}
          color="#ffd700"
        />
        <StatCard
          icon="✍️"
          label="Reviews"
          value={data.reviewed}
          color="#4f98a3"
        />
      </div>

      {/* Genre Breakdown */}
      {data.topGenres.length > 0 && (
        <div className="stats-section">
          <h2>🎭 Top Genres</h2>
          <div className="genre-bars">
            {data.topGenres.map(([genre, count], i) => (
              <BarRow
                key={genre}
                label={genre}
                count={count}
                max={maxGenre}
                color={GENRE_COLORS[i % GENRE_COLORS.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Status Breakdown */}
      <div className="stats-section">
        <h2>📋 Library Breakdown</h2>
        <div className="breakdown-bars">
          <BarRow
            label="Watched"
            count={data.watched}
            max={data.total}
            color="#6daa45"
          />
          <BarRow
            label="Watching"
            count={data.watching}
            max={data.total}
            color="#ff8c00"
          />
          <BarRow
            label="Watchlist"
            count={data.watchlist}
            max={data.total}
            color="#4f98a3"
          />
        </div>
      </div>
    </div>
  );
}
