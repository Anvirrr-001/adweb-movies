"use client";

import { getMovies, Movie } from "@/lib/data";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { useState, useMemo } from "react";

export default function MoviesPage() {
  const allMovies = getMovies();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const genres = [
    { id: 28, name: "Action" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 53, name: "Thriller" },
    { id: 10749, name: "Romance" },
  ];

  const filteredMovies = useMemo(() => {
    if (!selectedGenre) return allMovies;
    return allMovies.filter(m => m.genre_ids.includes(selectedGenre));
  }, [selectedGenre, allMovies]);

  return (
    <div className="explore-page">
      {/* Header Section */}
      <section className="explore-header">
        <div className="container">
          <div className="header-flex animate-fade-in">
            <div className="header-text">
              <span className="accent-text text-uppercase">Cinematic Database</span>
              <h1 className="text-gradient">Explore New Releases</h1>
              <p className="text-secondary">Discover the most highly anticipated movie trailers and in-depth reviews from the 2026 season.</p>
            </div>
            
            <div className="search-box-placeholder">
              <div className="input-with-icon">
                <span className="icon">🔍</span>
                <input type="text" placeholder="Search trailers..." className="input-field" readOnly />
              </div>
            </div>
          </div>

          <div className="genre-filter-row animate-fade-in">
            <button 
              className={`genre-btn ${selectedGenre === null ? 'active' : ''}`}
              onClick={() => setSelectedGenre(null)}
            >
              All Featured
            </button>
            {genres.map(g => (
              <button 
                key={g.id}
                className={`genre-btn ${selectedGenre === g.id ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container content-section">
        <AdBanner slot="movies-list-top" format="auto" />

        <div className="results-info">
          <span className="text-muted">Showing {filteredMovies.length} Trailers</span>
          <div className="divider"></div>
        </div>

        <div className="movie-grid">
          {filteredMovies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <AdBanner slot="movies-list-bottom" format="auto" />
      </div>

      <style jsx>{`
        .explore-page { padding-bottom: 6rem; }
        .explore-header {
          padding-top: 4rem;
          padding-bottom: 3rem;
          background: linear-gradient(to bottom, var(--surface) 0%, transparent 100%);
          border-bottom: 1px solid var(--surface-border);
          margin-bottom: 4rem;
        }
        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4rem;
          margin-bottom: 4rem;
        }
        .header-text h1 { font-size: 3.5rem; margin: 0.5rem 0 1rem; }
        .header-text p { max-width: 500px; font-size: 1.1rem; }
        .text-uppercase { text-transform: uppercase; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; }
        .accent-text { color: var(--accent); }
        
        .search-box-placeholder { width: 400px; }
        .input-with-icon { position: relative; }
        .input-with-icon .icon { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .input-with-icon .input-field { padding-left: 3.5rem; background: var(--surface); opacity: 0.8; }

        .genre-filter-row { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; }
        .genre-btn {
          padding: 0.75rem 1.8rem;
          border-radius: 50px;
          border: 1px solid var(--surface-border);
          background: transparent;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .genre-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
        .genre-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
          box-shadow: 0 5px 15px var(--accent-glow);
        }

        .results-info {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .results-info span { font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; flex-shrink: 0; }
        .divider { height: 1px; background: var(--surface-border); width: 100%; }

        @media (max-width: 1024px) {
          .header-flex { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .search-box-placeholder { width: 100%; }
        }
        @media (max-width: 768px) {
          .header-text h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
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
            fontSize: '1.5rem', 
            background: '#fff', 
            color: '#000', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>▶</div>
          <span className="btn btn-outline btn-sm w-full" style={{ fontSize: '0.8rem', padding: '0.6rem' }}>View Trailer</span>
        </div>
      </div>
      <div className="movie-info" style={{ padding: '1.2rem' }}>
        <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.3rem' }}>{movie.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{movie.release_date.split('-')[0]}</span>
          <span style={{ color: 'var(--gold)' }}>★ {movie.vote_average}</span>
        </div>
      </div>
    </Link>
  );
}
