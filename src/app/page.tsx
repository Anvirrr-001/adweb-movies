import { movies2026, Movie } from "@/lib/data";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function HomePage() {
  const featuredMovie = movies2026[0];
  const trendingMovies = movies2026.slice(1, 5);
  const animationMovies = movies2026.filter(m => m.genre_ids.includes(16));
  const recentlyAdded = [...movies2026].reverse().slice(0, 4);

  return (
    <div className="home-container">
      {/* Premium Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: `linear-gradient(rgba(10, 10, 12, 0.4), rgba(10, 10, 12, 1)), url('https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}')`,
      }}>
        <div className="hero-content fade-in">
          <div className="hero-badge">Featured Event</div>
          <h1 className="hero-title">{featuredMovie.title}</h1>
          <p className="hero-desc">{featuredMovie.overview}</p>
          <div className="hero-actions">
            <Link href={`/movie/${featuredMovie.id}`} className="btn btn-primary">
              <span style={{ marginRight: '8px' }}>▶</span> Watch Trailer
            </Link>
            <Link href={`/movie/${featuredMovie.id}`} className="btn btn-outline" style={{ marginLeft: '1rem' }}>
              Full Review
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '3rem' }}>
        {/* Top Ad Slot */}
        <AdBanner slot="home-top" format="auto" />

        {/* Trending Section */}
        <section className="grid-section">
          <div className="section-header">
            <h2 className="section-heading">Trending Trailers</h2>
            <Link href="/movies" className="view-all">See More</Link>
          </div>
          <div className="grid">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Middle Ad Slot */}
        <div style={{ margin: '4rem 0' }}>
          <AdBanner slot="home-mid" format="fluid" />
        </div>

        {/* Animation Favorites */}
        <section className="grid-section">
          <div className="section-header">
            <h2 className="section-heading">Upcoming Animation Favorites</h2>
            <div className="accent-line"></div>
          </div>
          <div className="grid">
            {animationMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Recently Added Articles */}
        <section className="grid-section">
          <div className="section-header">
            <h2 className="section-heading">Latest Review Articles</h2>
            <p className="section-sub">In-depth analysis of the newest trailers</p>
          </div>
          <div className="articles-grid">
            {recentlyAdded.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="article-card">
                <div className="article-img">
                  <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} />
                </div>
                <div className="article-info">
                  <span className="article-tag">Review</span>
                  <h3>{movie.title} Trailer Review: Is it Worth the Hype?</h3>
                  <p>{movie.overview.substring(0, 100)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom Ad Slot */}
        <AdBanner slot="home-bottom" format="auto" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .home-container {
          padding-top: 0;
          background: #0a0a0c;
        }
        .hero-section {
          height: 85vh;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: baseline;
          padding: 0 10%;
          position: relative;
        }
        .hero-badge {
          background: #e50914;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          display: inline-block;
        }
        .hero-title {
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1;
          letter-spacing: -3px;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .hero-desc {
          max-width: 650px;
          font-size: 1.25rem;
          color: #d1d5db;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .btn {
          padding: 1rem 2.5rem;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: 1.1rem;
        }
        .btn-primary {
          background: #fff;
          color: #000;
        }
        .btn-primary:hover {
          background: #e5e7eb;
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(255,255,255,0.1);
        }
        .btn-outline {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2.5rem;
          border-left: 5px solid #e50914;
          padding-left: 1.5rem;
        }
        .section-heading {
          font-size: 2.5rem;
          font-weight: 800;
        }
        .section-sub {
          color: #6b7280;
          margin-top: 0.5rem;
        }
        .view-all {
          color: #e50914;
          font-weight: 700;
          text-decoration: none;
          font-size: 1.1rem;
        }
        .view-all:hover {
          text-decoration: underline;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2.5rem;
        }

        /* Movie Card */
        .movie-card {
          background: #16161a;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .movie-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          border-color: rgba(255,255,255,0.1);
        }
        .poster-wrapper {
          position: relative;
          aspect-ratio: 2/3;
        }
        .poster-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(229, 9, 20, 0.8), transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .movie-card:hover .hover-overlay {
          opacity: 1;
        }
        .play-btn-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .movie-info {
          padding: 1.5rem;
        }
        .movie-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .movie-meta {
          display: flex;
          justify-content: space-between;
          color: #9ca3af;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .rating-chip {
          color: #facc15;
        }

        /* Articles Grid */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2.5rem;
        }
        .article-card {
          display: flex;
          gap: 1.5rem;
          background: rgba(255,255,255,0.02);
          padding: 1.5rem;
          border-radius: 20px;
          text-decoration: none;
          color: inherit;
          transition: background 0.3s;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .article-card:hover {
          background: rgba(255,255,255,0.05);
        }
        .article-img {
          width: 150px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
        }
        .article-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .article-info h3 {
          font-size: 1.1rem;
          margin: 0.5rem 0;
          line-height: 1.3;
        }
        .article-info p {
          font-size: 0.85rem;
          color: #6b7280;
        }
        .article-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #e50914;
          font-weight: 800;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3rem; }
          .hero-section { padding-top: 100px; }
          .articles-grid { grid-template-columns: 1fr; }
        }
      ` }} />
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="movie-card">
      <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="poster-wrapper">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
          />
          <div className="hover-overlay">
            <div className="play-btn-circle">▶</div>
          </div>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span>{movie.release_date.split('-')[0]}</span>
            <span className="rating-chip">★ {movie.vote_average}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
