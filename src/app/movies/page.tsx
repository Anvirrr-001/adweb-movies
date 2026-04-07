import { getMovies } from "@/lib/data";
import MoviesList from "@/components/MoviesList";

export const metadata = {
  title: "Explore Movies | MOVIES2026",
  description: "Browse our extensive database of the latest movie trailers and reviews.",
};

export default function MoviesPage() {
  const allMovies = getMovies();

  return <MoviesList initialMovies={allMovies} />;
}
