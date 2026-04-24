import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    rawContent: {
        type: String,
        required: true // the original markdown text
    },
    htmlContent: {
        type: String,
        required: true // the converted html text
    },
    uploadedFilePath: {
        type: String,
        default: null // in case it came from a file upload
    }
}, {timestamps: true});

export default mongoose.model('Note', noteSchema);