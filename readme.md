set up db
set up server
set up .env file
npm install multer marked
multer -> node.js middleware for handling file upload
We configured multer to accept file uploads securely. We set it up to rename every incoming file with a unique timestamp so that two files with the same name never overwrite each other (solving the "name collision" requirement)

Doubt and it's answer:
The cb thing when configuring our multer storage in notes.js?
answer -> when you write cb(null, 'uploads/'), you are literally telling Multer:
"Hey manager, there were absolutely no errors (null), and the answer you are looking for is the 'uploads/' folder!"

till now we have made 
server, database
and 
routes/notes.js -> multer storage, POST to upload note file from desktop, POST to create a new note, GET to get a note using the id of the note
models/Note.js -> this is the schema of our note, it will contain title, rawContent, htmlContent, uploadedfilepath

Now our phase 3 is to check the grammer of the note
for that we'll need to teach our express backend to talk to another backend

we'll grab the note, send it's text to LanguageTool API and return the grammer suggestions to the user

* Making external API calls from your own server is a core backend skill *

