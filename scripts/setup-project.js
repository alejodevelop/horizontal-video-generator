const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const VIDEO_DIR = path.join(PUBLIC_DIR, 'Video');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'Audio');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'Images');
const MUSIC_DIR = path.join(PUBLIC_DIR, 'Music');

const OUTPUT_CONFIG = path.join(__dirname, '../src/config/project-data.json');

// Helper to get extension
const getExt = (filename) => path.extname(filename).toLowerCase();

// Helper to parse take number from filename (e.g., toma_1.mov -> 1)
const getTakeNumber = (filename) => {
    const match = filename.match(/toma_(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
};

// Helper to parse keywords from image filename (e.g., buffet_warren_money.jpg -> ['warren', 'money'])
const getImageKeywords = (filename) => {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const parts = nameWithoutExt.split('_');
    // We assume the first part is the main name, and the rest are keywords/phrases
    // If the filename is "warren_buffet_2", parts are ["warren", "buffet", "2"]
    // The user said: "nombreImagen_palabra_palabra"
    // "palabra" can be a sequence of words.
    // Let's treat all parts after the first one as potential keywords to match.
    // Actually, maybe we should just treat the whole thing as source of keywords,
    // OR allow specific format. 
    // User Example: "nombreImagen_palabra_palabra" where "palabra" is a word in transcription.

    // Let's take all parts starting from index 1 as keywords.
    // If there is only one part, maybe use that too?

    if (parts.length > 1) {
        // Join all parts after the first one to form a single phrase
        // This ensures "AND" logic (sequence matching) instead of "OR" logic
        return [parts.slice(1).join(' ')];
    }
    return [];
};

function scanFiles() {
    console.log('Scanning project files...');

    // 1. Scan Videos
    const videoFiles = fs.existsSync(VIDEO_DIR) ? fs.readdirSync(VIDEO_DIR) : [];
    const takes = {};

    videoFiles.forEach(file => {
        if (file.startsWith('.')) return;
        const takeNum = getTakeNumber(file);
        if (takeNum !== null) {
            if (!takes[takeNum]) takes[takeNum] = {};
            takes[takeNum].video = `Video/${file}`;
            takes[takeNum].id = takeNum;
        }
    });

    // 2. Scan Audio
    const audioFiles = fs.existsSync(AUDIO_DIR) ? fs.readdirSync(AUDIO_DIR) : [];
    audioFiles.forEach(file => {
        if (file.startsWith('.')) return;
        const takeNum = getTakeNumber(file);
        if (takeNum !== null) {
            if (!takes[takeNum]) takes[takeNum] = { id: takeNum }; // Should usually exist if video exists, but good to be safe
            takes[takeNum].audio = `Audio/${file}`;
        }
    });

    // Convert takes object to array and sort
    const sortedTakes = Object.values(takes).sort((a, b) => a.id - b.id);

    // 3. Scan Images
    const imageFiles = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : [];
    const images = [];
    const imageKeywords = {};

    imageFiles.forEach(file => {
        if (file.startsWith('.')) return;
        const relativePath = `Images/${file}`;
        images.push(relativePath);

        const keywords = getImageKeywords(file);
        if (keywords.length > 0) {
            imageKeywords[relativePath] = keywords;
        }
    });

    // 4. Scan Music
    const musicFiles = fs.existsSync(MUSIC_DIR) ? fs.readdirSync(MUSIC_DIR) : [];
    let backgroundMusic = null;
    if (musicFiles.length > 0) {
        // Just pick the first one for now, or maybe look for 'background' or 'music'
        const musicFile = musicFiles.find(f => !f.startsWith('.'))
        if (musicFile) {
            backgroundMusic = `Music/${musicFile}`;
        }
    }

    const projectData = {
        takes: sortedTakes,
        images,
        imageKeywords,
        backgroundMusic
    };

    console.log(`Found ${sortedTakes.length} takes.`);
    console.log(`Found ${images.length} images.`);
    console.log(`Background music: ${backgroundMusic || 'None'}`);

    fs.writeFileSync(OUTPUT_CONFIG, JSON.stringify(projectData, null, 2));
    console.log(`Configuration saved to ${OUTPUT_CONFIG}`);
}

scanFiles();
