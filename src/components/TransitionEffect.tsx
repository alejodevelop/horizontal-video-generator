import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface TransitionEffectProps {
    children: React.ReactNode;
    durationInFrames: number;
    transitionDuration?: number;
}

export const TransitionEffect: React.FC<TransitionEffectProps> = ({
    children,
    durationInFrames,
    transitionDuration = 15, // ~0.5 seconds at 30fps
}) => {
    const frame = useCurrentFrame();

    // Fade in at the start
    const fadeIn = interpolate(
        frame,
        [0, transitionDuration],
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Fade out at the end
    const fadeOut = interpolate(
        frame,
        [durationInFrames - transitionDuration, durationInFrames],
        [1, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Combine both fade effects
    const opacity = Math.min(fadeIn, fadeOut);

    return (
        <AbsoluteFill style={{ opacity }}>
            {children}
        </AbsoluteFill>
    );
};
