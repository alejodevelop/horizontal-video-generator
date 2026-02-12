import { z } from "zod";
import { SyncTest } from "./components/SyncTest";
import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import timestampsData from "./config/timestamps.json";

// Calculate total duration from Whisper timestamps
const fps = 30;
const totalSeconds =
  timestampsData.toma_1.duration +
  timestampsData.toma_2.duration +
  timestampsData.toma_3.duration +
  timestampsData.toma_4.duration +
  timestampsData.toma_5.duration +
  timestampsData.toma_6.duration +
  timestampsData.toma_7.duration;

const totalDuration = Math.ceil(totalSeconds * fps);

const syncTestSchema = z.object({
  takeId: z.number().min(1).max(7),
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
