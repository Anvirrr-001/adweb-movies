import fs from 'fs';
import path from 'path';
import { Movie, SiteSettings } from './types';
import settingsFallback from './settings.json';
import moviesFallback from './movies.json';

const DATA_PATH = path.join(process.cwd(), 'src/lib/movies.json');
const SETTINGS_PATH = path.join(process.cwd(), 'src/lib/settings.json');

export function getMovies(): Movie[] {
  try {
    const fileData = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.warn("Falling back to movies import bundle");
    return moviesFallback;
  }
}

export function getSettings(): SiteSettings {
  try {
    const fileData = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.warn("Falling back to settings import bundle");
    return settingsFallback as SiteSettings;
  }
}

// These are meant to be used in server components only
export const movies2026 = getMovies();
export const siteSettings = getSettings();
