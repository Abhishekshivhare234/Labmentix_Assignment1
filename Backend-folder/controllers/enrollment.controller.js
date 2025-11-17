import { supabaseUser, supabaseAdmin } from "../config/supabaseClient.js";

// Enroll student in a course
export const enrollInCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { course_id } = req.body;
    if (!course_id) {
      return res.status(400).json({ error: 'course_id is required' });
    }

    // Check if already enrolled
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .insert([
        {
          user_id: user.id,
          course_id: course_id,
          enrolled_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating enrollment:', error);
      return res.status(500).json({ error: 'Could not enroll in course' });
    }

    return res.status(201).json({ message: 'Successfully enrolled', enrollment: data });
  } catch (err) {
    console.error('Enrollment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's enrollments with course details and progress
export const getMyEnrollments = async (req, res) => {
  try {
    const { data: enrollments, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          description,
          price,
          thumbnail,
          created_at,
          instructor_id
        )
      `)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch enrollments' });
    }

    // Add progress percentage calculation (placeholder for now)
    const enrichedEnrollments = enrollments.map(enrollment => ({
      ...enrollment,
      progress_percentage: Math.floor(Math.random() * 100) // Replace with actual progress calculation
    }));

    res.json({ 
      enrollments: enrichedEnrollments,
      count: enrollments.length 
    });
  } catch (error) {
    console.error('Error in getMyEnrollments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get courses created by instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

    if (user.user_metadata?.role !== 'instructor' && user.role !== 'instructor') {
      return res.status(403).json({ error: 'Instructor access required' });
    }

    const { data, error } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        enrollments (count),
        lectures (
          id,
          title,
          description,
          video_url
        )
      `)
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching instructor courses:', error);
      return res.status(500).json({ error: 'Could not fetch courses' });
    }

    return res.status(200).json({ courses: data || [] });
  } catch (err) {
    console.error('Get instructor courses error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};