import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { TAKES } from './config/takes';
import { VideoTake } from './components/VideoTake';
import { TransitionEffect } from './components/TransitionEffect';
import projectData from './config/project-data.json';

const FPS = 30;

export const MyComposition = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {projectData.backgroundMusic && (
        <Audio
          src={staticFile(projectData.backgroundMusic)}
          volume={0.1}
          loop
        />
      )}
      {TAKES.map((take) => {
        // Use duration from timestamps, defaulting to a safe value if missing
        const durationSecs = take.timestamps?.duration || 5;
        const durationInFrames = Math.ceil(durationSecs * FPS);

        const from = currentFrame;
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={take.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <TransitionEffect durationInFrames={durationInFrames}>
              <VideoTake take={take} durationInFrames={durationInFrames} />
            </TransitionEffect>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

