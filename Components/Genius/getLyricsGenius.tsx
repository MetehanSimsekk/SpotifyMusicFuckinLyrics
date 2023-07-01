const searchSong = require('./searchSong');
const { checkOptions } = require('./utils');
const extractLyrics = require('./utils/extractLyrics');
/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 * @returns {Promise<string|null>} - lyrics string or null
 */
export default async function searchLyrics(arg: { apiKey: string, title: string, artist: string, optimizeQuery: boolean } | string): Promise<string | null> {
    try {
        if (arg && typeof arg === 'string') {
            let lyrics = await extractLyrics(arg);
            return lyrics;
        } else if (typeof arg === 'object') {
            checkOptions(arg);
            let results = await searchSong(arg);
            if (!results) return null;
            let lyrics = await extractLyrics(results[0].url);
            return lyrics;
        } else {
            throw new Error('Invalid argument');
        }
    } catch (e) {
        throw e;
    }
}
