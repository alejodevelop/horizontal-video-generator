const fs = require('fs');
const path = require('path');

// Directories
const audioDir = path.join(__dirname, '..', 'public', 'Audio');

// Get all audio files
const audioFiles = ['toma_1.m4a', 'toma_2.m4a', 'toma_3.m4a', 'toma_4.m4a', 'toma_5.m4a', 'toma_6.m4a', 'toma_7.m4a'];

console.log('Audio file durations:\n');

audioFiles.forEach((file, index) => {
    const filePath = path.join(audioDir, file);
    const stats = fs.statSync(filePath);
    // Estimate duration based on file size (rough estimate)
    // For m4a files, approximately: size in bytes / 16000 = duration in seconds
    const estimatedDuration = Math.ceil(stats.size / 16000);
    console.log(`toma_${index + 1}: ~${estimatedDuration} seconds (${stats.size} bytes)`);
});
