import React from 'react';
import { AbsoluteFill, Audio, Video, staticFile, useVideoConfig } from 'remotion';
import { TAKES } from '../config/takes';
import { Waveform } from './Waveform';

export interface SyncTestProps {
    takeId: number;
    showReferenceAudio: boolean;
}

export const SyncTest: React.FC<SyncTestProps> = ({ takeId, showReferenceAudio }) => {
    const take = TAKES.find((t) => t.id === takeId);
    const { fps } = useVideoConfig();

    if (!take) {
        return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', fontSize: 40, color: 'white' }}>
                Take {takeId} not found
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill>
            <Video
                src={staticFile(take.videoPath)}
                // If showReferenceAudio is true, we play the video's audio.
                // If false, we mute it, so we only hear the external audio (useful for checking lip sync visually).
                muted={!showReferenceAudio}
                startFrom={take.videoStartFrom ? Math.floor(take.videoStartFrom * fps) : 0}
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            <Audio
                src={staticFile(take.audioPath)}
                startFrom={take.audioStartFrom ? Math.floor(take.audioStartFrom * fps) : 0}
            />
            <AbsoluteFill style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: 40,
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                fontFamily: 'sans-serif',
                color: 'white',
                zIndex: 10
            }}>
                <h1>Sync Validation Mode</h1>
                <h2>Take: {take.id}</h2>
                <p><strong>Audio Offset:</strong> {take.audioStartFrom || 0}s</p>
                <p><strong>Video Offset:</strong> {take.videoStartFrom || 0}s</p>
                <div style={{ marginTop: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, borderRadius: 10 }}>
                    <p style={{ margin: 0, fontSize: 24 }}>Instructions:</p>
                    <ol style={{ fontSize: 20, lineHeight: 1.5 }}>
                        <li><strong>Visual:</strong> Align the waveform peaks.</li>
                        <li><strong>Audio:</strong> Listen for "echo" effect.</li>
                        <li>Adjust <code>audioStartFrom</code> in <code>takes.ts</code>.</li>
                    </ol>
                </div>
            </AbsoluteFill>

            {/* Waveform Visualization Overlay */}
            <AbsoluteFill style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 100,
            }}>
                <div style={{ width: '90%', height: 200, position: 'relative', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, overflow: 'hidden' }}>
                    {/* External Audio Waveform (Blue) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.8 }}>
                        <Waveform
                            src={staticFile(take.audioPath)}
                            startFromInSeconds={take.audioStartFrom || 0}
                            color="#00BFFF" // Deep Sky Blue
                            height={200}
                        />
                    </div>

                    {/* Video Audio Waveform (Red) */}
                    {showReferenceAudio && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.7, mixBlendMode: 'screen' }}>
                            <Waveform
                                src={staticFile(take.videoPath)}
                                startFromInSeconds={take.videoStartFrom || 0}
                                color="#FF4500" // Orange Red
                                height={200}
                            />
                        </div>
                    )}

                    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontSize: 14 }}>
                        <span style={{ color: '#00BFFF' }}>External Audio</span> | <span style={{ color: '#FF4500' }}>Video Audio</span>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
