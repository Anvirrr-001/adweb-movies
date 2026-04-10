import { getMovies, getSettings } from "@/lib/data.server";
import { Movie } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import MovieCard from "@/components/MovieCard";
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

  const relatedMovies = allMovies
    .filter(m => m.id !== movie.id && m.genre_ids.some(g => movie.genre_ids.includes(g)))
    .slice(0, 8);
  
  const downloadLink = adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/";

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
                <Link href="/" className="btn btn-glass">Add to Watchlist</Link>
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

          <section className="download-well glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', marginTop: '40px' }}>
             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 className="font-heading" style={{ fontSize: '28px', color: 'white' }}>Select Free Streaming Server</h3>
                <p style={{ color: 'var(--text-muted)' }}>Choose a high-speed cloud server to watch the full movie in HD.</p>
             </div>
             
             <div className="download-grid" style={{ marginBottom: '30px' }}>
                <a href={adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/"} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', height: '60px', fontSize: '16px', background: '#19c37d' }}>
                   <span>▶ Server 1 (UHD 4K) High Speed</span>
                </a>
                <a href={adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/"} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', height: '60px', fontSize: '16px' }}>
                   <span>▶ Server 2 (1080p HD) Fast</span>
                </a>
             </div>

             <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h4 style={{ color: 'white', marginBottom: '8px' }}>Direct Download Options</h4>
                <div style={{ height: '1px', background: 'var(--surface-border)', width: '100px', margin: '0 auto 20px' }}></div>
             </div>

            <div className="download-grid">
               <a href={adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/"} target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ justifyContent: 'center', height: '54px', fontSize: '14px', border: '1px solid var(--text-secondary)' }}>
                  <span>📥 Download Full Movie (MP4 Backup)</span>
               </a>
               <a href={adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/"} target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ justifyContent: 'center', height: '54px', fontSize: '14px', border: '1px solid var(--text-secondary)' }}>
                  <span style={{ color: '#fff' }}>📝 Download Subtitles (SRT)</span>
               </a>
            </div>

             <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800 }}>
                Verifying Secure Connection... Ad-supported Free Access.
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

      {/* Related Cinematic Entries */}
      <section className="section-wrapper reveal" style={{ marginTop: '80px', paddingBottom: '100px' }}>
         <div className="row-header">
            <h2 className="row-title">Related <span style={{ color: 'var(--accent)' }}>Registry</span> Entries</h2>
         </div>
         <div className="horizontal-carousel no-scrollbar">
            {relatedMovies.map((m, index) => (
               <div key={m.id} style={{ minWidth: '220px' }} className={`reveal reveal-delay-${(index % 5) + 1}`}>
                  <MovieCard movie={m} downloadLink={downloadLink} />
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
