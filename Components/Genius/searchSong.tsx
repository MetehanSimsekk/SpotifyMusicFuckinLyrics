import axios, { AxiosRequestConfig } from 'axios';
import { checkOptions, getTitle } from '../utils';

const searchUrl = 'https://api.genius.com/search?q=';

interface SearchOptions {
  apiKey: string;
  title: string;
  artist: string;
  optimizeQuery?: boolean;
  authHeader?: boolean;
}

async function searchGenius(options: SearchOptions) {
  try {
    checkOptions(options);
    let { apiKey, title, artist, optimizeQuery = false, authHeader = false } = options;
    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const headers = {
      Authorization: 'Bearer ' + apiKey
    };
    const config: AxiosRequestConfig = {
      headers: authHeader ? headers : undefined
    };
    const { data } = await axios.get(authHeader ? reqUrl : `${reqUrl}&access_token=${apiKey}`, config);
    if (data.response.hits.length === 0) return null;
    const results = data.response.hits.map((val: any) => {
      const { full_title, song_art_image_url, id, url } = val.result;
      return { id, title: full_title, albumArt: song_art_image_url, url };
    });
    return results;
  } catch (e) {
    throw e;
  }
}

export default searchGenius;
