import fs from 'fs';
import path from 'path';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  trailer_id?: string;
  review_content?: string;
}

const DATA_PATH = path.join(process.cwd(), 'src/lib/movies.json');

const SETTINGS_PATH = path.join(process.cwd(), 'src/lib/settings.json');

export interface SiteSettings {
  adsterra: {
    enabled: boolean;
    scripts: {
      social_bar: string;
      popunder: string;
      native_banner: string;
    },
    verification_tag: string;
  };
  site: {
    title: string;
    description: string;
    ads_txt: string;
  };
}

export function getMovies(): Movie[] {
  try {
    const fileData = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading movies.json:", error);
    return [];
  }
}

export function getSettings(): SiteSettings {
  try {
    const fileData = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading settings.json:", error);
    return {
      adsterra: { enabled: false, scripts: { social_bar: "", popunder: "", native_banner: "" }, verification_tag: "" },
      site: { title: "MOVIES2026", description: "", ads_txt: "" }
    };
  }
}

export const movies2026: Movie[] = getMovies();
export const siteSettings: SiteSettings = getSettings();
