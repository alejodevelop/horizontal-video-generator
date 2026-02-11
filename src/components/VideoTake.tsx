import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useVideoConfig } from 'remotion';
import type { Take } from '../types';
import { Subtitle } from './Subtitle';
import { ZoomEffect } from './ZoomEffect';
import { ImageOverlay } from './ImageOverlay';
import { generateSubtitlesFromTimestamps, groupSubtitlesFromTimestamps } from '../utils/subtitles';
import { detectImageOverlays } from '../utils/videoTiming';
import timestampsData from '../config/timestamps.json';

interface VideoTakeProps {
    take: Take;
    durationInFrames: number;
}

export const VideoTake: React.FC<VideoTakeProps> = ({ take, durationInFrames }) => {
    const { fps } = useVideoConfig();

    // Get Whisper timestamps for this take
    const takeKey = `toma_${take.id}` as keyof typeof timestampsData;
    const timestampData = timestampsData[takeKey];

    // Generate subtitles from Whisper timestamps (perfect sync!)
    const words = generateSubtitlesFromTimestamps(timestampData.words, fps);
    const subtitleChunks = groupSubtitlesFromTimestamps(words, 3, 0.3, fps);

    // Detect image overlays
    const imageOverlays = detectImageOverlays(
        take.transcription,
        durationInFrames,
        take.images
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
                        <OffthreadVideo
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
                    <OffthreadVideo
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

            {/* Audio track */}
            <Audio
                src={staticFile(take.audioPath)}
                startFrom={take.audioStartFrom ? Math.floor(take.audioStartFrom * fps) : 0}
            />

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
                />
            ))}
        </AbsoluteFill>
    );
};
