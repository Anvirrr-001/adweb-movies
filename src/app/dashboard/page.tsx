import { getMovies, Movie } from "@/lib/data";
import { addMovie, editMovie, deleteMovie } from "@/lib/actions";
import Link from "next/link";

export default function DashboardPage() {
  const movies = getMovies();

  return (
    <div className="dashboard-container">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <h1 className="title-large">Admin Dashboard</h1>
            <p className="text-secondary">Manage your movie portal and trailer database.</p>
          </div>
          <Link href="/" className="btn btn-glass">Back to Site</Link>
        </header>

        <div className="dashboard-grid">
          {/* Add Movie Form */}
          <section className="form-card card-premium">
            <h2 className="section-title">Add New Movie</h2>
            <form action={addMovie} className="movie-form">
              <div className="form-group">
                <label>Movie Title</label>
                <input name="title" required placeholder="e.g. Inception 2" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Release Date</label>
                  <input name="release_date" type="date" required />
                </div>
                <div className="form-group">
                  <label>Rating (0-10)</label>
                  <input name="vote_average" type="number" step="0.1" defaultValue="8.5" />
                </div>
              </div>
              <div className="form-group">
                <label>Official YouTube Trailer Link</label>
                <input name="youtube_link" required placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Poster Path (URL or local path)</label>
                  <input name="poster_path" placeholder="/poster.jpg" />
                </div>
                <div className="form-group">
                  <label>Backdrop Path</label>
                  <input name="backdrop_path" placeholder="/backdrop.jpg" />
                </div>
              </div>
              <div className="form-group">
                <label>Brief Overview</label>
                <textarea name="overview" rows={3} required placeholder="What is this movie about?"></textarea>
              </div>
              <div className="form-group">
                <label>Review Article Content</label>
                <textarea name="review_content" rows={5} placeholder="Detailed trailer breakdown and analysis for the review section..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full">Save Movie to Database</button>
            </form>
          </section>

          {/* Movie List Management */}
          <section className="list-card card-premium">
            <h2 className="section-title">Manage Existing Movies ({movies.length})</h2>
            <div className="movies-table-wrapper">
              <table className="movies-table">
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Date</th>
                    <th className="action-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(movie => (
                    <tr key={movie.id}>
                      <td>
                        <div className="movie-cell">
                          <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="" width={40} height={60} />
                          <span>{movie.title}</span>
                        </div>
                      </td>
                      <td>{movie.release_date.split('-')[0]}</td>
                      <td className="action-col">
                        <div className="action-btns">
                          <Link href={`/movie/${movie.id}`} className="mini-btn">View</Link>
                          <form action={async () => { 'use server'; await deleteMovie(movie.id); }}>
                            <button type="submit" className="mini-btn btn-danger">Delete</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          padding: 3rem 0;
          background: #0a0a0c;
          min-height: 100vh;
          color: #fff;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .text-secondary {
          color: #6b7280;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
        }
        .card-premium {
          background: #16161a;
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          font-weight: 800;
        }
        .movie-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #9ca3af;
        }
        input, textarea {
          background: #0a0a0c;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        input:focus, textarea:focus {
          border-color: #e50914;
          outline: none;
        }
        .btn-primary {
          background: #e50914;
          color: #fff;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 700;
          transition: opacity 0.3s;
        }
        .btn-primary:hover {
          opacity: 0.9;
        }
        .w-full {
          width: 100%;
        }

        /* Table Styles */
        .movies-table-wrapper {
          overflow-x: auto;
        }
        .movies-table {
          width: 100%;
          border-collapse: collapse;
        }
        .movies-table th {
          text-align: left;
          color: #6b7280;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        .movies-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .movie-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
        }
        .movie-cell img {
          border-radius: 4px;
        }
        .action-btns {
          display: flex;
          gap: 0.5rem;
        }
        .mini-btn {
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
        }
        .btn-danger:hover {
          background: rgba(229, 9, 20, 0.2);
          border-color: #e50914;
          color: #e50914;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  );
}
