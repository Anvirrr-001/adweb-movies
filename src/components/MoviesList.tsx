"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Movie } from "@/lib/types";
import AdBanner from "@/components/AdBanner";

interface MoviesListProps {
  initialMovies: Movie[];
}

export default function MoviesList({ initialMovies }: MoviesListProps) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const genres = [
    { id: 28, name: "Action" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 53, name: "Thriller" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" }
  ];

  const filteredMovies = useMemo(() => {
    let results = initialMovies;
    if (selectedGenre) {
      results = results.filter(m => m.genre_ids.includes(selectedGenre));
    }
    if (searchQuery) {
      results = results.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return results;
  }, [selectedGenre, searchQuery, initialMovies]);

  return (
    <div className="section-wrapper" style={{ paddingTop: '40px' }}>
      <div className="row-header" style={{ marginBottom: '48px' }}>
        <div style={{ flex: 1 }}>
          <h2 className="font-heading" style={{ fontSize: '32px' }}>Cinematic Registry</h2>
          <p style={{ color: 'var(--text-muted)' }}>Explore the encrypted database of upcoming 2026 productions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
           <div className="search-unit" style={{ display: 'block', maxWidth: '300px' }}>
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search archive..." 
                className="search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}
              />
           </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '40px', paddingBottom: '10px' }}>
        <button 
          className={`genre-chip ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => setSelectedGenre(null)}
          style={{ 
            background: selectedGenre === null ? 'var(--accent)' : 'var(--surface-raised)', 
            color: selectedGenre === null ? '#fff' : 'var(--text-secondary)',
            border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          All Categories
        </button>
        {genres.map(g => (
          <button 
            key={g.id}
            className={`genre-chip ${selectedGenre === g.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g.id)}
            style={{ 
              background: selectedGenre === g.id ? 'var(--accent)' : 'var(--surface-raised)', 
              color: selectedGenre === g.id ? '#fff' : 'var(--text-secondary)',
              border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {filteredMovies.length === 0 && (
         <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>No matching productions found in local database.</p>
            <button onClick={() => {setSearchQuery(""); setSelectedGenre(null);}} className="btn btn-glass" style={{ marginTop: '24px' }}>Clear All Filters</button>
         </div>
      )}

      <div style={{ marginTop: '80px' }}>
         <AdBanner slot="archive-bottom-native" format="fluid" />
      </div>
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
