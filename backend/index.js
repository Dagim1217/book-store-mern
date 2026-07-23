import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/books', booksRoute);

// This tells the server exactly where the project sits on Render's computer
const currentWorkingDir = process.cwd();

// If Render is locked inside 'backend', look inside 'frontend/dist'. Otherwise, adjust path.
const frontendBuildPath = currentWorkingDir.endsWith('backend')
  ? path.join(currentWorkingDir, '../frontend/dist')
  : path.join(currentWorkingDir, 'frontend/dist');

app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
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
