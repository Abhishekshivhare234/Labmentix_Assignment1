import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { supabase } from './config/supabaseClient.js';
import userRoute from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/user', userRoute);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ Server is up and running');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});