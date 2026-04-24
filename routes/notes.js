import express from 'express'
import multer from 'multer'
import path from 'path'
import {marked} from 'marked'
import Note from '../models/Note.js'

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

// save a new note from markdown text
notesRouter.post('/create', async(req, res) => {
    try {
        const {title, markdownText} = req.body;

        if (!title || !markdownText) {
            return res.status(400).json({message: "Please provide title and markdown text"});
        }
        // convert the markdown to html using marked library we installed it in the beginning of the project
        const convertedHTML = marked.parse(markdownText);
        // save everything to database
        const newNote = new Note({
            title: title,
            rawContent: markdownText,
            htmlContent: convertedHTML
        })
        const savedNote = await newNote.save();
        res.status(201).json({
            message: "Note saved successfully",
            note: savedNote
        });
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET: retrieve the rendered html of a specific note
notesRouter.get('/:id/html', async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({message: "Note not found"});
        }
        // instead of res.json() here we will use res.send() to get raw html as output
        // this tells the browser to render it like a real page
        res.send(note.htmlContent);
    }
    catch (err) {
        res.status(500).json({message: "Invalid ID format or server error"});
    }
});

// GET -> check the grammer of a saved note
notesRouter.get('/:id/grammer', async(req, res) => {
    try {
        // find the note in our database
        const note = await Note.findById(req.params.id);

        if(!note) {
            return res.status(404).json({message: "Note not found!"})
        }

        // send the raw markdown text the the LanguageTool API
        // use Node.js's fetch to make a request from our server to theirs
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // the api requires data to be formatted as URL parameters
            body: new URLSearchParams({
                text: note.rawContent,
                language: 'en-US'
            })
        })
        // convert their response to json
        const data = await response.json();
        // clean up the massive response and send only what user is interested in
        const cleanSuggestions = data.matches.map(match => ({
            issue: match.issue,
            context: match.context.text,
            suggestedFixes: match.replacements.map(r => r.value).slice(0, 3)
        }));

        // now send the final report back to the user
        res.status(200).json({
            noteTitle: note.title,
            issuesFound: cleanSuggestions.length,
            grammerReport: cleanSuggestions
        })
    }
    catch (err) {
        res.status(500).json({message: "Grammer check failed or server error"});
    }
})

export default notesRouter;