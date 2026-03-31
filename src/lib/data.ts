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

export function getMovies(): Movie[] {
  try {
    const fileData = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading movies.json:", error);
    return [];
  }
}

// For compatibility with existing imports
export const movies2026: Movie[] = getMovies();
