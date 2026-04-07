"use client";

import React, { useState, useRef, useMemo } from 'react';
import Link from "next/link";
import { Movie, SiteSettings } from "@/lib/data";
import { addMovie, editMovie, deleteMovie, updateSettings } from "@/lib/actions";

interface DashboardClientProps {
  initialMovies: Movie[];
  initialSettings: SiteSettings;
}

export default function DashboardClient({ initialMovies, initialSettings }: DashboardClientProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'content' | 'ads' | 'settings'>('content');
  
  // Movie State
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const movieFormRef = useRef<HTMLFormElement>(null);

  // Stats
  const stats = useMemo(() => ({
    totalMovies: initialMovies.length,
    originals: initialMovies.filter(m => m.id >= 10).length,
    avgRating: (initialMovies.reduce((acc, m) => acc + m.vote_average, 0) / initialMovies.length).toFixed(1)
  }), [initialMovies]);

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
      <div className="login-screen">
        <div className="login-card animate-fade-in">
          <div className="brand">
            <span className="logo-text">ADWEB</span>
            <span className="portal-text">PORTAL</span>
          </div>
          <h1>Terminal Access</h1>
          <p>Provide secure credentials to enter the control unit.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="System Password"
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary w-full">Initialize Session</button>
          </form>
          <Link href="/" className="back-link">Return to Public Interface</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand">
            <span className="logo-text">ADWEB</span>
            <span className="portal-text">PORTAL</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <span className="icon">🎬</span> Content Library
          </button>
          <button 
            className={`nav-item ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            <span className="icon">💰</span> Monetization
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="icon">⚙️</span> System Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setIsAuthenticated(false)} className="btn btn-glass btn-sm w-full">Terminal Exit</button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">
        <header className="main-header">
          <div className="header-info">
            <h1>System Dashboard</h1>
            <p className="text-secondary">Connected: Administrator (Level 1)</p>
          </div>
          <Link href="/" className="btn btn-outline btn-sm">Preview Live Site</Link>
        </header>

        {/* Stats Overview */}
        <section className="stats-row">
          <div className="stat-card">
            <span className="label">Total Articles</span>
            <span className="value">{stats.totalMovies}</span>
          </div>
          <div className="stat-card">
            <span className="label">Amazon Originals</span>
            <span className="value">{stats.originals}</span>
          </div>
          <div className="stat-card">
            <span className="label">Average Portal Score</span>
            <span className="value">★ {stats.avgRating}</span>
          </div>
        </section>

        {/* Dynamic Content */}
        <div className="tab-content animate-fade-in">
          {activeTab === 'content' && (
            <div className="content-management">
              <div className="panel-grid">
                {/* Movie Editor */}
                <section className="form-panel card-premium">
                  <h2>{editingMovie ? 'Modify Entry' : 'New Entry'}</h2>
                  <form 
                    ref={movieFormRef}
                    action={async (formData) => {
                      if (editingMovie) {
                        await editMovie(editingMovie.id, formData);
                        setEditingMovie(null);
                      } else {
                        await addMovie(formData);
                      }
                      movieFormRef.current?.reset();
                    }}
                  >
                    <div className="form-group">
                      <label>Production Title</label>
                      <input name="title" defaultValue={editingMovie?.title} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Premiere Date</label>
                        <input name="release_date" type="date" defaultValue={editingMovie?.release_date} required />
                      </div>
                      <div className="form-group">
                        <label>Audience Score</label>
                        <input name="vote_average" type="number" step="0.1" defaultValue={editingMovie?.vote_average || 8.0} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>High-Res Backdrop URL</label>
                      <input name="backdrop_path" defaultValue={editingMovie?.backdrop_path} placeholder="/image.jpg" />
                    </div>
                    <div className="form-group">
                      <label>YouTube ID / Link</label>
                      <input name="youtube_link" defaultValue={editingMovie?.trailer_id} required />
                    </div>
                    <div className="form-group">
                      <label>Review Synopsis</label>
                      <textarea name="review_content" rows={4} defaultValue={editingMovie?.review_content}></textarea>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Commit To Database</button>
                      {editingMovie && (
                        <button type="button" onClick={() => setEditingMovie(null)} className="btn btn-outline">Discard Changes</button>
                      )}
                    </div>
                  </form>
                </section>

                {/* Library List */}
                <section className="list-panel card-premium">
                  <h2>Library Overview</h2>
                  <div className="list-scroll">
                    {initialMovies.map(movie => (
                      <div key={movie.id} className="list-item">
                        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="" />
                        <div className="item-info">
                          <span className="title">{movie.title}</span>
                          <span className="date">{movie.release_date}</span>
                        </div>
                        <div className="item-controls">
                          <button onClick={() => setEditingMovie(movie)} className="icon-btn">✏️</button>
                          <form action={async () => await deleteMovie(movie.id)}>
                            <button type="submit" className="icon-btn danger">🗑️</button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <section className="monetization-panel card-premium max-w-2">
              <div className="panel-header">
                <h2>Adsterra Revenue Control</h2>
                <div className="status-pill active">Connected</div>
              </div>
              
              <form action={updateSettings} className="settings-form">
                <div className="form-group checkbox-group">
                  <label>Enable Monetization Layer</label>
                  <input type="checkbox" name="adsterra_enabled" defaultChecked={initialSettings.adsterra.enabled} />
                </div>
                
                <div className="form-group">
                  <label>Social Bar Script (Adsterra)</label>
                  <textarea name="adsterra_social_bar" rows={3} defaultValue={initialSettings.adsterra.scripts.social_bar}></textarea>
                  <p className="hint">Injects the Social Bar overlay sitewide.</p>
                </div>

                <div className="form-group">
                  <label>Popunder Script</label>
                  <textarea name="adsterra_popunder" rows={3} defaultValue={initialSettings.adsterra.scripts.popunder}></textarea>
                </div>

                <div className="form-group">
                  <label>Site Verification Meta Tag</label>
                  <input name="adsterra_verification" defaultValue={initialSettings.adsterra.verification_tag} placeholder='<meta name="adsterra-verification" ...' />
                </div>

                <button type="submit" className="btn btn-primary">Sync Monetization Settings</button>
              </form>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="settings-panel card-premium max-w-2">
              <h2>Infrastructure Settings</h2>
              <form action={updateSettings} className="settings-form">
                <div className="form-group">
                  <label>Ads.txt Content</label>
                  <textarea name="ads_txt" rows={8} defaultValue={initialSettings.site.ads_txt} placeholder="google.com, pub-XXXXX, DIRECT..."></textarea>
                  <p className="hint">Required for AdSense/Adsterra domain approval.</p>
                </div>
                <button type="submit" className="btn btn-primary">Update Infrastructure</button>
              </form>
            </section>
          )}
        </div>
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: #060608;
        }
        .dashboard-sidebar {
          background: var(--surface);
          border-right: 1px solid var(--surface-border);
          display: flex;
          flex-direction: column;
          padding: 2rem;
        }
        .sidebar-brand { margin-bottom: 3rem; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .nav-item.active { background: var(--accent); color: #fff;box-shadow: 0 5px 15px var(--accent-glow); }
        .sidebar-footer { padding-top: 2rem; border-top: 1px solid var(--surface-border); }

        .dashboard-main { padding: 3rem; overflow-y: auto; max-height: 100vh; }
        .main-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
        .stat-card { background: var(--surface); border: 1px solid var(--surface-border); padding: 1.5rem; border-radius: 20px; }
        .stat-card .label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 1.8rem; font-weight: 900; }

        .panel-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2.5rem; }
        .max-w-2 { max-width: 800px; }
        
        .list-scroll { max-height: 600px; overflow-y: auto; padding-right: 1rem; }
        .list-item { 
          display: flex; align-items: center; gap: 1.5rem; padding: 1rem; border-bottom: 1px solid var(--surface-border);
        }
        .list-item img { width: 45px; height: 65px; object-fit: cover; border-radius: 6px; }
        .item-info { flex: 1; display: flex; flex-direction: column; }
        .item-info .title { font-weight: 700; font-size: 0.95rem; }
        .item-info .date { font-size: 0.75rem; color: var(--text-muted); }
        .item-controls { display: flex; gap: 0.5rem; }
        .icon-btn { 
          background: #16161a; border: 1px solid var(--surface-border); width: 35px; height: 35px; border-radius: 8px; cursor: pointer; transition: 0.3s;
        }
        .icon-btn:hover { border-color: #fff; }
        .icon-btn.danger:hover { background: #ff4444; border-color: #ff4444; }

        .settings-form { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
        .hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; }
        .status-pill { font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 4px; background: #22c55e20; color: #22c55e; border: 1px solid #22c55e40; }

        /* Login Styling */
        .login-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; }
        .login-card { background: #0a0a0c; border: 1px solid #16161a; padding: 4rem; border-radius: 32px; width: 450px; text-align: center; }
        .login-card h1 { font-size: 2rem; margin: 1.5rem 0 0.5rem; }
        .login-card p { color: var(--text-muted); margin-bottom: 2.5rem; }
        .login-card input { margin-bottom: 2rem; text-align: center; font-size: 1.2rem; letter-spacing: 4px; }
        .error-msg { color: #ff4444; margin-top: -1rem; margin-bottom: 1.5rem; font-size: 0.85rem; }
        .back-link { display: block; margin-top: 2rem; color: var(--text-muted); font-size: 0.9rem; }

        @media (max-width: 1024px) {
          .dashboard-layout { grid-template-columns: 1fr; }
          .dashboard-sidebar { display: none; }
          .panel-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
