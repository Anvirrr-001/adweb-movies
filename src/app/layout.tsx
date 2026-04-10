import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSettings } from "@/lib/data.server";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700", "900"],
  variable: '--font-outfit'
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter'
});

export const metadata = {
  title: "MOVIES2026 | Professional Cinematic Portal",
  description: "Experience the future of cinema with high-fidelity movie trailers, 4K streaming previews, and official editorial reviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adsterra, site } = getSettings();

  return (
    <html lang="en">
      <head>
        {/* Adsterra Verification */}
        {adsterra.enabled && adsterra.verification_tag && (
          <div dangerouslySetInnerHTML={{ __html: adsterra.verification_tag }} />
        )}
        
        {/* Adsterra Popunder */}
        {adsterra.enabled && adsterra.scripts.popunder && (
          <div dangerouslySetInnerHTML={{ __html: adsterra.scripts.popunder }} />
        )}
      </head>
      <body className={`${outfit.variable} ${inter.variable}`}>
        <header className="site-header">
          <div className="header-container">
            <Link href="/" className="brand-area">
              <div className="logo-symbol">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span className="brand-name">Watch<span>Trailers</span></span>
            </Link>

            <div className="search-unit">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search movies, trailers..." className="search-input" />
            </div>

            <div className="user-actions">
              <Link href="/dashboard" className="login-link">
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="main-viewport" style={{ paddingTop: '80px', minHeight: '80vh' }}>
          <SiteSettingsProvider settings={{ adsterra, site }}>
            {children}
          </SiteSettingsProvider>
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

        {/* Adsterra Social Bar */}
        {adsterra.enabled && adsterra.scripts.social_bar && (
          <div dangerouslySetInnerHTML={{ __html: adsterra.scripts.social_bar }} />
        )}
      </body>
    </html>
  );
}
