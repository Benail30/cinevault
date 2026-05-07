import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "https://via.placeholder.com/500x750?text=No+Poster";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : FALLBACK_IMAGE;

  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="movie-card-poster">
        <img src={posterUrl} alt={movie.title} loading="lazy" />
        <div className="movie-card-rating">⭐ {rating}</div>
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <span className="movie-card-year">{year}</span>
      </div>
    </div>
  );
}

export default MovieCard;
