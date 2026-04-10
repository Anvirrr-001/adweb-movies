import { getMovies, getSettings } from "@/lib/data.server";
import { Movie } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const movies = getMovies();
  return movies.map((movie: Movie) => ({
    id: movie.id.toString(),
  }));
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allMovies = getMovies();
  const movie = allMovies.find(m => m.id === parseInt(id));

  if (!movie) {
    notFound();
  }

  const { adsterra } = getSettings();
  const trailerUrl = movie.trailer_id && movie.trailer_id !== 'placeholder'
    ? `https://www.youtube.com/embed/${movie.trailer_id}?autoplay=0&rel=0&modestbranding=1`
    : null;

  return (
    <div className="movie-details-viewport">
      {/* Cinematic Hero Section */}
      <section className="details-banner">
        <div className="hero-backdrop">
          <img src={movie.backdrop_path} alt={movie.title} />
          <div className="hero-backdrop::after"></div>
        </div>
        
        <div className="header-container" style={{ position: 'relative', zIndex: 5 }}>
          <div className="hero-content" style={{ padding: 0 }}>
             <div className="hero-label">
                <span style={{ color: '#fff' }}>Official Trailer</span>
                <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }}></span>
                <span>2026 Season</span>
             </div>
             <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', maxWidth: '1000px' }}>{movie.title}</h1>
             <div className="hero-meta">
                <span style={{ color: 'var(--accent)' }}>★ {movie.vote_average} Rating</span>
                <span>{movie.duration || '120m'}</span>
                <span className="badge badge-hd">UHD 4K</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="main-content">
        <div className="primary-column">
          <section className="trailer-box">
             {trailerUrl ? (
                <iframe 
                  src={trailerUrl}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
             ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                   <p style={{ color: 'var(--text-muted)' }}>Trailer encrypted or unavailable.</p>
                </div>
             )}
          </section>

          <div className="metadata-row glass" style={{ marginTop: '32px', padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Release Date</p>
                <p style={{ fontSize: '18px', fontWeight: 700 }}>{new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
             <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-glass">Add to Watchlist</button>
                <Link href="/" className="btn btn-primary">Back to Registry</Link>
             </div>
          </div>

          <section style={{ marginTop: '60px' }}>
             <h2 className="font-heading" style={{ fontSize: '32px', marginBottom: '24px' }}>Cinematic Breakdown</h2>
             <div style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.8', maxWidth: '900px' }}>
                {movie.review_content ? movie.review_content.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '24px' }}>{para}</p>
                )) : <p>Detailed editorial review is currently being processed by the archive team.</p>}
             </div>
          </section>

          {/* Ad Slot */}
          <div style={{ margin: '60px 0' }}>
             <AdBanner slot="detail-mid-native" format="auto" />
          </div>

          <section className="download-well glass">
             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 className="font-heading" style={{ fontSize: '28px' }}>High-Fidelity Access</h3>
                <p style={{ color: 'var(--text-muted)' }}>Selected quality levels available for private screening.</p>
             </div>
             
             <div className="download-grid">
                <a href={adsterra.enabled ? "#" : "#"} className="btn btn-primary" style={{ justifyContent: 'center', height: '60px', fontSize: '16px' }}>
                   <span>📥 Download HD (1080p)</span>
                </a>
                <a href={adsterra.enabled ? "#" : "#"} className="btn btn-glass" style={{ justifyContent: 'center', height: '60px', fontSize: '16px', border: '1px solid var(--accent)' }}>
                   <span style={{ color: 'var(--accent)' }}>💎 Stream in 4K Quality</span>
                </a>
             </div>
             <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Encryption powered by SecureCDN. Ad-supported access required.
             </p>
          </section>
        </div>

        <aside className="sidebar">
          <div style={{ position: 'sticky', top: '100px' }}>
             <div className="panel-header" style={{ marginBottom: '20px', fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)' }}>SPONSORED CONTENT</div>
             <AdBanner slot="detail-sidebar-top" format="rectangle" />
             
             <div className="movie-card" style={{ marginTop: '40px' }}>
                <div className="card-poster">
                   <img src={movie.poster_path} alt="" />
                </div>
                <div style={{ padding: '24px' }}>
                   <h4 style={{ marginBottom: '8px' }}>The Verdict</h4>
                   <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{movie.overview}</p>
                </div>
             </div>

             <div style={{ marginTop: '40px' }}>
                <AdBanner slot="detail-sidebar-bottom" format="rectangle" />
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
