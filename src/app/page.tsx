import { getMovies, Movie } from "@/lib/data";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function HomePage() {
  const allMovies = getMovies();
  
  // Categorize movies
  const featuredMovie = allMovies.find(m => m.id === 2) || allMovies[0]; // Avengers as default hero
  const primeOriginals = allMovies.filter(m => [10, 11, 12, 13, 16, 17].includes(m.id));
  const trendingMovies = allMovies.filter(m => [1, 4, 14, 15, 21].includes(m.id));
  const animationMovies = allMovies.filter((m: Movie) => m.genre_ids.includes(16));
  const latestReviews = [...allMovies].reverse().slice(0, 4);

  if (!featuredMovie) {
    return (
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h1>No movies available. Add some in the Dashbaord!</h1>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Dynamic Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop">
          <img 
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} 
            alt={featuredMovie.title}
            className="hero-img"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content animate-fade-in">
            <span className="badge badge-trending">Trending Now</span>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-overview">{featuredMovie.overview}</p>
            <div className="hero-actions">
              <Link href={`/movie/${featuredMovie.id}`} className="btn btn-primary">
                ▶ Watch Official Trailer
              </Link>
              <Link href={`/movie/${featuredMovie.id}`} className="btn btn-glass">
                Read Full Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container main-content">
        {/* Top Ad Slot */}
        <AdBanner slot="home-top" format="auto" />

        {/* Prime Originals Section */}
        <section className="section-padding">
          <div className="section-header">
            <div>
              <h2 className="text-gradient">Prime Video Originals</h2>
              <p className="text-secondary">Exclusive trailers from Amazon MGM Studios</p>
            </div>
            <Link href="/movies" className="btn btn-outline btn-sm">Explore All</Link>
          </div>
          <div className="movie-grid">
            {primeOriginals.map((movie) => (
              <MovieCard key={movie.id} movie={movie} badge="prime" />
            ))}
          </div>
        </section>

        {/* Middle Ad Slot */}
        <AdBanner slot="home-mid" format="fluid" />

        {/* Trending Section */}
        <section className="section-padding">
          <div className="section-header">
            <div>
              <h2 className="text-gradient">Highly Anticipated</h2>
              <p className="text-secondary">Trailers everyone is talking about</p>
            </div>
          </div>
          <div className="movie-grid">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} badge="trending" />
            ))}
          </div>
        </section>

        {/* Animation Favorites */}
        <section className="section-padding">
          <div className="section-header">
            <div>
              <h2 className="text-gradient">Latest Animation</h2>
              <p className="text-secondary">Fun for the whole family</p>
            </div>
          </div>
          <div className="movie-grid">
            {animationMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Footer Ad Slot */}
        <AdBanner slot="home-footer" format="auto" />
      </div>

      <style jsx>{`
        .home-wrapper {
          overflow: hidden;
        }
        .hero-section {
          position: relative;
          height: 80vh;
          display: flex;
          align-items: center;
          margin-top: -80px;
        }
        .hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, var(--background) 20%, transparent 60%),
                      linear-gradient(to top, var(--background) 10%, transparent 40%);
        }
        .hero-content {
          max-width: 650px;
        }
        .hero-title {
          font-size: clamp(3rem, 8vw, 5rem);
          margin: 1.5rem 0;
          line-height: 0.9;
        }
        .hero-overview {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          line-height: 1.5;
        }
        .hero-actions {
          display: flex;
          gap: 1.5rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
          border-left: 4px solid var(--accent);
          padding-left: 1.5rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .btn-sm {
          padding: 0.6rem 1.2rem;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .hero-section { height: 70vh; }
          .hero-content { text-align: center; margin: 0 auto; }
          .hero-actions { justify-content: center; flex-direction: column; }
          .hero-overlay {
            background: linear-gradient(to top, var(--background) 40%, rgba(6,6,8,0.4) 100%);
          }
          .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}

function MovieCard({ movie, badge }: { movie: Movie, badge?: 'prime' | 'trending' | 'new' }) {
  return (
    <Link href={`/movie/${movie.id}`} className="movie-card card-premium">
      <div className="poster-wrapper">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="play-icon" style={{ 
            fontSize: '2rem', 
            background: '#fff', 
            color: '#000', 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>▶</div>
          <span className="btn btn-primary btn-sm w-full">Watch Trailer</span>
        </div>
        {badge && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <span className={`badge badge-${badge}`}>
              {badge === 'prime' ? 'Prime Original' : badge.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="movie-info" style={{ padding: '1.2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#fff' }}>{movie.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>{movie.release_date.split('-')[0]}</span>
          <span style={{ color: 'var(--gold)' }}>★ {movie.vote_average}</span>
        </div>
      </div>
    </Link>
  );
}
