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
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const movieFormRef = useRef<HTMLFormElement>(null);

  // Stats
  const stats = useMemo(() => ({
    totalMovies: initialMovies.length,
    originals: initialMovies.filter(m => m.id >= 10).length,
    avgRating: initialMovies.length > 0 
      ? (initialMovies.reduce((acc, m) => acc + (m.vote_average || 0), 0) / initialMovies.length).toFixed(1)
      : "0.0"
  }), [initialMovies]);

  const handleAction = async (formData: FormData) => {
    setIsPending(true);
    setStatus(null);
    try {
      let result;
      if (editingMovie) {
        result = await editMovie(editingMovie.id, formData);
      } else {
        result = await addMovie(formData);
      }

      if (result.success) {
        setStatus({ type: 'success', message: 'Successfully Saved and Pushed to GitHub!' });
        setEditingMovie(null);
        movieFormRef.current?.reset();
      } else {
        setStatus({ type: 'error', message: result.error || 'System failed to process change.' });
      }
    } catch (e: any) {
      setStatus({ type: 'error', message: e.message || 'Fatal terminal error.' });
    } finally {
      setIsPending(false);
    }
  };

  const clearStatus = () => setStatus(null);

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
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
            <div className="logo-symbol" style={{ background: 'var(--accent)', padding: '8px', borderRadius: '50%', display: 'flex' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-1px' }}>Watch<span style={{ color: 'var(--accent)' }}>Trailers</span></span>
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
              className="glass"
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--surface-border)', marginBottom: '20px', textAlign: 'center', fontSize: '18px' }}
            />
            {error && <p className="error-msg" style={{ color: 'var(--accent)', marginBottom: '15px' }}>{error}</p>}
            <button type="submit" className="btn btn-primary w-full">Initialize Session</button>
          </form>
          <Link href="/" className="back-link" style={{ display: 'block', marginTop: '20px', color: 'var(--text-muted)' }}>Return to Public Interface</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand" style={{ marginBottom: '40px' }}>
             <Link href="/" className="brand-area" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div className="logo-symbol" style={{ background: 'var(--accent)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="brand-name" style={{ color: '#fff', fontSize: '20px', fontWeight: 900 }}>Watch<span style={{ color: 'var(--accent)' }}>Trailers</span></span>
              </Link>
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

        <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
          <button onClick={() => setIsAuthenticated(false)} className="btn btn-glass btn-sm w-full">Terminal Exit</button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">
        <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div className="header-info">
            <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>System Dashboard</h1>
            <p className="text-secondary">Connected: Administrator (Level 1)</p>
          </div>
          <Link href="/" className="btn btn-glass btn-sm">Preview Live Site</Link>
        </header>

        {/* Status Notification */}
        {status && (
          <div className={`status-banner ${status.type} animate-slide-down`}>
            <span className="icon">{status.type === 'success' ? '✅' : '❌'}</span>
            <span className="message">{status.message}</span>
            <button onClick={clearStatus} className="close-btn">×</button>
          </div>
        )}

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
                <section className="form-panel card-premium glass" style={{ padding: '32px' }}>
                  <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: 800 }}>
                    <span style={{ color: 'var(--accent)' }}>{editingMovie ? '✏️' : '➕'}</span>
                    {editingMovie ? 'Edit Production' : 'Register New Title'}
                  </h2>
                  <form 
                    key={editingMovie ? editingMovie.id : 'new-registration'}
                    ref={movieFormRef}
                    action={handleAction}
                  >
                    <div className="form-group">
                      <label>YouTube Link / ID (Primary Source)</label>
                      <input 
                        name="youtube_link" 
                        defaultValue={editingMovie?.trailer_id} 
                        placeholder="https://www.youtube.com/watch?v=..."
                        required 
                        style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}
                      />
                      <p className="hint">The movie link that will be updated on the website.</p>
                    </div>

                    <div className="form-group">
                      <label>Production Title (Name of the movie)</label>
                      <input 
                        name="title" 
                        defaultValue={editingMovie?.title} 
                        placeholder="e.g. Avengers: Doomsday" 
                        required
                        style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}
                      />
                      <p className="hint">This name will appear on the dashboard and main page.</p>
                    </div>

                    <div className="form-actions" style={{ marginTop: '32px' }}>
                      <button 
                        type="submit" 
                        className={`btn btn-primary w-full ${isPending ? 'loading' : ''}`}
                        disabled={isPending}
                        style={{ height: '56px', fontSize: '16px' }}
                      >
                        {isPending ? 'Synchronizing with GitHub...' : 'Update & Push to GitHub'}
                      </button>
                      {editingMovie && (
                        <button 
                          type="button" 
                          onClick={() => setEditingMovie(null)} 
                          className="btn btn-glass w-full" 
                          style={{ marginTop: '12px' }}
                          disabled={isPending}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                {/* Library List */}
                <section className="list-panel card-premium glass" style={{ padding: '32px' }}>
                  <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 800 }}>Archive Registry ({initialMovies.length})</h2>
                  <div className="list-scroll">
                    {initialMovies.map(movie => (
                      <div key={movie.id} className="list-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--surface-border)' }}>
                        <img src={movie.poster_path} alt="" style={{ width: '48px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div className="item-info" style={{ flex: 1 }}>
                          <span className="title" style={{ fontWeight: 700, display: 'block' }}>{movie.title}</span>
                          <span className="date" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{movie.release_date} • {movie.quality}</span>
                        </div>
                        <div className="item-controls" style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingMovie(movie)} className="icon-btn" title="Edit" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'var(--surface-raised)', border: '1px solid var(--surface-border)', cursor: 'pointer' }}>✏️</button>
                          <form action={async () => {
                            if (confirm('Permanently delete this item from GitHub registry?')) {
                              const res = await deleteMovie(movie.id);
                              if (!res.success) alert(res.error);
                            }
                          }}>
                            <button type="submit" className="icon-btn danger" title="Delete" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'var(--surface-raised)', border: '1px solid #ff444430', cursor: 'pointer' }}>🗑️</button>
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

              <form action={async (formData) => {
                setIsPending(true);
                const res = await updateSettings(formData);
                if (res.success) setStatus({type:'success', message: 'Monetization strategy updated and pushed!'});
                else setStatus({type:'error', message: res.error || 'Update failed'});
                setIsPending(false);
              }} className="settings-form">
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
                  {/* Left Column: Direct Links & Background Ads */}
                  <div className="column">
                    <section className="card-premium glass" style={{ marginBottom: '32px' }}>
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>🚀 Direct Link (Download Master)</h3>
                        <p className="hint" style={{ marginBottom: '20px' }}>Paste your High-Converting Direct Link here. It will be applied to all "Download" and "Play" buttons across the site.</p>
                        <div className="form-group">
                          <label>Adsterra Direct Link URL</label>
                          <input 
                            name="adsterra_direct_link" 
                            defaultValue={initialSettings.adsterra.direct_link} 
                            placeholder="https://example.com/direct-link"
                            className="input-premium"
                            style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="card-premium glass">
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>💥 Background & Popups</h3>
                        <div className="form-group">
                          <label>Popunder</label>
                          <textarea name="adsterra_popunder" rows={5} defaultValue={initialSettings.adsterra.scripts?.popunder} placeholder="Paste Popunder script here..." style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}></textarea>
                          <p className="hint">Loads in the background when users click anywhere.</p>
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                          <label>Social Bar</label>
                          <textarea name="adsterra_social_bar" rows={5} defaultValue={initialSettings.adsterra.scripts?.social_bar} placeholder="Paste Social Bar script here..." style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}></textarea>
                          <p className="hint">Floating sticky bar placed automatically on the screen.</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Display Ads */}
                  <div className="column">
                    <section className="card-premium glass" style={{ marginBottom: '32px' }}>
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>🖼️ Display Banners</h3>
                        
                        <div className="form-group">
                          <label>Native Banner</label>
                          <textarea name="adsterra_native_banner" rows={5} defaultValue={initialSettings.adsterra.scripts?.native_banner} placeholder="Paste Native Banner script here..." style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}></textarea>
                          <p className="hint">Automatically injected into full-width content blocks (Homepage, Archives).</p>
                        </div>

                        <div className="form-group" style={{ marginTop: '24px' }}>
                          <label>Banner 300x250</label>
                          <textarea name="adsterra_banner_300x250" rows={5} defaultValue={initialSettings.adsterra.scripts?.banner_300x250} placeholder="Paste Banner 300x250 script here..." style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}></textarea>
                          <p className="hint">Automatically injected into block sidebars (Movie Detail sidebars).</p>
                        </div>
                      </div>
                    </section>

                    <section className="card-premium glass">
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>🛡️ Infrastructure</h3>
                        <div className="form-group">
                          <label>Domain Verification Tag</label>
                          <textarea name="adsterra_verification" rows={3} defaultValue={initialSettings.adsterra.verification_tag} placeholder='<meta name="adsterra-verification"...' style={{ background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}></textarea>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="form-actions sticky-footer" style={{ marginTop: '40px' }}>
                   <button type="submit" className="btn btn-primary w-full" disabled={isPending} style={{ height: '56px', fontSize: '1.1rem' }}>
                     {isPending ? 'Syncing...' : 'Update Monetization Strategy'}
                   </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <section className="settings-panel card-premium glass" style={{ maxWidth: '800px', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Infrastructure Matrix</h2>
              <form action={async (formData) => {
                setIsPending(true);
                const res = await updateSettings(formData);
                if (res.success) setStatus({type:'success', message: 'Infrastructure updated and pushed!'});
                else setStatus({type:'error', message: res.error || 'Update failed'});
                setIsPending(false);
              }} className="settings-form">
                <div className="form-group">
                  <label>Ads.txt Deployment</label>
                  <textarea name="ads_txt" rows={10} defaultValue={initialSettings.site.ads_txt} placeholder="adsterra.com, XXXXX, DIRECT" style={{ fontFamily: 'monospace', background: 'var(--surface-raised)', border: '1px solid var(--surface-border)' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? 'Syncing...' : 'Update Infrastructure'}
                </button>
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
          padding: 2.5rem;
        }
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
        .nav-item.active { background: var(--accent); color: #fff; box-shadow: 0 5px 15px var(--accent-glow); }

        .dashboard-main { padding: 4rem; overflow-y: auto; max-height: 100vh; }
        
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3.5rem; }
        .stat-card { background: var(--surface); border: 1px solid var(--surface-border); padding: 2rem; border-radius: 20px; }
        .stat-card .label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1.5px; margin-bottom: 0.75rem; text-transform: uppercase; }
        .stat-card .value { font-size: 2.2rem; font-weight: 950; font-family: var(--font-outfit); }

        .panel-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 3rem; }
        
        .list-scroll { max-height: 700px; overflow-y: auto; padding-right: 1rem; }
        .list-scroll::-webkit-scrollbar { width: 4px; }
        .list-scroll::-webkit-scrollbar-thumb { background: var(--surface-border); border-radius: 10px; }

        .hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.6rem; }
        .status-pill { font-size: 0.65rem; font-weight: 900; padding: 6px 12px; border-radius: 5px; background: #22c55e20; color: #22c55e; border: 1px solid #22c55e40; }

        /* Status Notification Banner */
        .status-banner {
          margin-bottom: 2.5rem;
          padding: 1.5rem 2.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          position: relative;
          font-weight: 700;
          backdrop-filter: blur(20px);
        }
        .status-banner.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        .status-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
        .status-banner .close-btn {
          position: absolute;
          right: 1.5rem;
          background: none;
          border: none;
          color: currentColor;
          font-size: 1.8rem;
          cursor: pointer;
          opacity: 0.5;
        }

        .btn.loading { opacity: 0.6; cursor: wait; }

        @keyframes slide-down {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }

        .login-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; }
        .login-card { background: var(--surface); border: 1px solid var(--surface-border); padding: 5rem; border-radius: 40px; width: 500px; text-align: center; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }
        .login-card h1 { font-size: 2.5rem; font-weight: 900; margin: 2rem 0 0.5rem; letter-spacing: -1.5px; }
        .login-card p { color: var(--text-muted); margin-bottom: 3rem; font-size: 1.1rem; }

        @media (max-width: 1200px) {
          .panel-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 1024px) {
          .dashboard-layout { grid-template-columns: 1fr; }
          .dashboard-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
