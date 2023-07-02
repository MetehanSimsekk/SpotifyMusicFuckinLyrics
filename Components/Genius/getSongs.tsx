import searchSong from './searchSong';
import extractLyrics from '../lyricsFolders/extractLyricsImport';
import { checkOptions } from '../lyricsFolders';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 * @returns {Promise<{ id: string, title: string, url: string, lyrics: string, albumArt: string }|null>} - song object or null
 */
export default async function searchAndExtract(options: { apiKey: string, title: string, artist: string, optimizeQuery: boolean }): Promise<{ id: string, title: string, url: string, lyrics: string, albumArt: string } | null> {
    try {
        checkOptions(options);
        let results = await searchSong(options);
        if (!results) return null;
        let lyrics = await extractLyrics(results[0].url);

        // Handle null lyrics value
        if (lyrics === null) {
            // Decide how to handle the null value, e.g., assign a default value
            lyrics = "";
        }

        return {
            id: results[0].id,
            title: results[0].title,
            url: results[0].url,
            lyrics,
            albumArt: results[0].albumArt
        };
    } catch (e) {
        throw e;
    }
}
