'use server';

import { revalidatePath } from 'next/cache';
import { Movie } from './types';
import { getMovies, getSettings } from './data.server';

const DATA_PATH = 'src/lib/movies.json';
const SETTINGS_PATH = 'src/lib/settings.json';

// GitHub API details for production sync - DO NOT hardcode tokens here
const GITHUB_REPO = process.env.GITHUB_REPO || 'Anvirrr-001/adweb-movies';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Universal Sync: Works locally via Git CLI or in production via GitHub API
 */
async function syncToGithub(relativePath: string, content: string, message: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    try {
      // Local development sync using Node.js modules hidden from Turbopack static analysis
      const fs = eval('require("fs")');
      const { execSync } = eval('require("child_process")');
      const path = eval('require("path")');
      
      const absolutePath = path.join(process.cwd(), relativePath);
      fs.writeFileSync(absolutePath, content, 'utf-8');
      
      console.log('Local Environment: Syncing via Git CLI...');
      execSync('git add .');
      execSync(`git commit -m "${message}"`);
      execSync('git push');
      return true;
    } catch (error: any) {
      console.error('Local Sync Error (Expected on Edge):', error.message);
      // Fallback to API if CLI/FS fails
    }
  }

  // Production/Fallback: Sync via GitHub API
  return await syncToGithubAPI(relativePath, content, message);
}

async function syncToGithubAPI(relativePath: string, content: string, message: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is missing.');
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`;

  try {
    // Get current file info (for SHA)
    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });

    let sha = '';
    if (getRes.ok) {
      const fileData: any = await getRes.json();
      sha = fileData.sha;
    }

    // Update file
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        sha: sha || undefined
      })
    });

    if (!putRes.ok) {
      const errorData: any = await putRes.json();
      throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    console.log(`API Sync Successful: ${relativePath}`);
    return true;
  } catch (error: any) {
    console.error('GitHub API Sync Error:', error.message);
    throw new Error(`Database Synchronization Failed: ${error.message}`);
  }
}

export async function addMovie(formData: FormData) {
  try {
    const currentMovies = getMovies();
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
          const data: any = await res.json();
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

    const updatedData = JSON.stringify([...currentMovies, newMovie], null, 2);
    await syncToGithub(DATA_PATH, updatedData, "System: Add movie to registry");

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
    const currentMovies = getMovies();
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
    const updatedData = JSON.stringify(currentMovies, null, 2);
    await syncToGithub(DATA_PATH, updatedData, `System: Edit movie ${id}`);

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
    const currentMovies = getMovies();
    const updatedMovies = currentMovies.filter(m => m.id !== id);
    const updatedData = JSON.stringify(updatedMovies, null, 2);
    await syncToGithub(DATA_PATH, updatedData, `System: Delete movie ${id}`);

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
    const settings = getSettings();
    if (!settings) return { success: false, error: "Settings file not found." };

    settings.adsterra.enabled = formData.get('adsterra_enabled') === 'on';
    settings.adsterra.direct_link = formData.get('adsterra_direct_link') as string;
    settings.adsterra.scripts.social_bar = formData.get('adsterra_social_bar') as string;
    settings.adsterra.scripts.popunder = formData.get('adsterra_popunder') as string;
    settings.adsterra.scripts.native_banner = formData.get('adsterra_native_banner') as string;
    settings.adsterra.scripts.banner_300x250 = formData.get('adsterra_banner_300x250') as string;
    settings.adsterra.verification_tag = formData.get('adsterra_verification') as string;
    settings.site.ads_txt = formData.get('ads_txt') as string;

    const updatedSettings = JSON.stringify(settings, null, 2);
    await syncToGithub(SETTINGS_PATH, updatedSettings, "System: Update site configuration");

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
