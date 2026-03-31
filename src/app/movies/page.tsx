import { getMovies, Movie } from "@/lib/data";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function MoviesPage() {
  const movies2026 = getMovies();
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1 className="title-large" style={{ marginBottom: '2rem' }}>Complete 2026 Movie List</h1>
      <p style={{ color: '#888', marginBottom: '3rem' }}>Explore every major trailer and movie release scheduled for 2026. Stay ahead of the trends.</p>
      
      <AdBanner slot="movies-list-top" format="auto" />

      <div className="grid">
        {movies2026.map((movie: Movie) => (
          <div key={movie.id} className="movie-card">
            <Link href={`/movie/${movie.id}`}>
              <div className="poster-wrapper">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                />
                <div className="hover-overlay">
                   <div className="card-actions">
                    <span className="rating-tag">★ {movie.vote_average}</span>
                    <button className="play-mini-btn">▶</button>
                  </div>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                  <span>{movie.release_date}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <AdBanner slot="movies-list-bottom" format="auto" />

      <style dangerouslySetInnerHTML={{ __html: `
        .play-mini-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
        }
        .rating-tag {
          background: rgba(0,0,0,0.85);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 700;
          color: #ffcc00;
          font-size: 0.85rem;
        }
        .card-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
      ` }} />
    </div>
  );
}
