import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes.js';
import courseRoute from './routes/course.routes.js';
import lectureRoute from './routes/lecture.routes.js';
import enrollmentRoute from './routes/enrollment.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
// Allow cross-origin cookie auth. FRONTEND_URL should be set to the front-end origin (e.g. http://localhost:5173)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// app.options('*', cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Parse cookies for session-based auth
app.use(cookieParser());



// Warn if Supabase keys are not set in environment
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Warning: One or more SUPABASE_* env vars are missing. Ensure SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are set.');
}

// Static file serving
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/lectures', lectureRoute);
app.use('/api/v1/enrollments', enrollmentRoute);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ Server is up and running');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});