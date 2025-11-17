import { Router } from 'express';
import { enrollInCourse, getMyEnrollments, getInstructorCourses } from '../controllers/enrollment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Student enrollments
router.post('/enroll', requireAuth, enrollInCourse);
router.get('/my-enrollments', requireAuth, getMyEnrollments);

// Instructor courses
router.get('/instructor-courses', requireAuth, getInstructorCourses);

export default router;