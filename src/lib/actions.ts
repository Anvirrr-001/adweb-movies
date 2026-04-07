'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Movie } from './data';

const DATA_PATH = path.join(process.cwd(), 'src/lib/movies.json');

const SETTINGS_PATH = path.join(process.cwd(), 'src/lib/settings.json');

function readData(): Movie[] {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeData(data: Movie[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
  } catch (e) {
    return null;
  }
}

function writeSettings(settings: any) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function addMovie(formData: FormData) {
  const currentMovies = readData();
  const nextId = Math.max(...currentMovies.map(m => m.id), 0) + 1;

  const youtubeLink = formData.get('youtube_link') as string;
  const trailerId = extractYoutubeId(youtubeLink);

  const newMovie: Movie = {
    id: nextId,
    title: formData.get('title') as string,
    poster_path: formData.get('poster_path') as string || "/placeholder.jpg",
    backdrop_path: formData.get('backdrop_path') as string || "/placeholder.jpg",
    release_date: formData.get('release_date') as string,
    vote_average: parseFloat(formData.get('vote_average') as string) || 0,
    overview: formData.get('overview') as string,
    genre_ids: [28], // Default to action for now
    trailer_id: trailerId,
    review_content: formData.get('review_content') as string,
  };

  writeData([...currentMovies, newMovie]);
  revalidatePath('/');
  revalidatePath('/movies');
  revalidatePath('/dashboard');
}

export async function editMovie(id: number, formData: FormData) {
  const currentMovies = readData();
  const index = currentMovies.findIndex(m => m.id === id);
  if (index === -1) return;

  const youtubeLink = formData.get('youtube_link') as string;
  const trailerId = extractYoutubeId(youtubeLink) || currentMovies[index].trailer_id;

  const updatedMovie: Movie = {
    ...currentMovies[index],
    title: formData.get('title') as string,
    poster_path: formData.get('poster_path') as string,
    backdrop_path: formData.get('backdrop_path') as string,
    release_date: formData.get('release_date') as string,
    vote_average: parseFloat(formData.get('vote_average') as string),
    overview: formData.get('overview') as string,
    trailer_id: trailerId,
    review_content: formData.get('review_content') as string,
  };

  currentMovies[index] = updatedMovie;
  writeData(currentMovies);
  
  revalidatePath(`/movie/${id}`);
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function deleteMovie(id: number) {
  const currentMovies = readData();
  const updatedMovies = currentMovies.filter(m => m.id !== id);
  writeData(updatedMovies);
  
  revalidatePath('/');
  revalidatePath('/movies');
  revalidatePath('/dashboard');
}

export async function updateSettings(formData: FormData) {
  const settings = readSettings();
  if (!settings) return;

  settings.adsterra.enabled = formData.get('adsterra_enabled') === 'on';
  settings.adsterra.scripts.social_bar = formData.get('adsterra_social_bar') as string;
  settings.adsterra.scripts.popunder = formData.get('adsterra_popunder') as string;
  settings.adsterra.verification_tag = formData.get('adsterra_verification') as string;
  settings.site.ads_txt = formData.get('ads_txt') as string;

  writeSettings(settings);
  revalidatePath('/');
  revalidatePath('/movies');
  revalidatePath('/dashboard');
}

function extractYoutubeId(url: string): string | undefined {
  if (!url) return undefined;
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url; // Assume it's already an ID
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : undefined;
}
