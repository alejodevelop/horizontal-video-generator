import { useAudioData } from "@remotion/media-utils";
import React, { useRef, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface WaveformProps {
    src: string;
    startFromInSeconds: number;
    color: string;
    height: number;
}

export const Waveform: React.FC<WaveformProps> = ({
    src,
    startFromInSeconds,
    color,
    height,
}) => {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();
    const audioData = useAudioData(src);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !audioData) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        const width = canvas.width;
        const height = canvas.height;

        context.clearRect(0, 0, width, height);
        context.fillStyle = color;

        // How much of the audio to show per pixel
        // Let's say we want to show 10 seconds of audio across the screen width?
        // Or should we map the entire duration? 
        // SyncTest is fixed to 20 seconds.
        // Let's map 1 pixel = 1 frame for simplicity, or scale to fit duration.
        // Since SyncTest is 30*20 frames = 600 frames. 
        // 1080px width.

        // Better: Draw the waveform for the *current* window of time.
        // Even better for sync: Show a static representation of the audio timeline.
        // The user scrubs through time.
        // So we want to draw the waveform from `startFromInSeconds` to `end`.

        // Actually, Remotion's visualizeAudio generates samples for a specific frame range.
        // To be useful for sync, we want to see the "shape" of the audio relative to the timeline.

        // Implementation:
        // We will draw the waveform representing the window [currentFrame - 100, currentFrame + 100] coordinates?
        // No, we want to see the WHOLE waveform statically, so we can see where the peaks are.

        // Let's render the waveform for the entire 20s duration of the composition.
        // Samples per frame = 1.

        // useAudioData returns the decoded buffer.

        // Let's implement simple waveform drawing from the buffer directly.
        const channelData = audioData.channelWaveforms[0];
        const sampleRate = audioData.sampleRate;

        // Total buffer samples:
        const totalSamples = channelData.length;

        // We want to map the 20s (Length of SyncTest composition) to the canvas width.
        // But we need to account for `startFromInSeconds`.
        // The composition at frame 0 is playing audio at `startFromInSeconds`.
        // So canvas x=0 corresponds to audio time `startFromInSeconds`.

        const compositionDurationInSeconds = 20;
        const startSampleIndex = Math.floor(startFromInSeconds * sampleRate);
        const endSampleIndex = Math.floor((startFromInSeconds + compositionDurationInSeconds) * sampleRate);

        const samplesToDraw = endSampleIndex - startSampleIndex;
        const samplesPerPixel = Math.floor(samplesToDraw / width);

        context.beginPath();

        // Simple RMS or Peak downsampling
        for (let x = 0; x < width; x++) {
            const chunkStart = startSampleIndex + (x * samplesPerPixel);
            const chunkEnd = chunkStart + samplesPerPixel;

            let max = 0;
            for (let i = chunkStart; i < chunkEnd && i < totalSamples; i++) {
                const val = Math.abs(channelData[i]);
                if (val > max) max = val;
            }

            // Draw
            // Center is height/2
            // Height of bar is max * height
            const barHeight = max * height;
            context.fillRect(x, (height - barHeight) / 2, 1, barHeight);
        }

        // Draw a playhead line
        const playheadX = (frame / (20 * fps)) * width;
        context.fillStyle = 'white';
        context.fillRect(playheadX, 0, 2, height);

    }, [audioData, startFromInSeconds, color, height, frame, fps, width]);

    if (!audioData) {
        return null;
    }

    return (
        <AbsoluteFill>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    width: '100%',
                    height: height,
                }}
            />
        </AbsoluteFill>
    );
};
