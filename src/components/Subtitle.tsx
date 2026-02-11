import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface SubtitleProps {
    text: string;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text }) => {
    const frame = useCurrentFrame();

    // Fade in/out animations (relative to Sequence start)
    const fadeInDuration = 5;
    const fadeOutDuration = 5;

    const opacity = interpolate(
        frame,
        [0, fadeInDuration],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    const scale = interpolate(
        frame,
        [0, fadeInDuration],
        [0.9, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 250,
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    color: '#FFFFFF',
                    fontSize: 52,
                    fontWeight: 900,
                    padding: '20px 40px',
                    borderRadius: 16,
                    textAlign: 'center',
                    maxWidth: '90%',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    opacity,
                    transform: `scale(${scale})`,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: 1.3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}
            >
                {text}
            </div>
        </AbsoluteFill>
    );
};
