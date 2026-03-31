import { getMovies } from "@/lib/data";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | Manage Movies 2026",
  description: "Secure admin dashboard for managing movie trailers and review articles.",
};

export default function DashboardPage() {
  const movies = getMovies();

  return <DashboardClient initialMovies={movies} />;
}
