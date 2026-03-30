import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movies 2026 | New Releases & Reviews",
  description: "Explore the latest 2026 movie releases, official trailers, and exclusive reviews. Stay updated with the newest cinema trends.",
  keywords: ["Movies 2026", "Latest Trailers", "Movie Reviews", "Upcoming Cinema"],
  authors: [{ name: "AdWeb Movie Portal" }],
  openGraph: {
    title: "Movies 2026 | New Releases & Reviews",
    description: "Your ultimate portal for 2026 cinema releases and trailers.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Global Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" 
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <header className="glass-nav">
          <div className="container nav-content">
            <h1 className="logo">MOVIES<span>2026</span></h1>
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/movies">Movies</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>{children}</main>

        <footer className="footer-premium">
          <div className="container">
            <p>&copy; 2026 AdWeb Movie Portal. All movie data provided by TMDB. This is a review platform for entertainment purposes.</p>
          </div>
        </footer>
        
        <style dangerouslySetInnerHTML={{ __html: `
          .glass-nav {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            background: rgba(10, 10, 12, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 1rem 0;
          }
          .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #fff;
          }
          .logo span {
            color: var(--accent, #e50914);
          }
          nav ul {
            display: flex;
            gap: 2rem;
            list-style: none;
          }
          nav a {
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.3s ease;
            color: #a0a0a5;
          }
          nav a:hover {
            color: #fff;
          }
          main {
            padding-top: 5rem;
            min-height: calc(100vh - 100px);
          }
          .footer-premium {
            padding: 3rem 0;
            background: #050507;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 5rem;
            text-align: center;
            color: #555;
            font-size: 0.8rem;
          }
        ` }} />
      </body>
    </html>
  );
}
