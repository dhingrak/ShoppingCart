const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50,
        require: true,
        trim: true
    },
    fullPath: {
        type: String,
        min: 5,
        max: 255,
        required: true,
        trim: true
    },
    relativePath: {
        type: String,
        min: 5,
        max: 255,
        required: true,
        trim: true
    }
})

const File = mongoose.model('File', fileSchema);

module.exports = {
    File,
    fileSchema
}