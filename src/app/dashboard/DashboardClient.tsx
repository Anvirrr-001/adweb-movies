"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Movie } from "@/lib/data";
import { addMovie, deleteMovie } from "@/lib/actions";

interface DashboardClientProps {
  initialMovies: Movie[];
}

export default function DashboardClient({ initialMovies }: DashboardClientProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "9 movie123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Access denied.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-overlay">
        <div className="login-card fade-in">
          <h2 className="logo">MOVIES<span>2026</span></h2>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Admin Access</h1>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Enter Dashboard Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                autoFocus
              />
              {error && <p style={{ color: '#ff4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-full">Access Dashboard</button>
          </form>
          <Link href="/" style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>Back to Home</Link>
        </div>
        <style>{`
          .login-overlay {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0c;
          }
          .login-card {
            background: #16161a;
            padding: 3rem;
            border-radius: 24px;
            width: 100%;
            max-width: 400px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 40px 100px rgba(0,0,0,0.8);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <h1 className="title-large">Admin Dashboard</h1>
            <p className="text-secondary">Logged in as Administrator</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setIsAuthenticated(false)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            <Link href="/" className="btn btn-glass">View Site</Link>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Add Movie Form */}
          <section className="form-card card-premium">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Add New Movie</h2>
              <span className="badge">Database Add</span>
            </div>
            <form action={addMovie} className="movie-form">
              <div className="form-group">
                <label>Movie Title</label>
                <input name="title" required placeholder="e.g. Inception 2" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Release Date</label>
                  <input name="release_date" type="date" required />
                </div>
                <div className="form-group">
                  <label>Rating (0-10)</label>
                  <input name="vote_average" type="number" step="0.1" defaultValue="8.5" />
                </div>
              </div>
              <div className="form-group">
                <label>Official YouTube Trailer Link</label>
                <input name="youtube_link" required placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Poster Path (TMDB format: /xyz.jpg)</label>
                  <input name="poster_path" placeholder="/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg" />
                </div>
                <div className="form-group">
                  <label>Backdrop Path</label>
                  <input name="backdrop_path" placeholder="/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg" />
                </div>
              </div>
              <div className="form-group">
                <label>Brief Overview</label>
                <textarea name="overview" rows={3} required placeholder="What is this movie about?"></textarea>
              </div>
              <div className="form-group">
                <label>Review Article Content</label>
                <textarea name="review_content" rows={5} placeholder="Detailed trailer breakdown and analysis for the review section..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full">Save Movie to Database</button>
            </form>
          </section>

          {/* Movie List Management */}
          <section className="list-card card-premium">
            <h2 className="section-title">Manage Content ({initialMovies.length})</h2>
            <div className="movies-table-wrapper">
              <table className="movies-table">
                <thead>
                  <tr>
                    <th>Movie Card</th>
                    <th>Release</th>
                    <th className="action-col">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {[...initialMovies].reverse().map(movie => (
                    <tr key={movie.id}>
                      <td>
                        <div className="movie-cell">
                          <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="" width={40} height={60} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700 }}>{movie.title}</span>
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>ID: {movie.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{movie.release_date.split('-')[0]}</td>
                      <td className="action-col">
                        <div className="action-btns">
                          <Link href={`/movie/${movie.id}`} className="mini-btn">Preview</Link>
                          <form action={async () => { await deleteMovie(movie.id); }}>
                            <button type="submit" className="mini-btn btn-danger">Delete</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        /* Styles are mostly inherited or defined globally, but adding specific refinements */
        .badge {
          background: rgba(229, 9, 20, 0.1);
          color: #e50914;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
