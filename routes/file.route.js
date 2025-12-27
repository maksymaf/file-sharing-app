const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const File = require('../models/File');
const path = require('path');
const generatePin = require('../services/generatePin');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single("file") ,async (req, res) => {
    try{
        if (!req.file) return res.status(400).json({
            success: false,
            input: req.file,
            error: {
                field: "file",
                message: "file is required",
                code: "FILE_NOT_UPLOADED"
            },
            result: null,
        });

        const { pin, pinHash } = await generatePin();

        await File.create({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            pin: pinHash,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        return res.status(200).json({
            success: true,
            input: req.file,
            error: null,
            result: {
                pin
            },
        });

    }catch(err){
        console.error(err.message);
        return res.status(500).json({message: err.messsage});
    }
});

router.post('/download', async (req, res) => {
    const { pin } = req.body;

    const files = await File.find({});
    let fileToDownload = null;

    for (const file of files) {
        if (await bcrypt.compare(pin, file.pin)) {
        fileToDownload = file;
        break;
        }
    }

    if (!fileToDownload) return res.status(404).json({message: "File not found or expired"});

    res.download(fileToDownload.filePath, fileToDownload.originalName, (err) => {
        if (err) console.error(err);
        fs.unlink(fileToDownload.filePath, () => {}); 
    });
})

module.exports = router;