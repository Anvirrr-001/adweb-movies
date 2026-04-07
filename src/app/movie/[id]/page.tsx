import { getMovies, Movie } from "@/lib/data";
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

  const trailerUrl = movie.trailer_id && movie.trailer_id !== 'placeholder'
    ? `https://www.youtube.com/embed/${movie.trailer_id}?autoplay=0&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.title + ' Official Trailer')}`;

  return (
    <div className="details-page">
      {/* Immersive Hero Header */}
      <section className="movie-hero">
        <div className="hero-backdrop">
          <img 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
            alt={movie.title}
            className="hero-img"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <div className="meta-badges">
              <span className="badge badge-prime">Prime Video</span>
              <span className="badge badge-trending">4K Ultra HD</span>
            </div>
            <h1 className="movie-title-large text-gradient">{movie.title}</h1>
            <div className="movie-meta-chips">
              <span className="chip">{movie.release_date.split('-')[0]}</span>
              <span className="chip">•</span>
              <span className="chip gold-text">★ {movie.vote_average} Rating</span>
              <span className="chip">•</span>
              <span className="chip">Official Review</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container main-content">
        <div className="details-layout">
          {/* Main Content Area */}
          <div className="primary-content">
            {/* Trailer Section */}
            <section id="trailer" className="section-card">
              <div className="section-heading-row">
                <h2 className="text-gradient">Streaming Premiere</h2>
                <div className="quality-indicator">Available in 2160p</div>
              </div>
              
              <div className="video-aspect-container">
                <iframe 
                  src={trailerUrl}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="player-footer">
                <div className="source-info">
                  <span className="label">OFFICIAL SOURCE</span>
                  <span className="value">Prime Video YouTube</span>
                </div>
                <div className="action-btns">
                  <button className="btn btn-glass btn-icon">Share</button>
                  <button className="btn btn-primary">Watch on Prime</button>
                </div>
              </div>
            </section>

            {/* Ad Slot */}
            <AdBanner slot="movie-detail-mid" format="auto" />

            {/* Editorial Review Section */}
            {movie.review_content && (
              <section className="editorial-section">
                <div className="editorial-header">
                  <span className="accent-text">EDITORIAL BREAKDOWN</span>
                  <h2>Why We Recommend {movie.title}</h2>
                </div>
                
                <article className="editorial-body">
                  {movie.review_content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  
                  <div className="verdict-card">
                    <h3>The Verdict</h3>
                    <p>{movie.overview}</p>
                    <div className="final-rating">
                      <span className="label">PORTAL SCORE</span>
                      <span className="value">{movie.vote_average}/10</span>
                    </div>
                  </div>
                </article>
              </section>
            )}
          </div>

          {/* Sidebar Area */}
          <aside className="sidebar">
            <div className="sidebar-sticky">
              <AdBanner slot="detail-sidebar" format="rectangle" />
              
              <div className="poster-card card-premium">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="poster-info">
                  <span className="label">RELEASE DATE</span>
                  <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
              </div>

              <AdBanner slot="detail-sidebar-bottom" format="rectangle" />
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .details-page { padding-bottom: 5rem; }
        .movie-hero {
          position: relative;
          height: 60vh;
          display: flex;
          align-items: center;
          margin-top: -80px;
        }
        .hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
        .hero-img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--background) 0%, rgba(6,6,8,0.3) 100%);
        }
        .movie-title-large {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          margin: 1rem 0;
        }
        .meta-badges { display: flex; gap: 0.8rem; }
        .movie-meta-chips {
          display: flex;
          gap: 1rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .gold-text { color: var(--gold); }
        
        .details-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
          margin-top: -8rem;
          position: relative;
          z-index: 20;
        }
        .section-card {
          background: var(--surface);
          border: 1px solid var(--surface-border);
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .section-heading-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .quality-indicator {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border: 1px solid var(--accent);
          color: var(--accent);
          border-radius: 4px;
        }
        .video-aspect-container {
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        iframe { width: 100%; height: 100%; border: none; }
        
        .player-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .source-info .label {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .source-info .value { font-weight: 700; font-size: 0.9rem; }
        .action-btns { display: flex; gap: 1rem; }

        .editorial-section {
          background: var(--surface);
          border-radius: 24px;
          padding: 3rem;
          border: 1px solid var(--surface-border);
        }
        .editorial-header { margin-bottom: 2.5rem; }
        .editorial-header h2 { font-size: 2.2rem; margin-top: 0.5rem; }
        .accent-text { color: var(--accent); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
        .editorial-body { font-size: 1.2rem; color: #d1d5db; line-height: 1.8; }
        .editorial-body p { margin-bottom: 2rem; }
        
        .verdict-card {
          background: #16161a;
          padding: 2.5rem;
          border-radius: 20px;
          border-left: 4px solid var(--accent);
        }
        .verdict-card h3 { margin-bottom: 1rem; }
        .final-rating { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .final-rating .label { color: var(--text-muted); font-size: 0.8rem; font-weight: 800; }
        .final-rating .value { font-size: 1.5rem; font-weight: 900; margin-left: 1rem; }

        .sidebar-sticky { position: sticky; top: 100px; }
        .poster-card { margin-top: 2rem; }
        .poster-card img { width: 100%; display: block; }
        .poster-info { padding: 1.5rem; border-top: 1px solid var(--surface-border); }
        .poster-info .label { font-size: 0.7rem; color: var(--text-muted); font-weight: 800; }
        .poster-info p { font-weight: 700; margin-top: 0.3rem; }

        @media (max-width: 1024px) {
          .details-layout { grid-template-columns: 1fr; }
          .sidebar { order: -1; }
          .sidebar-sticky { position: relative; top: 0; }
          .poster-card { display: none; }
        }
        @media (max-width: 768px) {
          .movie-hero { height: 50vh; }
          .editorial-section { padding: 1.5rem; }
          .player-footer { flex-direction: column; gap: 1.5rem; align-items: flex-start; }
          .action-btns { width: 100%; }
          .action-btns .btn { flex: 1; }
        }
      `}</style>
    </div>
  );
}
