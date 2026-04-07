import { getMovies, Movie } from "@/lib/data";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function HomePage() {
  const allMovies = getMovies();
  
  // Categorize movies
  const featuredMovie = allMovies.find(m => m.id === 2) || allMovies[0]; // Avengers as default hero
  const primeOriginals = allMovies.filter(m => [10, 11, 12, 13, 16, 17].includes(m.id));
  const trendingMovies = allMovies.filter(m => [1, 4, 14, 15, 21].includes(m.id));
  const animationMovies = allMovies.filter((m: Movie) => m.genre_ids.includes(16));
  const latestReviews = [...allMovies].reverse().slice(0, 4);

  if (!featuredMovie) {
    return (
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h1>No movies available. Add some in the Dashbaord!</h1>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Dynamic Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop">
          <img 
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} 
            alt={featuredMovie.title}
            className="hero-img"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content animate-fade-in">
            <span className="badge badge-trending">Trending Now</span>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-overview">{featuredMovie.overview}</p>
            <div className="hero-actions">
              <Link href={`/movie/${featuredMovie.id}`} className="btn btn-primary">
                ▶ Watch Official Trailer
              </Link>
              <Link href={`/movie/${featuredMovie.id}`} className="btn btn-glass">
                Read Full Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container main-content">
        {/* Top Ad Slot */}
        <AdBanner slot="home-top" format="auto" />

        {/* Prime Originals Section */}
        <section className="section-padding">
          <div className="section-header">
            <div>
              <h2 className="text-gradient">Prime Video Originals</h2>
              <p className="text-secondary">Exclusive trailers from Amazon MGM Studios</p>
            </div>
            <Link href="/movies" className="btn btn-outline btn-sm">Explore All</Link>
          </div>
          <div className="movie-grid">
            {primeOriginals.map((movie) => (
              <MovieCard key={movie.id} movie={movie} badge="prime" />
            ))}
          </div>
        </section>

        {/* Middle Ad Slot */}
        <AdBanner slot="home-mid" format="fluid" />

        {/* Trending Section */}
        <section className="section-padding">
          <div className="section-header">
            <div>
              <h2 className="text-gradient">Highly Anticipated</h2>
              <p className="text-secondary">Trailers everyone is talking about</p>
            </div>
          </div>
          <div className="movie-grid">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} badge="trending" />
            ))}
          </div>
        </section>

        {/* Animation Favorites */}
        <section className="section-padding">
          <div className="section-header">
            <div>
              <h2 className="text-gradient">Latest Animation</h2>
              <p className="text-secondary">Fun for the whole family</p>
            </div>
          </div>
          <div className="movie-grid">
            {animationMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <AdBanner slot="home-footer" format="auto" />
      </div>
    </div>
  );
}

function MovieCard({ movie, badge }: { movie: Movie, badge?: 'prime' | 'trending' | 'new' }) {
  return (
    <Link href={`/movie/${movie.id}`} className="movie-card shadow-lg">
      <div className="poster-wrapper">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="play-icon" style={{ 
            fontSize: '2rem', 
            background: '#fff', 
            color: '#000', 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>▶</div>
          <span className="btn btn-primary btn-sm w-full">Watch Trailer</span>
        </div>
        {badge && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <span className={`badge badge-${badge}`}>
              {badge === 'prime' ? 'Prime Original' : badge.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="text-white font-bold">{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.release_date.split('-')[0]}</span>
          <span className="text-gold">★ {movie.vote_average}</span>
        </div>
      </div>
    </Link>
  );
}
