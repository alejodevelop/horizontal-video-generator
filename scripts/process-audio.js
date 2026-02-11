const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Directories
const audioDir = path.join(__dirname, '..', 'Audio');
const outputDir = path.join(audioDir, 'processed');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all audio files
const audioFiles = fs.readdirSync(audioDir).filter(file => file.endsWith('.m4a'));

console.log(`Found ${audioFiles.length} audio files to process\n`);

// Process each audio file
let processed = 0;

audioFiles.forEach((file, index) => {
  const inputPath = path.join(audioDir, file);
  const outputPath = path.join(outputDir, file);

  console.log(`[${index + 1}/${audioFiles.length}] Processing: ${file}`);

  // FFmpeg command to clean and normalize audio
  // - afftdn: Remove background noise using FFT denoiser
  // - highpass: Remove low frequency rumble
  // - silenceremove: Remove silence at start/end and long pauses
  // - loudnorm: Normalize loudness for consistent volume
  const ffmpeg = spawn('ffmpeg', [
    '-i', inputPath,
    '-af', 'afftdn=nf=-20,highpass=f=200,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:detection=peak,silenceremove=stop_periods=-1:stop_duration=0.5:stop_threshold=-50dB:detection=peak,loudnorm=I=-16:TP=-1.5:LRA=11',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-y',
    outputPath
  ], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let errorOutput = '';

  ffmpeg.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  ffmpeg.on('close', (code) => {
    if (code === 0) {
      processed++;
      console.log(`✓ Completed: ${file}\n`);
      
      if (processed === audioFiles.length) {
        console.log(`\n✅ All ${audioFiles.length} files processed successfully!`);
        console.log(`📁 Output directory: ${outputDir}`);
      }
    } else {
      console.error(`✗ Error processing ${file}`);
      console.error(`FFmpeg error output:\n${errorOutput}\n`);
    }
  });

  ffmpeg.on('error', (err) => {
    console.error(`✗ Failed to start FFmpeg for ${file}:`, err.message);
  });
});
