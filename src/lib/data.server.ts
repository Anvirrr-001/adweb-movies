import fs from 'fs';
import path from 'path';
import { Movie, SiteSettings } from './types';

const DATA_PATH = path.join(process.cwd(), 'src/lib/movies.json');
const SETTINGS_PATH = path.join(process.cwd(), 'src/lib/settings.json');

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
      adsterra: { 
        enabled: false, 
        direct_link: "",
        scripts: { 
          social_bar: "", 
          popunder: "", 
          native_banner: "",
          home_mid: "",
          archive_bottom: "",
          movie_sidebar_top: "",
          movie_sidebar_bottom: ""
        }, 
        verification_tag: "" 
      },
      site: { title: "MOVIES2026", description: "", ads_txt: "" }
    };
  }
}

// These are meant to be used in server components only
export const movies2026 = getMovies();
export const siteSettings = getSettings();
