export interface WordTimestamp {
    word: string;
    start: number;  // seconds
    end: number;    // seconds
}

export interface TakeTimestamps {
    take: number;
    duration: number;
    text: string;
    words: WordTimestamp[];
}

export interface Take {
    id: number;
    videoPath: string;
    audioPath: string;
    transcription: string;
    images: string[];
    enableZoom: boolean;
    timestamps?: TakeTimestamps;  // Whisper-generated timestamps
    audioStartFrom?: number;  // Offset in seconds to start audio playback
    videoStartFrom?: number;  // Offset in seconds to start video playback
}


export interface SubtitleWord {
    text: string;
    startFrame: number;
    endFrame: number;
}

export interface ImageOverlay {
    imagePath: string;
    startFrame: number;
    endFrame: number;
    keyword?: string;
}
