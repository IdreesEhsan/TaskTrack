import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config(); // loads variables from .env into process.env
connectDB(); // connects to MongoDB Atlas

const app = express();

app.use(cors());          // allows the frontend (different port) to call this API
app.use(express.json());  // parses incoming JSON request bodies into req.body

// Simple health check route — useful to confirm the server is alive

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount our route groups under their base paths

app.use('/api/auth', authRoutes);   // -> /api/auth/register, /api/auth/login
app.use('/api/tasks', taskRoutes);  // -> /api/tasks, /api/tasks/:id

// These two MUST be registered last — Express runs middleware in order, so unmatched routes and errors should only be caught after everything else.

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));