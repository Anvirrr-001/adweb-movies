import { movies2026 } from "@/lib/data";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function HomePage() {
  const featuredMovie = movies2026[0];

  return (
    <div className="home-container">
      {/* Premium Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: `linear-gradient(rgba(10, 10, 12, 0.4), rgba(10, 10, 12, 1)), url('https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}')`,
        height: '80vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'baseline',
        padding: '0 10%'
      }}>
        <div className="hero-content fade-in">
          <span className="badge">Featured 2026</span>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0' }}>{featuredMovie.title}</h1>
          <p style={{ maxWidth: '600px', color: '#ccc', marginBottom: '2rem' }}>{featuredMovie.overview}</p>
          <div className="hero-actions">
            <button className="btn btn-primary">Watch Trailer</button>
            <button className="btn btn-outline" style={{ marginLeft: '1rem' }}>More Info</button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Top Ad Slot */}
        <AdBanner slot="home-top" format="auto" />

        <section className="grid-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700 }}>2026 Most Anticipated</h2>
            <Link href="/movies" style={{ color: 'var(--accent)', fontWeight: 600 }}>View All {movies2026.length} Movies</Link>
          </div>
          <div className="grid">
            {movies2026.map((movie) => (
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
                      <span>{movie.release_date.split('-')[0]}</span>
                      <span className="genre-tag">Trailer</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Middle Ad Slot */}
        <AdBanner slot="home-mid" format="fluid" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .home-container {
          padding-top: 0;
        }
        .badge {
          background: var(--accent);
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .btn {
          padding: 0.8rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        .btn-primary {
          background: #fff;
          color: #000;
        }
        .btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
        }
        .btn:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
        .poster-wrapper {
          position: relative;
          overflow: hidden;
        }
        .hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .movie-card:hover .hover-overlay {
          opacity: 1;
        }
        .rating-tag {
          background: rgba(0,0,0,0.85);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 700;
          color: #ffcc00;
          font-size: 0.85rem;
        }
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
          transition: transform 0.2s ease;
        }
        .play-mini-btn:hover {
          transform: scale(1.1);
        }
        .card-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .genre-tag {
          background: rgba(255,255,255,0.05);
          padding: 2px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          border: 1px solid rgba(255,255,255,0.1);
        }
      ` }} />
    </div>
  );
}
