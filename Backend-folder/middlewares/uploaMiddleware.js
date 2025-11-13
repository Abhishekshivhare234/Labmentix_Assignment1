import multer from 'multer';

// Use memory storage so we can upload file buffers directly to Supabase
export const upload = multer({ storage: multer.memoryStorage() });
