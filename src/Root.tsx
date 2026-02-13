import { z } from "zod";
import { SyncTest } from "./components/SyncTest";
import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TAKES } from "./config/takes";

// Calculate total duration dynamically from TAKES
const fps = 30;

// Use the same logic as in Composition.tsx for duration calculation
const totalSeconds = TAKES.reduce((acc, take) => {
  const duration = take.timestamps?.duration > 0 ? take.timestamps.duration : 5;
  return acc + duration;
}, 0);

const totalDuration = Math.ceil(totalSeconds * fps);

const syncTestSchema = z.object({
  // Dynamic max based on number of takes
  takeId: z.number().min(1).max(TAKES.length),
  showReferenceAudio: z.boolean(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={totalDuration}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="SyncTest"
        component={SyncTest as any}
        durationInFrames={30 * 20}
        fps={fps}
        width={1080}
        height={1920}
        schema={syncTestSchema}
        defaultProps={{ takeId: 7, showReferenceAudio: true }}
      />
    </>
  );
};
