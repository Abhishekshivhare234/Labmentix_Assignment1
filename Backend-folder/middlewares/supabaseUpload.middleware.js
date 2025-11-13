import multer from 'multer';

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for thumbnails'));
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mkv|mov|wmv|webm/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'));
  }
};

// Combined filter for course content
const courseContentFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnail') {
    imageFilter(req, file, cb);
  } else if (file.fieldname === 'video') {
    videoFilter(req, file, cb);
  } else {
    cb(new Error('Invalid field name'));
  }
};

// Use memory storage for Supabase uploads
export const uploadForSupabase = multer({
  storage: multer.memoryStorage(),
  fileFilter: courseContentFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
    fields: 10,
    files: 2
  }
});

export default { uploadForSupabase };