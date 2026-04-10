import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export const metadata = {
  title: "About | WatchTrailers — Cinematic Portal 2026",
  description: "Learn about WatchTrailers, the ultimate destination for high-fidelity movie trailers, editorial reviews, and 2026's biggest cinematic releases.",
};

export default function AboutPage() {
  const stats = [
    { value: "30+", label: "Productions Catalogued", icon: "🎬" },
    { value: "4K", label: "Ultra HD Quality", icon: "💎" },
    { value: "100%", label: "Official Trailers", icon: "✅" },
    { value: "2026", label: "Season Focus", icon: "📅" },
  ];

  const features = [
    {
      icon: "🎞️",
      title: "Official Trailers Only",
      desc: "We source exclusively from official studio channels — no leaks, no fan edits. Full HD and 4K quality guaranteed.",
    },
    {
      icon: "⭐",
      title: "Editorial Breakdowns",
      desc: "Every title in our registry gets a professional cinematic breakdown covering story, production design, and cultural impact.",
    },
    {
      icon: "📡",
      title: "Real-Time Release Data",
      desc: "Our archive is updated with precise premiere dates, runtime data, and audience scoring from verified TMDB sources.",
    },
    {
      icon: "🚀",
      title: "Direct High-Speed Access",
      desc: "Premium registry members get instant access to download portals with ad-supported free tier available to all users.",
    },
  ];

  return (
    <div className="home-viewport no-scrollbar">
      {/* Hero Section */}
      <section className="section-wrapper" style={{ paddingTop: "120px", paddingBottom: "80px", textAlign: "center" }}>
        <div className="reveal">
          <div className="hero-label floating" style={{ display: "inline-flex", marginBottom: "24px" }}>
            🎬 The Premier Cinematic Registry
          </div>
          <h1
            className="font-heading"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", marginBottom: "24px", lineHeight: 1.1 }}
          >
            About <span style={{ color: "var(--accent)" }}>WatchTrailers</span>
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "20px",
              maxWidth: "700px",
              margin: "0 auto 48px",
              lineHeight: "1.7",
            }}
          >
            The ultimate destination for everything cinema in 2026. We provide movie enthusiasts with the most
            accurate, high-fidelity information on the biggest blockbusters, indie gems, and every title in between.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link href="/movies" className="btn btn-premium" style={{ padding: "16px 36px" }}>
              <span>🎬 Browse Registry</span>
            </Link>
            <Link href="/" className="btn btn-glass" style={{ padding: "16px 36px" }}>
              <span>🏠 Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="section-wrapper reveal">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className={`glass reveal reveal-delay-${i + 1}`}
              style={{
                padding: "40px 24px",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                border: "1px solid rgba(229,9,20,0.15)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{s.icon}</div>
              <div
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 900,
                  color: "var(--accent)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement Banner */}
      <section className="section-wrapper reveal">
        <div
          className="glass-accent"
          style={{
            padding: "clamp(40px, 6vw, 80px)",
            borderRadius: "var(--radius-lg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="floating" style={{ position: "absolute", right: "40px", top: "20px", fontSize: "140px", opacity: 0.06 }}>
            🎥
          </div>
          <div style={{ position: "relative", zIndex: 10, maxWidth: "700px" }}>
            <div className="hero-label" style={{ marginBottom: "20px" }}>OUR MISSION</div>
            <h2 className="font-heading" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", marginBottom: "24px" }}>
              Democratizing Access to <span style={{ color: "var(--accent)" }}>Cinematic Excellence</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", lineHeight: "1.8" }}>
              From the depths of Pandora in <em>Avatar: Fire and Ash</em> to the multiversal chaos of{" "}
              <em>Avengers: Doomsday</em>, WatchTrailers brings you official trailers, release intelligence, and
              critical editorial insights before anyone else — completely free, ad-supported, and always in the
              highest fidelity available.
            </p>
          </div>
        </div>
      </section>

      {/* Ad Placement */}
      <section className="section-wrapper reveal">
        <AdBanner slot="about-page-mid" format="fluid" />
      </section>

      {/* Features Grid */}
      <section className="section-wrapper reveal">
        <div className="row-header" style={{ marginBottom: "48px" }}>
          <h2 className="row-title">
            Platform <span style={{ color: "var(--accent)" }}>Features</span>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className={`glass reveal reveal-delay-${(i % 4) + 1}`}
              style={{
                padding: "40px 32px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--surface-border)",
                transition: "border-color 0.3s",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>{f.icon}</div>
              <h3 className="font-heading" style={{ fontSize: "22px", marginBottom: "12px" }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "15px" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Disclaimer */}
      <section className="section-wrapper reveal" style={{ paddingBottom: "120px" }}>
        <div
          className="glass"
          style={{
            padding: "48px",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            border: "1px solid var(--surface-border)",
          }}
        >
          <h3 className="font-heading" style={{ fontSize: "24px", marginBottom: "16px", color: "var(--text-muted)" }}>
            Content Notice
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.8" }}>
            WatchTrailers is an entertainment information portal. All trailers are sourced from official YouTube
            channels. Movie data is powered by TMDB. This platform is ad-supported via Adsterra to keep all
            content freely accessible.
          </p>
        </div>
      </section>
    </div>
  );
}

