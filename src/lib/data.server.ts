import { Movie, SiteSettings } from './types';
import settings from './settings.json';
import movies from './movies.json';

export function getMovies(): Movie[] {
  return movies as Movie[];
}

export function getSettings(): SiteSettings {
  return settings as SiteSettings;
}

// These are meant to be used in server components only
export const movies2026 = getMovies();
export const siteSettings = getSettings();
