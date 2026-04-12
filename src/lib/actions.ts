'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Movie } from './types';
import { execSync } from 'child_process';

const DATA_PATH = path.join(process.cwd(), 'src/lib/movies.json');
const SETTINGS_PATH = path.join(process.cwd(), 'src/lib/settings.json');

// Helper to run git commands
async function syncToGithub() {
  try {
    // Check if there are changes to commit
    const status = execSync('git status --porcelain').toString();
    if (!status) return true; // Nothing to commit

    execSync('git add .');
    execSync('git commit -m "System: Update content registry"');
    execSync('git push');
    return true;
  } catch (error: any) {
    console.error('Git synchronization error:', error.message);
    throw new Error(`Git Push Failed: ${error.message}`);
  }
}

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
  try {
    const currentMovies = readData();
    const nextId = Math.max(...currentMovies.map(m => m.id), 0) + 1;

    const youtubeLink = formData.get('youtube_link') as string;
    const videoId = extractYoutubeId(youtubeLink);
    
    if (!videoId) {
      return { success: false, error: "Invalid YouTube URL provided." };
    }

    const posterPath = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    let title = formData.get('title') as string;
    if (!title) {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (res.ok) {
          const data = await res.json();
          title = data.title;
        }
      } catch(e) {}
    }
    if (!title) title = "New Movie Entry";

    const newMovie: Movie = {
      id: nextId,
      title: title,
      poster_path: posterPath,
      backdrop_path: posterPath,
      release_date: new Date().toISOString().split('T')[0],
      vote_average: 8.5,
      overview: "Cinematic production added via System Dashboard.",
      genre_ids: [28], 
      trailer_id: videoId,
      review_content: "Professional cinematic breakdown incoming.",
      quality: "UHD 4K",
      duration: "140m",
    };

    writeData([...currentMovies, newMovie]);
    
    // Sync to Git
    await syncToGithub();

    revalidatePath('/');
    revalidatePath('/movies');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editMovie(id: number, formData: FormData) {
  try {
    const currentMovies = readData();
    const index = currentMovies.findIndex(m => m.id === id);
    if (index === -1) return { success: false, error: "Movie not found." };

    const youtubeLink = formData.get('youtube_link') as string;
    const videoId = extractYoutubeId(youtubeLink) || currentMovies[index].trailer_id;
    
    const posterPath = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    let title = formData.get('title') as string;
    if (!title) title = currentMovies[index].title;

    const updatedMovie: Movie = {
      ...currentMovies[index],
      title: title,
      poster_path: posterPath,
      backdrop_path: posterPath,
      trailer_id: videoId,
    };

    currentMovies[index] = updatedMovie;
    writeData(currentMovies);
    
    // Sync to Git
    await syncToGithub();

    revalidatePath(`/movie/${id}`);
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMovie(id: number) {
  try {
    const currentMovies = readData();
    const updatedMovies = currentMovies.filter(m => m.id !== id);
    writeData(updatedMovies);
    
    await syncToGithub();

    revalidatePath('/');
    revalidatePath('/movies');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const settings = readSettings();
    if (!settings) return { success: false, error: "Settings file not found." };

    settings.adsterra.enabled = formData.get('adsterra_enabled') === 'on';
    settings.adsterra.direct_link = formData.get('adsterra_direct_link') as string;
    settings.adsterra.scripts.social_bar = formData.get('adsterra_social_bar') as string;
    settings.adsterra.scripts.popunder = formData.get('adsterra_popunder') as string;
    settings.adsterra.scripts.native_banner = formData.get('adsterra_native_banner') as string;
    settings.adsterra.scripts.banner_300x250 = formData.get('adsterra_banner_300x250') as string;
    settings.adsterra.verification_tag = formData.get('adsterra_verification') as string;
    settings.site.ads_txt = formData.get('ads_txt') as string;

    writeSettings(settings);
    
    await syncToGithub();

    revalidatePath('/');
    revalidatePath('/movies');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function extractYoutubeId(url: string): string | undefined {
  if (!url) return undefined;
  if (url.length === 11) return url; // Already an ID
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : undefined;
}
