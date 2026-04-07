"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Movie } from "@/lib/data";
import AdBanner from "@/components/AdBanner";

interface MoviesListProps {
  initialMovies: Movie[];
}

export default function MoviesList({ initialMovies }: MoviesListProps) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const genres = [
    { id: 28, name: "Action" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 53, name: "Thriller" },
    { id: 10749, name: "Romance" },
  ];

  const filteredMovies = useMemo(() => {
    if (!selectedGenre) return initialMovies;
    return initialMovies.filter(m => m.genre_ids.includes(selectedGenre));
  }, [selectedGenre, initialMovies]);

  return (
    <>
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
    </>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.id}`} className="movie-card shadow-lg">
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
      <div className="movie-info">
        <h3 className="text-white font-bold">{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.release_date.split('-')[0]}</span>
          <span className="text-gold">★ {movie.vote_average}</span>
        </div>
      </div>
    </Link>
  );
}
