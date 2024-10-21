const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const load = require('audio-loader');
const path = require("path");
const fs = require("fs");

const sliceAudio = (audioFilePath, outputDir, startTime, endTime, outputFileName) => {
    return new Promise((resolve, reject) => {
        ffmpeg(audioFilePath)
            .setFfmpegPath(ffmpegPath)
            .seekInput(startTime)
            .duration(endTime - startTime)
            .output(path.join(outputDir, outputFileName))
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .run();
    });
};

const sliceDir = path.join(__dirname, `./resource/slice`);
if (!fs.existsSync(sliceDir)) {
    fs.mkdirSync(sliceDir);
}

const fun = async (audioFilePath, name) => {
    const duration = (await load(audioFilePath)).duration;

    const outputDir = path.join(__dirname, `./resource/slice/${name}`);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const sliceInterval = 1; // 每 1 秒切一片
    let currentTime = 0;
    let sliceNumber = 1;
    while (currentTime < duration) {
        const outputFileName = `slice_${sliceNumber}.mp3`;
        await sliceAudio(
            audioFilePath,
            outputDir,
            currentTime,
            Math.min(currentTime + sliceInterval, duration),
            outputFileName,
        );
        currentTime += sliceInterval;
        sliceNumber++;
    }

    return sliceNumber;
};