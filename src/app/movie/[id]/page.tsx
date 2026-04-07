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
    </div>
  );
}
