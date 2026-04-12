"use client";

import React from "react";
import Link from "next/link";
import { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
  downloadLink: string;
  featured?: boolean;
}

export default function MovieCard({ movie, downloadLink, featured }: MovieCardProps) {
  const year = movie.release_date.split('-')[0];

  return (
    <div className="movie-card shadow-sm reveal">
      <div className="card-poster">
        <img 
          src={movie.poster_path} 
          alt={movie.title} 
          loading="lazy" 
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400"; }}
        />
        
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 15 }}>
           <div className="play-icon-glow" style={{ width: '64px', height: '64px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px var(--accent-glow)', cursor: 'pointer', transition: '0.3s' }}>
              <span style={{ color: 'white', fontSize: '28px', marginLeft: '6px' }}>▶</span>
           </div>
        </a>
        
        {/* Quick Monetized Actions */}
        <div className="card-quick-actions">
           <a 
             href={downloadLink} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="quick-btn download" 
             title="Download Now"
             onClick={(e) => e.stopPropagation()}
           >
              <span>📥</span>
           </a>
           <Link 
             href={`/movie/${movie.id}`} 
             className="quick-btn" 
             title="View Details"
             onClick={(e) => e.stopPropagation()}
           >
              <span>👁️</span>
           </Link>
        </div>

        <div className="card-overlay">
          <div className="card-title" style={{ fontSize: featured ? '22px' : '16px' }}>{movie.title}</div>
          <div className="card-badges">
             <span className="badge badge-hd">UHD 4K</span>
             <span className="badge">{year}</span>
             <span className="badge" style={{ color: 'var(--accent)' }}>★ {movie.vote_average}</span>
          </div>
        </div>
      </div>
      {/* Full card clickable to details page */}
      <Link href={`/movie/${movie.id}`} style={{ position: 'absolute', inset: 0, zIndex: 5 }}></Link>
      
      {/* Explicit Download 4K Button for Direct Ad Link */}
      <div style={{ position: 'relative', zIndex: 20, padding: '10px' }}>
         <a 
           href={downloadLink} 
           target="_blank" 
           rel="noopener noreferrer" 
           className="btn btn-premium" 
           style={{ width: '100%', fontSize: '14px', padding: '10px 0', display: 'flex', justifyContent: 'center', background: 'var(--accent)', color: 'black', fontWeight: 'bold' }}
         >
            📥 DOWNLOAD 4K
         </a>
      </div>
    </div>
  );
}
