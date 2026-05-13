import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Trophies from "./pages/Trophies";
import Stats from "./pages/Stats";
import MovieDetail from "./pages/MovieDetail";
import { getBaseURL } from "./services/api";
import "./index.css";

function NavXP() {
  const [xp, setXp] = useState(null);

  useEffect(() => {
    fetch(`${getBaseURL()}/xp`)
      .then((r) => r.json())
      .then(setXp)
      .catch(() => {});
  }, []);

  if (!xp) return null;

  return (
    <div className="navbar-xp">
      <div className="navbar-xp-title">
        {xp.currentLevel.title} · Lv.{xp.currentLevel.level}
      </div>
      <div className="navbar-xp-bar-track">
        <div
          className="navbar-xp-bar-fill"
          style={{ width: `${xp.progress}%` }}
        />
      </div>
      <div className="navbar-xp-points">{xp.totalXP} XP</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">🎬 Cinephiles Inc.</div>
          <div className="navbar-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/discover">Discover</NavLink>
            <NavLink to="/library">Library</NavLink>
            <NavLink to="/trophies">Trophies</NavLink>
            <NavLink to="/stats">Stats</NavLink>
          </div>
          <NavXP />
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/library" element={<Library />} />
            <Route path="/trophies" element={<Trophies />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
