import axios from 'axios';
import cheerio from 'cheerio-without-node-native';

/**
 * @param {string} url - Genius URL
 * @returns {Promise<string|null>} - lyrics string or null
 */
export default async function fetchLyrics(url: string): Promise<string | null> {
    try {
        let { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let lyrics = $('div[class="lyrics"]').text().trim();
        
        if (!lyrics) {
            lyrics = '';
            let foundLyrics = false; // Sınırlayıcı
            $('div[class^="Lyrics__Container"]').each((i: any, elem: any) => {
                if ($(elem).text().length !== 0 && i !== 0) {
                    let snippet = $(elem)
                        .html()
                        .replace(/<br>/g, '\n')
                        .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                    
                    const regex = /\[[^\]]+\]/g;
                    snippet = snippet.replace(regex, '');
                    
                    if (snippet.trim().length > 0) {
                        lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
                        foundLyrics = true; // Şarkı sözleri bulundu
                    }
                }
                
                if (foundLyrics) {
                    return false; // Döngüyü durdur
                }
            });
        }
        
        if (!lyrics) return null;
        return lyrics.trim();
    } catch (e) {
        throw e;
    }
}
