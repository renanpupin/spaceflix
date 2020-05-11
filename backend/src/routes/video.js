const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
let videos = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/videos.json'), 'utf-8'))

router.get('/', (req, res) => {
    res.json({success: true, message: "SpaceFlix API."});
});

router.get('/thumb/:id', (req, res) => {
    const id = req.params.id;

    res.sendFile(path.join(__dirname, '../data/thumbs/'+id));
});

router.get('/video', (req, res) => {
    res.json({
        success: true,
        message: "Video fetched.",
        videos
    });
});

router.get('/video/:id', (req, res) => {
    const id = req.params.id;

    const filePath = path.join(__dirname, '../data/videos/'+id);
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(filePath, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(filePath).pipe(res)
    }
});

module.exports = router;
