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

