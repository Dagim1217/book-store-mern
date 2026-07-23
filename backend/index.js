import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';
import path from 'path'; // 1. Import path utilities

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/books', booksRoute);

// 2. Locate the folder where the frontend builds its static assets
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// 3. Serve the HTML layout file for any route that isn't an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
