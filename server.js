import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import notesRouter from './routes/notes.js';
dotenv.config();

;(
    async () => {
        try {
            const PORT = process.env.PORT;
            const app = express();
            app.use(express.json());
            app.use(cors());
            
            app.use('/api/notes', notesRouter);

            const connectionInstance = await connectDB();
            console.log(`MongoDB connection successful, connection instance ${connectionInstance}`)

            app.listen(PORT, () => {
                console.log(`Listening on PORT ${PORT}`)
            })

            app.get('/', async(req, res) => {
                return res.json("Server is up and running!");
            })
        }
        catch (err) {
            console.error(`Error: ${err.message}`);
        }
    }
)()