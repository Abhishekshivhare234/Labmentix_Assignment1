import {Router} from 'express';

import { requireAuth } from '../middlewares/auth.middleware.js';

import { createLecture,getLecturesByCourseId } from '../controllers/lecture.controller.js';
import { upload } from '../middlewares/uploaMiddleware.js';



const router=Router();

router.post('/create-lecture',requireAuth,upload.single('lecture-video'),createLecture);
router.get('/get-lectures/:courseId',requireAuth,getLecturesByCourseId);

export default router;






