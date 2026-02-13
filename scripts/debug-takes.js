// We need to use ts-node or compile this, but let's just make it a JS script that imports the config manually
// simulating what takes.ts does

const projectData = require('../src/config/project-data.json');
const timestampsData = require('../src/config/timestamps.json');

const TAKES = projectData.takes.map((take) => {
    const key = `toma_${take.id}`;
    const tsData = timestampsData[key] || { text: '', duration: 0, words: [] };

    return {
        id: take.id,
        videoPath: take.video,
        timestamps: tsData,
    };
});

console.log('TAKES debug info:');
TAKES.forEach(take => {
    const duration = take.timestamps.duration;
    const computedDuration = duration > 0 ? duration : 5;
    console.log(`Take ${take.id}: duration=${duration}, computed=${computedDuration}`);
});
