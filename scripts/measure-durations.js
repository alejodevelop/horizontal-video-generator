const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directory
const audioDir = path.join(__dirname, '..', 'public', 'Audio');
const outputFile = path.join(__dirname, '..', 'src', 'config', 'durations.json');

// Audio files
const audioFiles = [
    'toma_1.m4a',
    'toma_2.m4a',
    'toma_3.m4a',
    'toma_4.m4a',
    'toma_5.m4a',
    'toma_6.m4a',
    'toma_7.m4a',
];

console.log('Measuring audio durations with ffprobe...\n');

const durations = [];

audioFiles.forEach((file, index) => {
    const filePath = path.join(audioDir, file);

    try {
        const output = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
            { encoding: 'utf8' }
        );

        const duration = parseFloat(output.trim());
        durations.push(duration);

        console.log(`toma_${index + 1}: ${duration.toFixed(3)} seconds`);
    } catch (error) {
        console.error(`Error measuring ${file}:`, error.message);
        durations.push(0);
    }
});

// Save to JSON
const data = {
    durations: durations,
    durationsInSeconds: durations.map(d => Math.ceil(d)),
    totalDuration: durations.reduce((a, b) => a + b, 0),
};

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

console.log(`\nTotal duration: ${data.totalDuration.toFixed(3)} seconds`);
console.log(`\nDurations saved to: ${outputFile}`);
