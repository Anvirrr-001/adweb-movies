import AdBanner from "@/components/AdBanner";

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
      <h1 className="title-large" style={{ marginBottom: '2rem' }}>About Movie Portal 2026</h1>
      
      <section style={{ marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc' }}>
        <p>
          Welcome to <strong>Movies 2026</strong>, your ultimate destination for everything cinema in the year 2026. 
          Our mission is to provide movie enthusiasts with the most accurate, up-to-date information on upcoming 
          blockbusters, indie gems, and everything in between.
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          From the depths of Pandora in <em>Avatar: Fire and Ash</em> to the multiversal chaos of <em>Avengers: Doomsday</em>, 
          we bring you the latest trailers, release dates, and critical insights before anyone else.
        </p>
      </section>

      <AdBanner slot="about-page-mid" format="fluid" />

      <section style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem' }}>Our Features</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span> 
            High-Definition Official Trailers
          </li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span> 
            Accurate Release Date Countdown
          </li>
          <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span> 
            Detailed Movie Overviews & Cast Info
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span> 
            TMDB Verified Data
          </li>
        </ul>
      </section>

      <div style={{ marginTop: '4rem', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
        <p>This site is for educational purposes and demonstrates a premium movie information portal.</p>
      </div>
    </div>
  );
}
