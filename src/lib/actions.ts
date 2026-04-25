
// import { revalidatePath } from 'next/cache'; // Disabled for static export compatibility
import { Movie } from './types';
import { getMovies, getSettings } from './data.server';

const DATA_PATH = 'src/lib/movies.json';
const SETTINGS_PATH = 'src/lib/settings.json';

// GitHub API details for production sync
// NEXT_PUBLIC_ prefix would be needed for these to be available on the client
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || process.env.GITHUB_REPO || 'Anvirrr-001/adweb-movies';
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

/**
 * Universal Sync: Works via GitHub API
 */
async function syncToGithub(relativePath: string, content: string, message: string) {
  return await syncToGithubAPI(relativePath, content, message);
}

async function syncToGithubAPI(relativePath: string, content: string, message: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is missing. If running on client, use NEXT_PUBLIC_GITHUB_TOKEN.');
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`;

  try {
    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });

    let sha = '';
    if (getRes.ok) {
      const fileData: any = await getRes.json();
      sha = fileData.sha;
    }

    // Browser-compatible base64 encoding
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: base64Content,
        sha: sha || undefined
      })
    });

    if (!putRes.ok) {
      const errorData: any = await putRes.json();
      throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    return true;
  } catch (error: any) {
    throw new Error(`Database Synchronization Failed: ${error.message}`);
  }
}

// Helper to safely call revalidatePath
function safeRevalidate(path: string) {
  // revalidatePath is not available in client or static export
  // in local dev with next dev, we could potentially use it if we kept 'use server'
  // but for static export we omit it.
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

