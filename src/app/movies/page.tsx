import { getMovies, getSettings } from "@/lib/data.server";
import MoviesList from "@/components/MoviesList";

export const metadata = {
  title: "Explore Movies | WatchTrailers",
  description: "Browse our extensive database of the latest movie trailers and reviews.",
};

import { Suspense } from "react";

export default function MoviesPage() {
  const allMovies = getMovies();
  const { adsterra } = getSettings();
  const downloadLink = adsterra.enabled && adsterra.direct_link ? adsterra.direct_link : "/";

  return (
    <Suspense fallback={<div className="section-wrapper" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Registry...</div>}>
      <MoviesList
        initialMovies={allMovies}
        downloadLink={downloadLink}
      />
    </Suspense>
  );
}
