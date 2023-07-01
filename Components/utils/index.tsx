const checkOptions = (options: { apiKey: string, title: string, artist: string }): void => {
    let { apiKey, title, artist } = options;
    if (!apiKey) {
        throw new Error('"apiKey" property is missing from options');
    } else if (!title) {
        throw new Error('"title" property is missing from options');
    } else if (!artist) {
        throw new Error('"artist" property is missing from options');
    }
};

const getTitle = (title: string, artist: string): string => {
    return `${title} ${artist}`
        .toLowerCase()
        .replace(/ *\([^)]*\) */g, '')
        .replace(/ *\[[^\]]*]/, '')
        .replace(/feat.|ft./g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export { checkOptions, getTitle };
