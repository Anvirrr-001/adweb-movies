"use client";

import React, { useState, useRef, useMemo } from 'react';
import Link from "next/link";
import { Movie, SiteSettings } from "@/lib/types";
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
                <section className="form-panel card-premium glass">
                  <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--accent)' }}>{editingMovie ? '✏️' : '➕'}</span>
                    {editingMovie ? 'Edit Production' : 'Register New Title'}
                  </h2>
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
                      <label>YouTube Link / ID (Primary Source)</label>
                      <input 
                        name="youtube_link" 
                        defaultValue={editingMovie?.trailer_id} 
                        placeholder="https://www.youtube.com/watch?v=..."
                        required 
                        style={{ background: 'var(--surface-raised)', border: '1px solid var(--accent)' }}
                      />
                      <p className="hint">Poster and Trailer ID will be auto-synced from this link.</p>
                    </div>

                    <div className="form-group">
                      <label>Production Title</label>
                      <input name="title" defaultValue={editingMovie?.title} placeholder="e.g. Avatar: Fire and Ash" required />
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

                    <div className="form-row">
                      <div className="form-group">
                        <label>Quality</label>
                        <input name="quality" defaultValue={editingMovie?.quality || "HD"} placeholder="HD" />
                      </div>
                      <div className="form-group">
                        <label>Runtime</label>
                        <input name="duration" defaultValue={editingMovie?.duration || "120m"} placeholder="120m" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Editorial Review Breakdown</label>
                      <textarea name="review_content" rows={6} defaultValue={editingMovie?.review_content} placeholder="Write professional cinematic breakdown..."></textarea>
                    </div>

                    <div className="form-actions" style={{ marginTop: '24px' }}>
                      <button type="submit" className="btn btn-primary w-full">Commit Changes to Portal</button>
                      {editingMovie && (
                        <button type="button" onClick={() => setEditingMovie(null)} className="btn btn-glass w-full" style={{ marginTop: '12px' }}>Cancel Edit</button>
                      )}
                    </div>
                  </form>
                </section>

                {/* Library List */}
                <section className="list-panel card-premium glass">
                  <h2 style={{ marginBottom: '24px' }}>Archive Registry ({initialMovies.length})</h2>
                  <div className="list-scroll">
                    {initialMovies.map(movie => (
                      <div key={movie.id} className="list-item">
                        <img src={movie.poster_path} alt="" />
                        <div className="item-info">
                          <span className="title">{movie.title}</span>
                          <span className="date">{movie.release_date} • {movie.quality}</span>
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
            <div className="monetization-management animate-fade-in">
              <header className="panel-header" style={{ marginBottom: '32px' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '28px' }}>Monetization Control Center</h2>
                  <p className="text-secondary">Configure Adsterra placements and direct links sitewide.</p>
                </div>
                <div className={`status-pill ${initialSettings.adsterra.enabled ? 'active' : ''}`}>
                  {initialSettings.adsterra.enabled ? 'Live Deployment' : 'System Paused'}
                </div>
              </header>

              <form action={updateSettings} className="settings-form">
                {/* 1. Global Master Control */}
                <div className="card-premium glass" style={{ marginBottom: '32px', border: '1px solid var(--accent)' }}>
                  <div className="form-group checkbox-group" style={{ margin: 0, padding: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Global Monetization Engine</h3>
                      <p className="hint" style={{ marginTop: '4px' }}>Master switch to enable or disable all third-party script injections across the platform.</p>
                    </div>
                    <div className="switch-wrapper">
                      <input type="checkbox" name="adsterra_enabled" defaultChecked={initialSettings.adsterra.enabled} className="custom-switch" />
                    </div>
                  </div>
                </div>

                <div className="panel-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Left Column: Direct Links & Global Scripts */}
                  <div className="column">
                    <section className="card-premium glass" style={{ marginBottom: '32px' }}>
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>🚀 Direct Link (Download Master)</h3>
                        <p className="hint" style={{ marginBottom: '20px' }}>Paste your High-Converting Direct Link here. It will be applied to all "Download" buttons on movie pages.</p>
                        <div className="form-group">
                          <label>Adsterra Direct Link URL</label>
                          <input 
                            name="adsterra_direct_link" 
                            defaultValue={initialSettings.adsterra.direct_link} 
                            placeholder="https://example.com/direct-link"
                            className="input-premium"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="card-premium glass">
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>🛠️ Global Scripts</h3>
                        <div className="form-group">
                          <label>Popunder Script</label>
                          <textarea name="adsterra_popunder" rows={4} defaultValue={initialSettings.adsterra.scripts.popunder} placeholder="Paste Popunder code here..."></textarea>
                          <p className="hint">Loads in the background when users click anywhere.</p>
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                          <label>Social Bar Script</label>
                          <textarea name="adsterra_social_bar" rows={4} defaultValue={initialSettings.adsterra.scripts.social_bar} placeholder="Paste Social Bar code here..."></textarea>
                          <p className="hint">Floating sticky bar at the bottom or corners.</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Placements & Banners */}
                  <div className="column">
                    <section className="card-premium glass" style={{ marginBottom: '32px' }}>
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>💠 Placement Slots (Native / Banners)</h3>
                        <p className="hint" style={{ marginBottom: '20px' }}>Configure where specifically your banner and native ads appear.</p>
                        
                        <div className="form-group">
                          <label>Homepage (Mid-Grid)</label>
                          <textarea name="adsterra_home_mid" rows={3} defaultValue={initialSettings.adsterra.scripts.home_mid} placeholder="Paste Native/Banner code..."></textarea>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label>Movie Details (Sidebar Top)</label>
                          <textarea name="adsterra_movie_sidebar_top" rows={3} defaultValue={initialSettings.adsterra.scripts.movie_sidebar_top} placeholder="Paste Banner code..."></textarea>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label>Movie Details (Sidebar Bottom)</label>
                          <textarea name="adsterra_movie_sidebar_bottom" rows={3} defaultValue={initialSettings.adsterra.scripts.movie_sidebar_bottom} placeholder="Paste Banner code..."></textarea>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label>Archive Page (Bottom Grid)</label>
                          <textarea name="adsterra_archive_bottom" rows={3} defaultValue={initialSettings.adsterra.scripts.archive_bottom} placeholder="Paste Native code..."></textarea>
                        </div>
                      </div>
                    </section>

                    <section className="card-premium glass">
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>🛡️ Infrastructure</h3>
                        <div className="form-group">
                          <label>Domain Verification Tag</label>
                          <textarea name="adsterra_verification" rows={3} defaultValue={initialSettings.adsterra.verification_tag} placeholder='<meta name="adsterra-verification"...'></textarea>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="form-actions sticky-footer" style={{ marginTop: '40px' }}>
                   <button type="submit" className="btn btn-primary w-full" style={{ height: '56px', fontSize: '1.1rem' }}>
                     Update Monetization Strategy
                   </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <section className="settings-panel card-premium glass" style={{ maxWidth: '800px' }}>
              <h2>Infrastructure Matrix</h2>
              <form action={updateSettings} className="settings-form">
                <div className="form-group">
                  <label>Ads.txt Deployment</label>
                  <textarea name="ads_txt" rows={10} defaultValue={initialSettings.site.ads_txt} placeholder="adsterra.com, XXXXX, DIRECT" style={{ fontFamily: 'monospace' }}></textarea>
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
