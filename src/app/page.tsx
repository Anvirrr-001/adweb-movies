import { getMovies, getSettings } from "@/lib/data.server";
import { Movie } from "@/lib/types";
import AdBanner from "@/components/AdBanner";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

export default function HomePage() {
  const allMovies = getMovies();
  const { adsterra } = getSettings();
  
  if (allMovies.length === 0) return null;

  // Curate Content
  const spotlightMovie = allMovies[0];
  const trendingMovies = allMovies.slice(0, 10);
  const mostRatedMovies = [...allMovies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);
  const comingSoonMovies = allMovies.filter(m => new Date(m.release_date) > new Date('2026-06-01')).slice(0, 10);
  const sciFiMovies = allMovies.filter(m => m.genre_ids.includes(878)).slice(0, 10);

  const downloadLink = adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/";

  return (
    <div className="home-viewport no-scrollbar">
      {/* 1. Cinematic Hero Spotlight */}
      <section className="hero-carousel reveal">
        <div className="hero-slide">
          <div className="hero-backdrop">
            <img src={spotlightMovie.backdrop_path} alt={spotlightMovie.title} loading="eager" />
            <div className="hero-glow"></div>
          </div>
          <div className="hero-content">
            <div className="hero-label floating">🔥 Cloudflare Optimized | Most Anticipated Registry Entry</div>
            <h1 className="hero-title">{spotlightMovie.title}</h1>
            <div className="hero-meta">
              <span className="badge badge-premium">★ {spotlightMovie.vote_average} Registry Score</span>
              <span>UHD 4K</span>
              <span>{spotlightMovie.duration}</span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span style={{ color: 'var(--accent)', fontWeight: 800 }}>MAY 2026</span>
            </div>
            <p className="hero-description" style={{ maxWidth: '600px', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px', lineHeight: '1.6' }}>
               {spotlightMovie.overview || "Experience the next chapter in the cinematic multiverse. Direct high-speed download available for premium registry members."}
            </p>
             <div className="hero-cta-stack">
               <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-premium hero-cta-btn hero-cta-watch">
                 <span>▶ Watch Full Movie in 4K</span>
               </a>
               <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-glass hero-cta-btn hero-cta-archive">
                 <span>📥 Download Archive (.MKV)</span>
               </a>
               <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-premium hero-cta-btn hero-cta-fast">
                 <span>⚡ DIRECT DOWNLOAD SERVER (FAST) ⚡</span>
               </a>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Trending Now Row */}
      <section className="section-wrapper reveal">
        <div className="row-header">
          <h2 className="row-title">Trending <span style={{ color: 'var(--accent)' }}>Database</span></h2>
          <Link href="/movies" className="text-secondary" style={{ fontSize: '14px' }}>ACCESS ARCHIVE</Link>
        </div>
        <div className="horizontal-carousel no-scrollbar">
          {trendingMovies.map((movie, index) => (
            <div key={movie.id} style={{ minWidth: '220px' }} className={`reveal reveal-delay-${(index % 5) + 1}`}>
              <MovieCard movie={movie} downloadLink={downloadLink} />
            </div>
          ))}
        </div>
      </section>

      {/* Prominent Download Action Banner */}
      <section className="section-wrapper reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
         <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-premium" style={{ padding: '20px 48px', fontSize: '20px', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(90deg, #19c37d, #0f8554)', boxShadow: '0 8px 30px rgba(25, 195, 125, 0.4)' }}>
           <span>📥 DOWNLOAD TRENDING MOVIES IN 4K</span>
         </a>
      </section>

      {/* 3. Monetized Ad Slot */}
      <section className="section-wrapper">
         <AdBanner slot="home-mid" style={{ margin: '40px 0' }} />
      </section>

      {/* 4. Most Rated (Registry Legends) */}
      <section className="section-wrapper reveal">
        <div className="row-header">
          <h2 className="row-title">Registry <span style={{ color: 'var(--accent)' }}>Legends</span> (Top Rated)</h2>
        </div>
        <div className="horizontal-carousel no-scrollbar">
          {mostRatedMovies.map((movie, index) => (
            <div key={movie.id} style={{ minWidth: '220px' }} className={`reveal reveal-delay-${(index % 5) + 1}`}>
               <MovieCard movie={movie} downloadLink={downloadLink} featured />
            </div>
          ))}
        </div>
      </section>

      {/* Second Download Action Banner */}
      <section className="section-wrapper reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
         <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-premium" style={{ padding: '20px 48px', fontSize: '20px', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(90deg, #ff4d4d, #cc0000)', boxShadow: '0 8px 30px rgba(255, 77, 77, 0.4)' }}>
           <span>▶ WATCH ULTRA HD LEGENDS FREE</span>
         </a>
      </section>

      {/* 5. Genre Spotlight Banner */}
      <section className="section-wrapper reveal">
         <div className="glass-accent" style={{ padding: '60px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: '600px', position: 'relative', zIndex: 10 }}>
               <h2 className="font-heading" style={{ fontSize: '42px', marginBottom: '16px' }}>Into the <span style={{ color: 'var(--accent)' }}>Unknown</span></h2>
               <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '32px' }}>Explore 2026's most anticipated Science Fiction titles in ultra high definition. Decrypt the future of humanity.</p>
               <Link href="/movies?genre=878" className="btn btn-premium">Browse Universe</Link>
            </div>
            <div className="floating" style={{ opacity: 0.1, fontSize: '160px', position: 'absolute', right: '40px', bottom: '-20px' }}>👽</div>
         </div>
      </section>

      {/* 6. Coming Soon Section */}
      <section className="section-wrapper reveal">
        <div className="row-header">
          <h2 className="row-title">Coming <span style={{ color: 'var(--accent)' }}>Soon</span> (Future Releases)</h2>
        </div>
        <div className="horizontal-carousel no-scrollbar">
          {comingSoonMovies.map((movie, index) => (
            <div key={movie.id} style={{ minWidth: '220px' }} className={`reveal reveal-delay-${(index % 5) + 1}`}>
              <MovieCard movie={movie} downloadLink={downloadLink} />
            </div>
          ))}
        </div>
      </section>

      {/* Third Download Action Banner */}
      <section className="section-wrapper reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
         <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ padding: '20px 48px', fontSize: '20px', width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'center', border: '2px solid var(--accent)', color: 'var(--accent)', background: 'rgba(25, 195, 125, 0.1)' }}>
           <span>⚡ DIRECT DOWNLOAD LAUNCHERS</span>
         </a>
      </section>

      {/* 7. Sci-Fi Selection */}
      <section className="section-wrapper reveal">
        <div className="row-header">
          <h2 className="row-title">Sci-Fi <span style={{ color: 'var(--accent)' }}>Anomalies</span></h2>
        </div>
        <div className="horizontal-carousel no-scrollbar">
          {sciFiMovies.map((movie, index) => (
            <div key={movie.id} style={{ minWidth: '220px' }} className={`reveal reveal-delay-${(index % 5) + 1}`}>
              <MovieCard movie={movie} downloadLink={downloadLink} />
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* 8. Bottom CTA Section */}
      <section className="section-wrapper reveal" style={{ padding: '100px 0', textAlign: 'center' }}>
         <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>Ready for High-Fidelity?</h2>
         <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px' }}>Join the premium registry and get instant access to 4K archives and high-speed direct downloads.</p>
         <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href={downloadLink} className="btn btn-premium" style={{ padding: '20px 48px', fontSize: '18px' }}>🚀 ACCESS DATABASE NOW</a>
         </div>
      </section>
    </div>
  );
}
