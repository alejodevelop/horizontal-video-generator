import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { TAKES } from './config/takes';
import { VideoTake } from './components/VideoTake';
import { TransitionEffect } from './components/TransitionEffect';
import timestampsData from './config/timestamps.json';

// Extract exact durations from Whisper timestamps
const TAKE_DURATIONS = [
  timestampsData.toma_1.duration,  // 6.0s (1.20s offset)
  timestampsData.toma_2.duration,  // 8.78s
  timestampsData.toma_3.duration,  // 8.9s (+0.5s extended)
  timestampsData.toma_4.duration,  // 17.06s
  timestampsData.toma_5.duration,  // 17.8s
  timestampsData.toma_6.duration,  // 11.0s (+0.3s extended)
  timestampsData.toma_7.duration,  // 4.54s (+0.3s extended)
];

const FPS = 30;

export const MyComposition = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Audio
        src={staticFile('Music/chill-vibes.mp3')}
        volume={0.1}
        loop
      />
      {TAKES.map((take, index) => {
        const durationInFrames = Math.ceil(TAKE_DURATIONS[index] * FPS);
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
