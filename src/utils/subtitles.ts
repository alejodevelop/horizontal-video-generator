import type { SubtitleWord, WordTimestamp } from '../types';

/**
 * Generate subtitle timing from Whisper timestamps
 * This provides perfect synchronization with the actual speech
 */
export function generateSubtitlesFromTimestamps(
    words: WordTimestamp[],
    fps: number
): SubtitleWord[] {
    return words.map((word) => ({
        text: word.word,
        startFrame: Math.floor(word.start * fps),
        endFrame: Math.ceil(word.end * fps),
    }));
}

/**
 * Group words into readable subtitle chunks based on timing
 * Groups words that are close together in time
 */
export function groupSubtitlesFromTimestamps(
    subtitles: SubtitleWord[],
    maxWordsPerChunk: number = 3,
    maxGapSeconds: number = 0.3,
    fps: number = 30
): Array<{ text: string; startFrame: number; endFrame: number }> {
    if (subtitles.length === 0) return [];

    const chunks: Array<{ text: string; startFrame: number; endFrame: number }> = [];
    let currentChunk: SubtitleWord[] = [];

    for (let i = 0; i < subtitles.length; i++) {
        const word = subtitles[i];
        const prevWord = subtitles[i - 1];

        // Check if we should start a new chunk
        const shouldStartNew =
            currentChunk.length >= maxWordsPerChunk ||
            (prevWord && (word.startFrame - prevWord.endFrame) > maxGapSeconds * fps);

        if (shouldStartNew && currentChunk.length > 0) {
            // Save current chunk
            chunks.push({
                text: currentChunk.map((w) => w.text).join(' '),
                startFrame: currentChunk[0].startFrame,
                endFrame: currentChunk[currentChunk.length - 1].endFrame,
            });
            currentChunk = [];
        }

        currentChunk.push(word);
    }

    // Add final chunk
    if (currentChunk.length > 0) {
        chunks.push({
            text: currentChunk.map((w) => w.text).join(' '),
            startFrame: currentChunk[0].startFrame,
            endFrame: currentChunk[currentChunk.length - 1].endFrame,
        });
    }

    return chunks;
}

/**
 * Fallback: Generate subtitle timing for words based on natural speaking pace
 * Use this if Whisper timestamps are not available
 */
export function generateSubtitles(
    transcription: string,
    durationInFrames: number,
    fps: number
): SubtitleWord[] {
    const words = transcription.split(' ').filter((w) => w.length > 0);
    const totalWords = words.length;

    if (totalWords === 0) return [];

    // Natural speaking pace: ~0.4 seconds per word (adjustable)
    const secondsPerWord = 0.4;
    const framesPerWord = Math.ceil(secondsPerWord * fps);

    return words.map((word, index) => {
        const startFrame = index * framesPerWord;
        const endFrame = (index + 1) * framesPerWord;

        return {
            text: word,
            startFrame: Math.min(startFrame, durationInFrames - framesPerWord),
            endFrame: Math.min(endFrame, durationInFrames),
        };
    });
}

/**
 * Fallback: Group words into readable subtitle chunks (2-3 words each)
 */
export function groupSubtitlesIntoChunks(
    subtitles: SubtitleWord[],
    wordsPerChunk: number = 2
): Array<{ text: string; startFrame: number; endFrame: number }> {
    const chunks: Array<{ text: string; startFrame: number; endFrame: number }> =
        [];

    for (let i = 0; i < subtitles.length; i += wordsPerChunk) {
        const chunkWords = subtitles.slice(i, i + wordsPerChunk);
        chunks.push({
            text: chunkWords.map((w) => w.text).join(' '),
            startFrame: chunkWords[0].startFrame,
            endFrame: chunkWords[chunkWords.length - 1].endFrame,
        });
    }

    return chunks;
}
