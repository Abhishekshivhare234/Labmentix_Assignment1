import { Router } from 'express';

import { getAllCourses, getCourseById, createCourse, addLessonToCourse, updateCourse } from '../controllers/course.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadForSupabase } from '../middlewares/supabaseUpload.middleware.js';

const router = Router();

// Public: list all courses
router.get('/get-courses', getAllCourses);

// Public: get course details
router.get('/get-course/:id', getCourseById);

// Protected: create a course (instructor only) — accepts thumbnail upload
router.post('/create-course', requireAuth, uploadForSupabase.fields([
  { name: 'thumbnail', maxCount: 1 }
]), createCourse);

// Protected: add lesson to course (instructor only) — accepts video upload
router.post('/:courseId/lessons', requireAuth, uploadForSupabase.fields([
  { name: 'video', maxCount: 1 }
]), addLessonToCourse);

// Protected: update course (instructor only) — accepts thumbnail upload
router.put('/:id', requireAuth, uploadForSupabase.fields([
  { name: 'thumbnail', maxCount: 1 }
]), updateCourse);

export default router;
