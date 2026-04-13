import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSettings } from "@/lib/data.server";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import RevealScripts from "@/components/RevealScripts";
import SearchBar from "@/components/SearchBar";
import AdsterraController from "@/components/AdsterraController";

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700", "900"],
  variable: '--font-outfit'
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter'
});

export async function generateMetadata() {
  const { adsterra, site } = getSettings();
  
  const verificationTag = adsterra.enabled && adsterra.verification_tag 
    ? adsterra.verification_tag.match(/content="([^"]+)"/)?.[1] || ""
    : "";

  const title = `${site.title} | Professional Cinematic Portal`;
  const description = site.description;
  const siteUrl = "https://adweb-movies-j34o.vercel.app";
  const ogImage = "/images/frontpage.jpg";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: site.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: site.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    other: verificationTag ? {
      'adsterra-verification': verificationTag
    } : {}
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adsterra, site } = getSettings();

  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable}`}>
        {/* Global Ads execution handled dynamically within AdsterraController below */}
        <SiteSettingsProvider settings={{ adsterra, site }}>
          <RevealScripts />
          <header className="site-header">
            <div className="header-container">
              <Link href="/" className="brand-area">
                <div className="logo-symbol">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="brand-name">Watch<span>Trailers</span></span>
              </Link>

              <SearchBar />

              <nav className="header-nav">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/movies" className="nav-link">All Films</Link>
                <Link href="/movies?genre=28" className="nav-link">Action</Link>
                <Link href="/movies?genre=878" className="nav-link">Sci-Fi</Link>
                <Link href="/movies?genre=27" className="nav-link">Horror</Link>
                <Link href="/about" className="nav-link">About</Link>
              </nav>
            </div>
          </header>

          <main className="main-viewport" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            {children}
          </main>

          <footer className="footer-premium glass" style={{ marginTop: '100px', borderTop: '1px solid var(--surface-border)' }}>
            <div className="section-wrapper" style={{ padding: '80px 40px', textAlign: 'center' }}>
              <div className="brand-area" style={{ justifyContent: 'center', marginBottom: '32px' }}>
                 <div className="logo-symbol" style={{ width: '36px', height: '36px' }}>
                    <svg viewBox="0 0 24 24" style={{ width: '18px' }}><path d="M8 5v14l11-7z"/></svg>
                 </div>
                 <span className="brand-name" style={{ fontSize: '20px' }}>WatchTrailers</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px', fontSize: '15px' }}>
                The ultimate destination for cinematic excellence. Stay ahead with official trailers, 
                in-depth breakdowns, and high-fidelity streaming alerts for 2026's biggest releases.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '48px' }}>
                 <Link href="/" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none', fontWeight: 700 }}>Home</Link>
                 <Link href="/movies" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none', fontWeight: 700 }}>All Movies</Link>
                 <Link href="/dashboard" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none', fontWeight: 700 }}>Monetization</Link>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px' }}>
                &copy; {new Date().getFullYear()} WATCHTRAILERS ENTERTAINMENT. PARTNERED WITH ADSTERRA.
              </p>
            </div>
          </footer>

          <AdsterraController />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
