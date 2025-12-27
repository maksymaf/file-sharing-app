const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        trim: true
    },

    originalName: {
        type: String,
        required: true,
        trim: true,
    },

    filePath: {
        type: String,
        required: true,
        trim: true,
    }, 

    pin: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    mimeType: {
        type: String,
        required: true,
        trim: true
    },

    fileSize: {
        type: Number,
        required: true,
    }
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
