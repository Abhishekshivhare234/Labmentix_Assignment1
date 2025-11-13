import { supabaseUser, supabaseAdmin } from "../config/supabaseClient.js";
import path from 'path';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ courses: data });
  } catch (err) {
    console.error('getAllCourses unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single course by ID with lessons
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Course id is required' });

    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return res.status(404).json({ error: 'Course not found' });
    }

    // Fetch lessons for this course
    const { data: lessons, error: lessonsError } = await supabaseAdmin
      .from('lectures')
      .select('*')
      .eq('course_id', id)
      .order('title', { ascending: true }); // Order by title since order_index doesn't exist

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      // Continue without lessons if there's an error
    }

    return res.status(200).json({ 
      course: {
        ...course,
        lessons: lessons || []
      }
    });
  } catch (err) {
    console.error('getCourseById unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

    console.log('Creating course, user role:', user);

    const role = user.user_metadata?.role || user.role;
    if (role !== 'instructor' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: instructor role required' });
    }

    const { title, description, price } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    let thumbnailUrl = null;

    // Handle thumbnail upload if provided
    if (req.files && req.files.thumbnail) {
      const thumbnailFile = req.files.thumbnail[0];
      
      try {
        // Use bucket name from environment variables
        const thumbnailBucket = process.env.SUPABASE_THUMBNAIL_BUCKET || 'course-thumbnails';
        
        // Create unique filename
        const fileExt = thumbnailFile.originalname.split('.').pop();
        const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from(thumbnailBucket)
          .upload(filePath, thumbnailFile.buffer, {
            contentType: thumbnailFile.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload thumbnail' });
        }

        // Get public URL from the same bucket
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(thumbnailBucket)
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrlData.publicUrl;
        
      } catch (storageError) {
        console.error('Storage operation error:', storageError);
        return res.status(500).json({ error: 'Failed to process thumbnail upload' });
      }
    }

    const courseData = {
      title,
      description,
      price: price ? parseFloat(price) : null,
      instructor_id: user.id,
      thumbnail: thumbnailUrl,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return res.status(400).json({ error: 'Failed to create course' });
    }

    return res.status(201).json({ 
      message: 'Course created successfully', 
      course: data 
    });
  } catch (err) {
    console.error('createCourse unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Add lesson to course
export const addLessonToCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { courseId } = req.params;
    const { title, content, order_index } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Check if user owns the course
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id !== user.id) {
      return res.status(403).json({ error: 'You can only add lessons to your own courses' });
    }

    let videoUrl = null;
    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      
      try {
        // Use bucket name from environment variables
        const videoBucket = process.env.SUPABASE_LECTURE_VIDEO_BUCKET || 'lecture-videos';
        
        // Create unique filename for video
        const fileExt = videoFile.originalname.split('.').pop();
        const fileName = `${user.id}_${courseId}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from(videoBucket)
          .upload(filePath, videoFile.buffer, {
            contentType: videoFile.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase video upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload video' });
        }

        // Get public URL from the same bucket
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(videoBucket)
          .getPublicUrl(filePath);

        videoUrl = publicUrlData.publicUrl;
        
      } catch (storageError) {
        console.error('Video storage operation error:', storageError);
        return res.status(500).json({ error: 'Failed to process video upload' });
      }
    }

    const lessonData = {
      course_id: courseId,
      title,
      description: content, // Map content to description column
      video_url: videoUrl,
        
    };

    const { data, error } = await supabaseAdmin
      .from('lectures')
      .insert([lessonData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      return res.status(400).json({ error: 'Failed to create lesson' });
    }

    return res.status(201).json({ 
      message: 'Lesson added successfully', 
      lesson: data 
    });
  } catch (err) {
    console.error('addLessonToCourse unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { title, description, price } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Check if user owns the course
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id !== user.id) {
      return res.status(403).json({ error: 'You can only update your own courses' });
    }

    let updateData = {
      title,
      description,
      price: price ? parseFloat(price) : null,
    };

    // Handle thumbnail upload if provided
    if (req.files && req.files.thumbnail) {
      const thumbnailFile = req.files.thumbnail[0];
      
      try {
        // Use bucket name from environment variables
        const thumbnailBucket = process.env.SUPABASE_THUMBNAIL_BUCKET || 'course-thumbnails';
        
        // Create unique filename
        const fileExt = thumbnailFile.originalname.split('.').pop();
        const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from(thumbnailBucket)
          .upload(filePath, thumbnailFile.buffer, {
            contentType: thumbnailFile.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload thumbnail' });
        }

        // Get public URL from the same bucket
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(thumbnailBucket)
          .getPublicUrl(filePath);

        updateData.thumbnail = publicUrlData.publicUrl;
        
      } catch (storageError) {
        console.error('Storage operation error:', storageError);
        return res.status(500).json({ error: 'Failed to process thumbnail upload' });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return res.status(400).json({ error: 'Failed to update course' });
    }

    return res.status(200).json({ 
      message: 'Course updated successfully', 
      course: data 
    });
  } catch (err) {
    console.error('updateCourse unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
