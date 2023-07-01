import axios from 'axios';
import extractLyrics from '../utils/extractLyricsImport';

const url = 'https://api.genius.com/songs/';

interface Song {
  id: number;
  full_title: string;
  url: string;
  song_art_image_url: string;
}

/**
 * @param {(number|string)} id
 * @param {string} apiKey
 * @returns {Promise<{ id: number, title: string, url: string, lyrics: string | null, albumArt: string }>} - song object
 */
export default async function getSong(id: number | string, apiKey: string): Promise<{ id: number, title: string, url: string, lyrics: string | null, albumArt: string }> {
  if (!id) throw new Error('No id was provided');
  if (!apiKey) throw new Error('No apiKey was provided');
  try {
    const response = await axios.get(`${url}${id}?access_token=${apiKey}`);
    const { song }: { song: Song } = response.data.response;
    const lyrics = await extractLyrics(song.url);
    return {
      id: song.id,
      title: song.full_title,
      url: song.url,
      lyrics: lyrics || null,
      albumArt: song.song_art_image_url
    };
  } catch (e) {
    throw e;
  }
}
