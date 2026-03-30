import { movies2026 } from "@/lib/data";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = movies2026.find(m => m.id === parseInt(id));

  if (!movie) {
    notFound();
  }

  return (
    <div className="details-container">
      {/* Backdrop Hero */}
      <div 
        className="movie-hero" 
        style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')` }}
      >
      </div>

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
                <span style={{ marginRight: '8px' }}>▶</span> Play Trailer
              </a>
              <button className="btn btn-glass">Add to Watchlist</button>
            </div>

            <AdBanner slot="movie-detail-content" format="rectangle" />
          </div>
        </div>

        {/* Video Trailer Section */}
        <section id="trailer" className="trailer-section">
          <h2 className="section-title">Official Trailer - {movie.title}</h2>
          <div className="video-player">
            <div className="player-inner" style={{ width: '100%', height: '100%' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.title + ' 2026 Trailer')}`}
                title={`${movie.title} Trailer`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{ borderRadius: '20px' }}
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .details-container {
          padding-bottom: 5rem;
        }
        .movie-hero {
          height: 70vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .movie-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--background), transparent 70%);
        }
        .details-content-wrapper {
          display: flex;
          gap: 3rem;
          background: rgba(10, 10, 12, 0.7);
          backdrop-filter: blur(20px);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .details-poster {
          width: 320px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          position: sticky;
          top: 100px;
        }
        .right-col {
          flex: 1;
        }
        .title-large {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .text-glow {
          text-shadow: 0 0 20px var(--accent-glow);
        }
        .meta-row {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 2rem;
          color: #a0a0a5;
        }
        .rating-badge {
          background: rgba(255, 204, 0, 0.1);
          color: #ffcc00;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          border: 1px solid rgba(255, 204, 0, 0.2);
        }
        .year {
          font-weight: 600;
        }
        .overview-text {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #ccc;
          margin-bottom: 2.5rem;
        }
        .action-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .btn-accent {
          background: var(--accent);
          color: #fff;
        }
        .btn-glass {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .trailer-section {
          margin-top: 5rem;
        }
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }
        .video-player {
          width: 100%;
          aspect-ratio: 16/9;
          background: #111;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #1a1a1e;
        }

        @media (max-width: 900px) {
          .details-content-wrapper {
            flex-direction: column;
            gap: 2rem;
            padding: 1.5rem;
            margin-top: -100px;
          }
          .details-poster {
            width: 200px;
            margin-top: -150px;
            position: relative;
            top: 0;
          }
          .title-large {
            font-size: 2.5rem;
          }
        }
      ` }} />
    </div>
  );
}
