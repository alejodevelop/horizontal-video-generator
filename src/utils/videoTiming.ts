import type { ImageOverlay } from '../types';
import { IMAGE_KEYWORDS } from '../config/takes';

/**
 * Detect which images should appear based on keywords in transcription
 */
export function detectImageOverlays(
    transcription: string,
    durationInFrames: number,
    availableImages: string[]
): ImageOverlay[] {
    const overlays: ImageOverlay[] = [];
    const words = transcription.split(' ');
    const framesPerWord = durationInFrames / words.length;

    availableImages.forEach((imagePath) => {
        const keywords = IMAGE_KEYWORDS[imagePath] || [];

        keywords.forEach((keyword) => {
            // Find keyword position in transcription (case insensitive)
            const keywordWords = keyword.split(' ');
            const transcriptionLower = transcription.toLowerCase();
            const keywordLower = keyword.toLowerCase();

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
        });
    });

    // Remove duplicate overlays for same image
    const uniqueOverlays = overlays.filter(
        (overlay, index, self) =>
            index === self.findIndex((o) => o.imagePath === overlay.imagePath)
    );

    return uniqueOverlays;
}
