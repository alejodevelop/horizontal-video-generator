import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, staticFile } from 'remotion';

interface ImageOverlayProps {
    imagePath: string;
    startFrame: number;
    endFrame: number;
    style?: React.CSSProperties;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({
    imagePath,
    startFrame,
    endFrame,
    style,
}) => {
    const frame = useCurrentFrame();

    // Don't show outside time range
    if (frame < startFrame || frame > endFrame) {
        return null;
    }

    // Animation durations
    const fadeInDuration = 10;
    const fadeOutDuration = 10;
    const totalDuration = endFrame - startFrame;

    // Ensure fade durations don't exceed total duration
    const actualFadeIn = Math.min(fadeInDuration, totalDuration / 2);
    const actualFadeOut = Math.min(fadeOutDuration, totalDuration / 2);

    // Calculate middle points ensuring they're strictly increasing
    const middleStart = actualFadeIn;
    const middleEnd = totalDuration - actualFadeOut;

    // If middle points would be equal or inverted, add small offset
    const adjustedMiddleEnd = middleEnd <= middleStart ? middleStart + 0.01 : middleEnd;

    const opacity = interpolate(
        frame - startFrame,
        [0, middleStart, adjustedMiddleEnd, totalDuration],
        [0, 0.85, 0.85, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    const scale = interpolate(
        frame - startFrame,
        [0, actualFadeIn],
        [0.9, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingTop: '120px', // Space from top edge
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    width: '45%',
                    aspectRatio: '1',
                    opacity,
                    transform: `scale(${scale})`,
                    borderRadius: 24,
                    overflow: 'hidden',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.8)',
                    border: '6px solid rgba(255, 255, 255, 0.8)',
                    ...style,
                }}
            >
                <Img
                    src={staticFile(imagePath)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
