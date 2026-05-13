import { useEffect, useState } from "react";
import { getBaseURL } from "../services/api";

const TROPHIES = [
  {
    id: "first_movie",
    icon: "🎬",
    title: "First Frame",
    desc: "Add your first movie to the library",
    tier: "bronze",
    check: (stats) => stats.totalMovies >= 1,
  },
  {
    id: "ten_movies",
    icon: "🍿",
    title: "Movie Night",
    desc: "Add 10 movies to your library",
    tier: "bronze",
    check: (stats) => stats.totalMovies >= 10,
  },
  {
    id: "fifty_movies",
    icon: "📽️",
    title: "Reel Collector",
    desc: "Add 50 movies to your library",
    tier: "silver",
    check: (stats) => stats.totalMovies >= 50,
  },
  {
    id: "hundred_movies",
    icon: "🎖️",
    title: "Century Club",
    desc: "Add 100 movies to your library",
    tier: "gold",
    check: (stats) => stats.totalMovies >= 100,
  },
  {
    id: "first_rating",
    icon: "⭐",
    title: "Critic's Eye",
    desc: "Rate your first movie",
    tier: "bronze",
    check: (stats) => stats.totalRatings >= 1,
  },
  {
    id: "ten_ratings",
    icon: "🌟",
    title: "The Reviewer",
    desc: "Rate 10 movies",
    tier: "silver",
    check: (stats) => stats.totalRatings >= 10,
  },
  {
    id: "first_review",
    icon: "✍️",
    title: "The Scribe",
    desc: "Write your first review",
    tier: "bronze",
    check: (stats) => stats.totalReviews >= 1,
  },
  {
    id: "first_show",
    icon: "📺",
    title: "Binge Starter",
    desc: "Add your first TV show",
    tier: "bronze",
    check: (stats) => stats.totalShows >= 1,
  },
  {
    id: "level5",
    icon: "🏆",
    title: "Film Critic",
    desc: "Reach Level 5",
    tier: "gold",
    check: (stats) => stats.level >= 5,
  },
  {
    id: "level6",
    icon: "🎭",
    title: "Legendary Auteur",
    desc: "Reach Level 6 — the pinnacle",
    tier: "platinum",
    check: (stats) => stats.level >= 6,
  },
  {
    id: "xp_500",
    icon: "⚡",
    title: "XP Grinder",
    desc: "Earn 500 total XP",
    tier: "silver",
    check: (stats) => stats.totalXP >= 500,
  },
  {
    id: "xp_1000",
    icon: "💎",
    title: "XP Legend",
    desc: "Earn 1000 total XP",
    tier: "gold",
    check: (stats) => stats.totalXP >= 1000,
  },
];

const TIER_ORDER = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
const TIER_COLORS = {
  bronze: "#cd7f32",
  silver: "#aaa9ad",
  gold: "#ffd700",
  platinum: "#e5e4e2",
};

function Trophies() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [xpRes, libraryRes] = await Promise.all([
          fetch(`${getBaseURL()}/xp`),
          fetch(`${getBaseURL()}/library`),
        ]);
        const xpData = await xpRes.json();
        const libraryData = await libraryRes.json();

        const movies = libraryData.filter((i) => i.media_type === "movie");
        const shows = libraryData.filter((i) => i.media_type === "tv");
        const ratings = libraryData.filter((i) => i.personal_rating !== null);
        const reviews = libraryData.filter(
          (i) => i.review_note && i.review_note.trim() !== "",
        );

        setStats({
          totalXP: xpData.totalXP,
          level: xpData.currentLevel.level,
          totalMovies: movies.length,
          totalShows: shows.length,
          totalRatings: ratings.length,
          totalReviews: reviews.length,
        });
      } catch (err) {
        console.error("Failed to load trophies data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading trophies...</div>;
  if (!stats) return <div className="loading">Failed to load trophies.</div>;

  const unlocked = TROPHIES.filter((t) => t.check(stats));
  const locked = TROPHIES.filter((t) => !t.check(stats));

  const sorted = (list) =>
    [...list].sort((a, b) => TIER_ORDER[b.tier] - TIER_ORDER[a.tier]);

  return (
    <div className="trophies-page">
      {/* Header */}
      <div className="trophies-header">
        <h1>🏆 Trophies</h1>
        <p className="trophies-subtitle">
          {unlocked.length} / {TROPHIES.length} unlocked
        </p>
        <div className="trophies-progress-bar">
          <div
            className="trophies-progress-fill"
            style={{
              width: `${Math.round((unlocked.length / TROPHIES.length) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <section className="trophies-section">
          <h2>✅ Unlocked</h2>
          <div className="trophies-grid">
            {sorted(unlocked).map((t) => (
              <div
                key={t.id}
                className="trophy-card unlocked"
                style={{ borderColor: TIER_COLORS[t.tier] }}
              >
                <div className="trophy-icon">{t.icon}</div>
                <div className="trophy-info">
                  <div
                    className="trophy-title"
                    style={{ color: TIER_COLORS[t.tier] }}
                  >
                    {t.title}
                  </div>
                  <div className="trophy-desc">{t.desc}</div>
                  <div
                    className="trophy-tier"
                    style={{ color: TIER_COLORS[t.tier] }}
                  >
                    {t.tier.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section className="trophies-section">
          <h2>🔒 Locked</h2>
          <div className="trophies-grid">
            {sorted(locked).map((t) => (
              <div key={t.id} className="trophy-card locked">
                <div className="trophy-icon locked-icon">🔒</div>
                <div className="trophy-info">
                  <div className="trophy-title locked-text">{t.title}</div>
                  <div className="trophy-desc">{t.desc}</div>
                  <div className="trophy-tier locked-text">
                    {t.tier.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Trophies;
