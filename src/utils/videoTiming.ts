import type { ImageOverlay, SubtitleWord } from '../types';
import { IMAGE_KEYWORDS } from '../config/takes';

/**
 * Detect which images should appear based on keywords in transcription
 */
export function detectImageOverlays(
    transcription: string,
    durationInFrames: number,
    availableImages: string[],
    wordTimestamps?: SubtitleWord[]
): ImageOverlay[] {
    const overlays: ImageOverlay[] = [];

    availableImages.forEach((imagePath) => {
        const keywords = IMAGE_KEYWORDS[imagePath] || [];

        keywords.forEach((keyword) => {
            const keywordLower = keyword.toLowerCase();

            if (wordTimestamps) {
                // Precise mode: Find keyword in word timestamps
                const transcriptionLower = transcription.toLowerCase();
                const keywordIndex = transcriptionLower.indexOf(keywordLower);

                if (keywordIndex !== -1) {
                    // Find which word corresponds to this character position
                    // This is a bit tricky because we need to map char index to word index
                    // A simpler approach for now is to check word content directly
                }

                // Alternative: Search in word array directly
                // Join words to find sequence
                // This assumes exact match on word boundaries which is safer for "telephone"

                // Let's iterate through words to find the sequence
                const keywordWords = keywordLower.split(' ');

                for (let i = 0; i <= wordTimestamps.length - keywordWords.length; i++) {
                    let match = true;
                    for (let j = 0; j < keywordWords.length; j++) {
                        // Normalize: lower case, remove accents, remove punctuation
                        const wordClean = wordTimestamps[i + j].text
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

                        const keywordClean = keywordWords[j]
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");

                        // Strict check: Word must include keyword (e.g. "telefonoooo" includes "telefono")
                        // But NOT the other way around (keyword "telefono" should NOT match "te")
                        if (!wordClean.includes(keywordClean)) {
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        // Found precise match!
                        const startFrame = wordTimestamps[i].startFrame;
                        // Show for 2 seconds or until end of phrase + buffer
                        const endFrame = Math.min(
                            startFrame + 60, // Minimum 2 seconds
                            durationInFrames
                        );

                        // Special timing adjustment for Google image
                        const earlyOffsetFrames = imagePath.includes('google.png') ? 15 : 0;

                        overlays.push({
                            imagePath,
                            startFrame: Math.max(0, startFrame - earlyOffsetFrames),
                            endFrame,
                            keyword,
                        });
                    }
                }

            } else {
                // Fallback: Linear Interpolation (Old Logic)
                const words = transcription.split(' ');
                const framesPerWord = durationInFrames / words.length;

                // Find keyword position in transcription (case insensitive)
                const keywordWords = keyword.split(' ');
                const transcriptionLower = transcription.toLowerCase();

                const position = transcriptionLower.indexOf(keywordLower);

                if (position !== -1) {
                    // Calculate word index approximately
                    const wordsBeforeKeyword = transcription
                        .substring(0, position)
                        .split(' ').length;

                    // Special timing adjustment for Google image (show 0.5s earlier)
                    const earlyOffsetFrames = imagePath.includes('google.png') ? 15 : 0; // 0.5s at 30fps

                    const startFrame = Math.max(0, Math.floor(wordsBeforeKeyword * framesPerWord) - earlyOffsetFrames);
                    const endFrame = Math.min(
                        Math.floor((wordsBeforeKeyword + keywordWords.length * 2) * framesPerWord),
                        durationInFrames
                    );

                    overlays.push({
                        imagePath,
                        startFrame,
                        endFrame,
                        keyword,
                    });
                }
            }
        });
    });

    // Remove duplicate overlays for same image. Prefer the first occurrence.
    const uniqueOverlays = overlays.filter(
        (overlay, index, self) =>
            index === self.findIndex((o) => o.imagePath === overlay.imagePath)
    );

    return uniqueOverlays;
}

