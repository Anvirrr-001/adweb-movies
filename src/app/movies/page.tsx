import { getMovies, getSettings } from "@/lib/data.server";
import MoviesList from "@/components/MoviesList";

export const metadata = {
  title: "Explore Movies | MOVIES2026",
  description: "Browse our extensive database of the latest movie trailers and reviews.",
};

interface MoviesPageProps {
  searchParams: Promise<{ q?: string; genre?: string }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { q, genre } = await searchParams;
  const allMovies = getMovies();
  const { adsterra } = getSettings();
  const downloadLink = adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/";

  return (
    <MoviesList
      initialMovies={allMovies}
      downloadLink={downloadLink}
      initialQuery={q || ""}
      initialGenre={genre ? parseInt(genre) : null}
    />
  );
}
