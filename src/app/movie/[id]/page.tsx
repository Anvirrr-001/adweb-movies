import { getMovies, Movie } from "@/lib/data";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const movies2026 = getMovies();
  return movies2026.map((movie: Movie) => ({
    id: movie.id.toString(),
  }));
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movies2026 = getMovies();
  const movie = movies2026.find(m => m.id === parseInt(id));

  if (!movie) {
    notFound();
  }

  const trailerUrl = movie.trailer_id 
    ? `https://www.youtube.com/embed/${movie.trailer_id}?autoplay=0&rel=0`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.title + ' 2026 Trailer')}`;

  return (
    <div className="details-container">
      {/* Backdrop Hero */}
      <div 
        className="movie-hero" 
        style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')` }}
      ></div>

      <div className="container" style={{ position: 'relative', marginTop: '-200px', zIndex: 10 }}>
        <div className="details-content-wrapper fade-in">
          <div className="left-col">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="details-poster"
            />
          </div>
          
          <div className="right-col">
            <AdBanner slot="movie-detail-top" format="auto" />
            
            <h1 className="title-large text-glow">{movie.title}</h1>
            
            <div className="meta-row">
              <span className="year">{movie.release_date.split('-')[0]}</span>
              <span className="genre-label">Official Trailer</span>
              <span className="rating-badge">★ {movie.vote_average}</span>
            </div>

            <p className="overview-text">{movie.overview}</p>

            <div className="action-row">
              <a href="#trailer" className="btn btn-accent" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '8px' }}>▶</span> Watch Trailer
              </a>
              <button className="btn btn-glass">Mark as Anticipated</button>
            </div>

            <AdBanner slot="movie-detail-content" format="rectangle" />
          </div>
        </div>

        {/* Video Trailer Section */}
        <section id="trailer" className="trailer-section">
          <div className="section-header">
            <h2 className="section-title">Exclusive Trailer Premiere</h2>
            <div className="divider"></div>
          </div>
          
          <div className="video-player-container">
            <div className="video-player">
              <iframe 
                width="100%" 
                height="100%" 
                src={trailerUrl}
                title={`${movie.title} Trailer`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{ borderRadius: '12px' }}
              ></iframe>
            </div>
            
            <div className="trailer-info-bar">
              <div className="info-item">
                <span className="label">Source:</span>
                <span className="value">Official YouTube</span>
              </div>
              <div className="info-item">
                <span className="label">Quality:</span>
                <span className="value">4K Ultra HD</span>
              </div>
              <div className="info-item">
                <span className="label">Category:</span>
                <span className="value">Teaser / Trailer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Review Article Section */}
        {movie.review_content && (
          <section className="review-article-section">
            <div className="article-wrapper">
              <div className="article-header">
                <span className="article-tag">In-Depth Review</span>
                <h2 className="article-title">{movie.title}: Cinematic Breakdown & Analysis</h2>
                <div className="article-meta">
                  <span>By AdWeb Editorial Team</span>
                  <span>•</span>
                  <span>Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="article-content">
                {movie.review_content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="article-footer">
                <div className="verdict">
                  <h4>The Verdict</h4>
                  <p>A must-watch trailer for anyone anticipating the next big cinematic event. The production values and narrative hints suggest a top-tier release.</p>
                </div>
              </div>
            </div>
            
            <div className="sidebar-ads">
              <AdBanner slot="review-sidebar" format="rectangle" />
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .details-container {
          padding-bottom: 5rem;
          background: #0a0a0c;
        }
        .movie-hero {
          height: 75vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .movie-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #0a0a0c, transparent 60%);
        }
        .details-content-wrapper {
          display: flex;
          gap: 4rem;
          background: rgba(20, 20, 25, 0.6);
          backdrop-filter: blur(40px);
          padding: 3rem;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
        }
        .details-poster {
          width: 350px;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.8);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .right-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .title-large {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1;
          letter-spacing: -2px;
        }
        .text-glow {
          color: #fff;
          text-shadow: 0 0 30px rgba(229, 9, 20, 0.3);
        }
        .meta-row {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 2.5rem;
          color: #9ca3af;
          font-size: 1.1rem;
        }
        .rating-badge {
          background: rgba(234, 179, 8, 0.15);
          color: #facc15;
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 800;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }
        .year {
          font-weight: 700;
          color: #fff;
        }
        .overview-text {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #d1d5db;
          margin-bottom: 3rem;
          max-width: 800px;
        }
        .action-row {
          display: flex;
          gap: 1.5rem;
        }
        .btn-accent {
          background: #e50914;
          color: #fff;
          font-size: 1.1rem;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-weight: 700;
          transition: transform 0.2s, background 0.3s;
        }
        .btn-accent:hover {
          background: #ff0f1a;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(229, 9, 20, 0.4);
        }
        .btn-glass {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 1.1rem;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        /* Trailer Section */
        .trailer-section {
          margin-top: 6rem;
        }
        .section-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .divider {
          width: 80px;
          height: 4px;
          background: #e50914;
          margin: 0 auto;
          border-radius: 2px;
        }
        .video-player-container {
          background: #111;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .video-player {
          aspect-ratio: 16/9;
          width: 100%;
        }
        .trailer-info-bar {
          display: flex;
          justify-content: space-around;
          padding: 1.5rem;
          background: #16161a;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .info-item .label {
          font-size: 0.8rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-item .value {
          font-weight: 700;
          color: #fff;
        }

        /* Review Section */
        .review-article-section {
          margin-top: 6rem;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 4rem;
        }
        .article-wrapper {
          background: #16161a;
          padding: 4rem;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.03);
          line-height: 1.8;
        }
        .article-tag {
          color: #e50914;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 0.9rem;
        }
        .article-title {
          font-size: 2.8rem;
          margin: 1rem 0 1.5rem;
          line-height: 1.2;
          font-weight: 800;
        }
        .article-meta {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          margin-bottom: 3rem;
          font-size: 0.95rem;
        }
        .article-content {
          font-size: 1.2rem;
          color: #d1d5db;
        }
        .article-content p {
          margin-bottom: 2rem;
        }
        .article-footer {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .verdict {
          background: rgba(229, 9, 20, 0.05);
          padding: 2.5rem;
          border-radius: 16px;
          border-left: 4px solid #e50914;
        }
        .verdict h4 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        @media (max-width: 1100px) {
          .details-content-wrapper {
            flex-direction: column;
            padding: 2rem;
            align-items: center;
          }
          .details-poster {
            width: 280px;
            margin-top: -100px;
          }
          .right-col {
            align-items: center;
            text-align: center;
          }
          .title-large {
            font-size: 3rem;
          }
          .review-article-section {
            grid-template-columns: 1fr;
          }
          .sidebar-ads {
            display: none;
          }
        }
      ` }} />
    </div>
  );
}
