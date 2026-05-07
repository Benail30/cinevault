import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Trophies from "./pages/Trophies";
import Stats from "./pages/Stats";
import MovieDetail from "./pages/MovieDetail";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="navbar-brand">🎬 Cinephiles Inc.</div>
          <div className="navbar-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/discover">Discover</NavLink>
            <NavLink to="/library">Library</NavLink>
            <NavLink to="/trophies">Trophies</NavLink>
            <NavLink to="/stats">Stats</NavLink>
          </div>
        </nav>

        {/* Page Content */}
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
