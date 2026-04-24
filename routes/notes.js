import express from 'express'
import multer from 'multer'
import path from 'path'

const notesRouter = express.Router();

// 1. configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // tell multer to save files in the 'uploads' folder
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // creating a unique filename: timestamp + original extension
        const uniqueSuffix = Date.now() + '_' + (Math.round(Math.random) * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

// upload route
notesRouter.post('/upload', upload.single('noteFile'), async(req, res) => {
    try {
        if (!req.file) {    
            return res.status(400).json({message: "Please upload a Markdown file."});
        }
        res.status(201).json({
            message: "File Uploaded Successfully",
            fileData: req.file // This shows the file's new name and location
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default notesRouter;