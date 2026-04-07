import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { siteSettings } from "@/lib/data";

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
  title: "MOVIES2026 | Professional Trailer Portal",
  description: "Experience the future of cinema with high-fidelity movie trailers and in-depth reviews. Prime Originals and 4K streaming previews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adsterra } = siteSettings;

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
      <body className={`${outfit.variable} ${inter.variable} antialiased`}>
        <nav className="navbar">
          <div className="container nav-flex">
            <Link href="/" className="brand">
              <span className="logo-text">ADWEB</span>
              <span className="portal-text">PORTAL</span>
            </Link>
            
            <div className="nav-links">
              <Link href="/" className="nav-item">Premiere</Link>
              <Link href="/movies" className="nav-item">Database</Link>
              <Link href="/dashboard" className="nav-item nav-admin">Control Panel</Link>
            </div>
            
            <button className="mobile-menu-btn">☰</button>
          </div>
        </nav>

        <main className="main-layout">
          {children}
        </main>

        <footer className="footer-professional">
          <div className="container footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span className="logo-text">ADWEB</span>
                <span className="portal-text">PORTAL</span>
              </div>
              <p>The world's leading destination for high-fidelity movie trailers and cinematic reviews.</p>
            </div>
            
            <div className="footer-section">
              <h4>Platform</h4>
              <Link href="/movies">Movie Database</Link>
              <Link href="/">Release Calendar</Link>
              <Link href="/dashboard">Admin Login</Link>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/dmca">Digital Millennium Act</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} ADWEB CINEMATIC. ALL RIGHTS RESERVED. POWERED BY STERRA-SYSTEMS.</p>
            </div>
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
