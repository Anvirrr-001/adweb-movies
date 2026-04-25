"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Movie } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import MovieCard from "@/components/MovieCard";
import { useSearchParams } from "next/navigation";

interface MoviesListProps {
  initialMovies: Movie[];
  downloadLink: string;
}

export default function MoviesList({ initialMovies, downloadLink }: MoviesListProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialGenre = searchParams.get("genre") ? parseInt(searchParams.get("genre")!) : null;

  const [selectedGenre, setSelectedGenre] = useState<number | null>(initialGenre);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  React.useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    setSelectedGenre(initialGenre);
  }, [initialGenre]);

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
    <div className="section-wrapper" style={{ paddingTop: '100px' }}>
      <div className="row-header reveal" style={{ marginBottom: '48px' }}>
        <div style={{ flex: 1 }}>
          <h2 className="font-heading" style={{ fontSize: '42px' }}>Cinematic <span style={{ color: 'var(--accent)' }}>Registry</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Explore the encrypted database of upcoming 2026 productions.</p>
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
                style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '12px' }}
              />
           </div>
        </div>
      </div>

      <div className="reveal reveal-delay-1" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '60px', paddingBottom: '10px' }}>
        <button 
          className={`genre-chip ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => setSelectedGenre(null)}
          style={{ 
            background: selectedGenre === null ? 'var(--accent)' : 'var(--surface-raised)', 
            color: selectedGenre === null ? '#fff' : 'var(--text-secondary)',
            border: 'none', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
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
              border: 'none', padding: '12px 28px', borderRadius: '50px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie: Movie, index: number) => (
          <div key={movie.id} className={`reveal reveal-delay-${(index % 5) + 1}`}>
             <MovieCard movie={movie} downloadLink={downloadLink} />
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
         <div className="reveal" style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>No matching productions found in local database.</p>
            <button onClick={() => {setSearchQuery(""); setSelectedGenre(null);}} className="btn btn-glass" style={{ marginTop: '24px' }}>Clear All Filters</button>
         </div>
      )}

      <div className="reveal" style={{ marginTop: '100px' }}>
         <AdBanner slot="archive-bottom" />
      </div>
    </div>
  );
}
