const TMDB_API_KEY = process.env.TMDB_API_KEY || "YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";

export async function getUpcomingMovies() {
  // For now, if no key, we use our mock data
  if (TMDB_API_KEY === "YOUR_TMDB_API_KEY") {
    const { movies2026 } = await import("./data");
    return movies2026;
  }

  try {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=2026&sort_by=popularity.desc`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) throw new Error("Failed to fetch TMDB data");
    
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("TMDB error:", error);
    const { movies2026 } = await import("./data");
    return movies2026;
  }
}

export async function getMovieDetails(id: number) {
   if (TMDB_API_KEY === "YOUR_TMDB_API_KEY") {
    const { movies2026 } = await import("./data");
    return movies2026.find(m => m.id === id);
  }

  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error("Failed to fetch movie details");
    
    return await res.json();
  } catch (error) {
    console.error("TMDB error:", error);
    const { movies2026 } = await import("./data");
    return movies2026.find(m => m.id === id);
  }
}
