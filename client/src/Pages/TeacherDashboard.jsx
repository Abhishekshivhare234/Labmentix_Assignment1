import React, { useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { AuthContext } from '../components/Layout';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: null
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    video: null
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/enrollments/instructor-courses');
      setCourses(response.data.courses || []);
      console.log(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', formData.price);
      
      if (formData.thumbnail) {
        form.append('thumbnail', formData.thumbnail);
      }

      await api.post('/courses/create-course', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Course created successfully!');
      setFormData({ title: '', description: '', price: '', thumbnail: null });
      setShowCreateForm(false);
      fetchCourses(); // Refresh the courses list
    } catch (error) {
      setMessage('Failed to create course. Please try again.');
      console.error('Error creating course:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleLessonInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setLessonData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setLessonData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      const form = new FormData();
      form.append('title', lessonData.title);
      form.append('content', lessonData.content);
      
      if (lessonData.video) {
        form.append('video', lessonData.video);
      }

      await api.post(`/courses/${selectedCourse.id}/lessons`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Lesson added successfully!');
      setLessonData({ title: '', content: '', video: null });
      setShowLessonForm(false);
      setSelectedCourse(null);
      fetchCourses(); // Refetch courses to show updated lessons
    } catch (error) {
      setMessage('Failed to add lesson. Please try again.');
      console.error('Error adding lesson:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      if (formData.price) form.append('price', formData.price);
      if (formData.thumbnail) form.append('thumbnail', formData.thumbnail);

      await api.put(`/courses/${editingCourse.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Course updated successfully!');
      setFormData({ title: '', description: '', price: '', thumbnail: null });
      setShowEditForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      setMessage('Failed to update course. Please try again.');
      console.error('Error updating course:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'T'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Instructor
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              + Create Course
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((total, course) => total + (course.enrollments?.[0]?.count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎓</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
              <p className="text-gray-500 mb-4">Start sharing your knowledge by creating your first course!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/400x200"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{course.enrollments?.[0]?.count || 0} students</span>
                      <span>{course.price ? `₹${course.price}` : 'Free'}</span>
                    </div>
                    
                    {/* Lessons section */}
                    {course.lectures && course.lectures.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Lessons ({course.lectures.length}):
                        </p>
                        <div className="max-h-20 overflow-y-auto">
                          {course.lectures.map((lesson, index) => (
                            <div key={lesson.id} className="text-xs text-gray-600 mb-1 flex items-center">
                              <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">
                                {index + 1}
                              </span>
                              {lesson.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Created {new Date(course.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowLessonForm(true);
                          }}
                          className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                        >
                          Add Lesson
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCourse(course);
                            setFormData({
                              title: course.title,
                              description: course.description,
                              price: course.price || '',
                              thumbnail: null
                            });
                            setShowEditForm(true);
                          }}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Course Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter course title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what students will learn in this course"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Thumbnail
                    </label>
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload an image for your course (JPG, PNG, GIF)</p>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-gray-500 font-normal">(Leave empty for free course)</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Create Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showLessonForm && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Lesson to "{selectedCourse.title}"
                  </h2>
                  <button
                    onClick={() => {
                      setShowLessonForm(false);
                      setSelectedCourse(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleLessonSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      id="lessonTitle"
                      name="title"
                      required
                      value={lessonData.title}
                      onChange={handleLessonInputChange}
                      placeholder="Enter lesson title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="lessonContent" className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Content *
                    </label>
                    <textarea
                      id="lessonContent"
                      name="content"
                      required
                      rows={6}
                      value={lessonData.content}
                      onChange={handleLessonInputChange}
                      placeholder="Describe the lesson content, objectives, and materials"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="lessonVideo" className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Video
                    </label>
                    <input
                      type="file"
                      id="lessonVideo"
                      name="video"
                      accept="video/*"
                      onChange={handleLessonInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a video for this lesson (MP4, AVI, etc.)</p>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLessonForm(false);
                        setSelectedCourse(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {creating ? 'Adding...' : 'Add Lesson'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditForm && editingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Course</h2>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingCourse(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpdateCourse} className="space-y-6">
                  <div>
                    <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      id="editTitle"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="editDescription"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your course"
                    />
                  </div>

                  <div>
                    <label htmlFor="editPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="editPrice"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00 (Leave empty for free course)"
                    />
                  </div>

                  <div>
                    <label htmlFor="editThumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Thumbnail
                    </label>
                    <input
                      type="file"
                      id="editThumbnail"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a new thumbnail image (JPEG, PNG, etc.) - optional</p>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingCourse(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {creating ? 'Updating...' : 'Update Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
