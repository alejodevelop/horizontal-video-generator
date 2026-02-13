import type { Take } from '../types';
import projectData from './project-data.json';
import timestampDataRaw from './timestamps.json';

// Type assertion for timestamp data as it might be dynamic
const timestampsData = timestampDataRaw as Record<string, any>;

// Helper to get timestamps for a take
const getTimestampData = (takeId: number) => {
    const key = `toma_${takeId}`;
    return timestampsData[key] || { text: '', duration: 0, words: [] };
};

// Dynamically generate TAKES from project-data.json
export const TAKES: Take[] = projectData.takes.map((take) => {
    const tsData = getTimestampData(take.id);

    // Determine images for this take (this logic was previously manual)
    // We can either assign all images to all takes and let the trigger logic decide,
    // OR we can try to filter them here. 
    // The previous logic had specific images per take in the `images` array.
    // The `VideoTake` component uses `take.images` to know which images *could* be shown.
    // Passing ALL images to every take is the most flexible approach for a reusable project,
    // as the trigger logic checks for keywords in the transcription.

    return {
        id: take.id,
        videoPath: take.video,
        audioPath: take.audio,
        transcription: tsData.text,
        images: projectData.images, // Pass ALL available images to every take
        enableZoom: tsData.duration > 10, // heuristic: auto-zoom for long takes
        timestamps: tsData, // Pass the full timestamp data including duration
        audioStartFrom: 0, // Default to 0 for new reusable workflow
        videoStartFrom: 0, // Default to 0
    };
});

// Dynamically generate IMAGE_KEYWORDS
export const IMAGE_KEYWORDS: Record<string, string[]> = projectData.imageKeywords;

// Custom styles can remain hardcoded or moved to a config if needed later
// For now, we keep the specific style for the banner as it's likely a persistent asset
export const IMAGE_STYLES: Record<string, React.CSSProperties> = {
    'Images/cabarcasandotten_instagram_banner.png': {
        width: '85%',
        aspectRatio: 'auto',
        borderRadius: 20,
        marginBottom: '500px',
        marginTop: 'auto',
        border: 'none',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    },
};


