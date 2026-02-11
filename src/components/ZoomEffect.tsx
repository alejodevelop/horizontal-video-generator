import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface ZoomEffectProps {
    children: React.ReactNode;
    durationInFrames: number;
    enabled: boolean;
}

export const ZoomEffect: React.FC<ZoomEffectProps> = ({
    children,
    durationInFrames,
    enabled,
}) => {
    const frame = useCurrentFrame();

    if (!enabled) {
        return <>{children}</>;
    }

    // Subtle zoom from 1.0 to 1.08 over the entire duration
    // Then zoom back out for smooth loop effect
    const halfDuration = durationInFrames / 2;

    const scale = interpolate(
        frame,
        [0, halfDuration, durationInFrames],
        [1.0, 1.08, 1.0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
            }}
        >
            {children}
        </div>
    );
};
