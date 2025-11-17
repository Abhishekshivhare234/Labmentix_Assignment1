import { supabaseUser, supabaseAdmin } from "../config/supabaseClient.js";

// Create Lecture
export const createLecture = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

    const role = user.user_metadata?.role || user.role;
    if (role !== 'instructor' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: instructor role required' });
    }

    const { course_id, title, description } = req.body;
    if (!course_id || !title || !description) {
      return res.status(400).json({ error: "course_id, title and description are required" });
    }

    let video_url = null;
    if (req.file) {
      const file = req.file;
      const bucket = process.env.SUPABASE_LECTURE_VIDEO_BUCKET || 'lecture-videos';
      const fileExt = file.originalname.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      console.log("Bucket name:", bucket);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading lecture video:", uploadError);
        return res.status(500).json({ error: uploadError.message || "Upload failed" });
      }

      // Generate public or signed URL
      const { data: publicData, error: publicError } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      if (publicError) {
        console.error("Error getting video URL:", publicError);
        video_url = uploadData.path;
      } else {
        video_url = publicData.publicUrl;
      }
    }

    const newLecture = {
      course_id,
      title,
      description,
      video_url
    };

    // ❗ Use supabaseAdmin (service key) to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('lectures')
      .insert([newLecture])
      .select()
      .single();

    if (error) {
      console.error('Error inserting lecture into database:', error);
      return res.status(500).json({ error: error.message || 'Could not create lecture' });
    }

    return res.status(201).json({ lecture: data });

  } catch (error) {
    console.error('Error creating lecture:', error);
    return res.status(500).json({ error: 'Error creating lecture' });
  }
};


// Get Lectures by Course ID
export const getLecturesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) return res.status(400).json({ error: "courseId parameter is required" });

    const { data, error } = await supabaseAdmin
      .from('lectures')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching lectures:', error);
      return res.status(500).json({ error: error.message || 'Could not fetch lectures' });
    }

    return res.status(200).json({ lectures: data });
  } catch (err) {
    console.error('Error in getLecturesByCourseId:', err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
