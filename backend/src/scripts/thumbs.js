const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

//IMPORT: this script requires 'fmmpeg' libray (https://www.ffmpeg.org/)

const VIDEOS_PATH = path.join(__dirname, '../data/videos');
const THUMBS_PATH = path.join(__dirname, '../data/thumbs');

fs.readdir(VIDEOS_PATH, async (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    //listing all files using forEach
    for(let file of files){
        console.log(file);

        await ffmpeg(VIDEOS_PATH+"/"+file)
            .screenshots({
                count: 1,
                filename: file.split('.')[0]+'.png',
                folder: THUMBS_PATH,
                size: '?x720'
            });
    }
});
