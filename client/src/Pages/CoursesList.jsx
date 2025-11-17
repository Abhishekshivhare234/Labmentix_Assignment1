import React, { useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { AuthContext } from '../components/Layout';

const CoursesList = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
    if (user?.role === 'student') {
      fetchEnrollments();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/get-courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments/my-enrollments');
      setEnrolledCourses(response.data.enrollments?.map(e => e.course_id) || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      setMessage('Please login to enroll in courses');
      return;
    }

    if (user.role !== 'student') {
      setMessage('Only students can enroll in courses');
      return;
    }

    setEnrolling(courseId);
    setMessage('');

    try {
      await api.post('/enrollments/enroll', { courseId });
      setMessage('Successfully enrolled in course!');
      fetchEnrollments(); // Refresh enrollments
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover new skills and advance your career with our comprehensive online courses
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg max-w-2xl mx-auto ${
            message.includes('Success') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No courses available yet</h3>
            <p className="text-gray-600">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={course.thumbnail || "https://via.placeholder.com/400x200?text=Course"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                      Course
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {course.price ? `₹${course.price}` : 'Free'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                    <span>0 students</span> {/* TODO: Add actual enrollment count */}
                  </div>
                  
                  {user ? (
                    <>
                      {user.role === 'student' ? (
                        <>
                          {isEnrolled(course.id) ? (
                            <button
                              className="w-full py-3 bg-green-100 text-green-800 rounded-lg font-medium cursor-default"
                              disabled
                            >
                              ✓ Enrolled
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrolling === course.id}
                              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                            >
                              {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-default"
                          disabled
                        >
                          Instructor View
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => setMessage('Please login to enroll in courses')}
                      className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Login to Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;