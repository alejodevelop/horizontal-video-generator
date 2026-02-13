import React from 'react';
import { AbsoluteFill, Audio, Video, Sequence, staticFile, useVideoConfig } from 'remotion';
import type { Take } from '../types';
import { IMAGE_STYLES } from '../config/takes';
import { Subtitle } from './Subtitle';
import { ZoomEffect } from './ZoomEffect';
import { ImageOverlay } from './ImageOverlay';
import { generateSubtitlesFromTimestamps, groupSubtitlesFromTimestamps } from '../utils/subtitles';
import { detectImageOverlays } from '../utils/videoTiming';

interface VideoTakeProps {
    take: Take;
    durationInFrames: number;
}

export const VideoTake: React.FC<VideoTakeProps> = ({ take, durationInFrames }) => {
    const { fps } = useVideoConfig();

    // Use timestamps passed from the Take object (safe fallback already handled in takes.ts)
    const timestampData = take.timestamps || { words: [], text: '', duration: 0 };

    // Generate subtitles from Whisper timestamps (perfect sync!)
    // If words array is empty, this returns empty array, which is fine.
    const words = generateSubtitlesFromTimestamps(timestampData.words, fps);
    const subtitleChunks = groupSubtitlesFromTimestamps(words, 3, 0.3, fps);

    // Detect image overlays
    const imageOverlays = detectImageOverlays(
        take.transcription || '', // Handle missing transcription
        durationInFrames,
        take.images,
        words // Pass precise timestamps
    );

    return (
        <AbsoluteFill>
            {/* Video with zoom effect if enabled */}
            {take.enableZoom ? (
                <ZoomEffect durationInFrames={durationInFrames} enabled={take.enableZoom}>
                    <AbsoluteFill
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#000',
                        }}
                    >
                        <Video
                            src={staticFile(take.videoPath)}
                            muted
                            startFrom={take.videoStartFrom ? Math.floor(take.videoStartFrom * fps) : 0}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </AbsoluteFill>
                </ZoomEffect>
            ) : (
                <AbsoluteFill
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#000',
                    }}
                >
                    <Video
                        src={staticFile(take.videoPath)}
                        muted
                        startFrom={take.videoStartFrom ? Math.floor(take.videoStartFrom * fps) : 0}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </AbsoluteFill>
            )}

            {/* Audio track - only render if audioPath exists */}
            {take.audioPath && (
                <Audio
                    src={staticFile(take.audioPath)}
                    startFrom={take.audioStartFrom ? Math.floor(take.audioStartFrom * fps) : 0}
                />
            )}

            {/* Subtitles with perfect Whisper timing */}
            {subtitleChunks.map((chunk, index) => (
                <Sequence
                    key={index}
                    from={chunk.startFrame}
                    durationInFrames={chunk.endFrame - chunk.startFrame}
                >
                    <Subtitle text={chunk.text} />
                </Sequence>
            ))}

            {/* Image overlays */}
            {imageOverlays.map((overlay, index) => (
                <ImageOverlay
                    key={index}
                    imagePath={overlay.imagePath}
                    startFrame={overlay.startFrame}
                    endFrame={overlay.endFrame}
                    style={IMAGE_STYLES[overlay.imagePath]}
                />
            ))}
        </AbsoluteFill>
    );
};
