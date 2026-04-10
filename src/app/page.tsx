import { getMovies } from "@/lib/data.server";
import { Movie } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function HomePage() {
  const allMovies = getMovies();
  
  if (allMovies.length === 0) return null;

  const spotlightMovie = allMovies[1]; // Avengers: Doomsday

  return (
    <div className="home-viewport">
      {/* Cinematic Hero Spotlight */}
      <section className="hero-carousel">
        <div className="hero-slide">
          <div className="hero-backdrop">
            <img 
              src={spotlightMovie.backdrop_path} 
              alt={spotlightMovie.title}
              loading="eager"
            />
          </div>
          <div className="hero-content">
            <div className="hero-label">🔥 Must Watch for 2026</div>
            <h1 className="hero-title">{spotlightMovie.title}</h1>
            <div className="hero-meta">
              <span style={{ color: 'var(--accent)' }}>★ {spotlightMovie.vote_average} Registry Score</span>
              <span>UHD 4K</span>
              <span>Sci-Fi / Action</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href={`/movie/${spotlightMovie.id}`} className="btn btn-primary">
                <span>▶ Watch Official Trailer</span>
              </Link>
              <button className="btn btn-glass">
                <span>📁 View Technical Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Database Grid */}
      <section className="section-wrapper">
        <div className="row-header">
          <div style={{ flex: 1 }}>
            <h2 className="row-title">Registry Database: <span style={{ color: 'var(--accent)' }}>2026 Phase</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Latest cinematic entries encrypted in our archive.</p>
          </div>
          <button className="btn btn-glass btn-sm" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Filter Archive
          </button>
        </div>

        <div className="movie-grid">
          {allMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Global Ad Slot */}
        <div style={{ marginTop: '60px' }}>
          <AdBanner slot="home-bottom-native" format="fluid" />
        </div>
      </section>
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const year = movie.release_date.split('-')[0];

  return (
    <Link href={`/movie/${movie.id}`} className="movie-card shadow-sm">
      <div className="card-poster">
        <img 
          src={movie.poster_path} 
          alt={movie.title} 
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="card-title">{movie.title}</div>
          <div className="card-badges">
             <span className="badge badge-hd">HDR</span>
             <span className="badge">{year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
