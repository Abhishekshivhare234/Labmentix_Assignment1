import React, { useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { AuthContext } from '../components/Layout';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user?.role === 'student') {
      fetchEnrollments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments/my-enrollments');
      setEnrollments(response.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update the profile
    setEditing(false);
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                  <p className="text-gray-600 mb-3">{user?.email}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === 'instructor' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role === 'instructor' ? 'Instructor' : 'Student'}
                    </span>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {user?.role === 'instructor' ? 'Courses Created' : 'Courses Enrolled'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.progress >= 100).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">🏆</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.completed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled/Created Courses */}
        {user?.role === 'student' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Enrolled Courses</h2>
            
            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
                <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course!</p>
                <a
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Courses
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {enrollment.courses?.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {enrollment.courses?.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                          <span>
                            Progress: {enrollment.progress_percentage || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="ml-6 flex flex-col items-end space-y-2">
                        <div className="w-20">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress_percentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates about your courses and account</p>
              </div>
              <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                <p className="text-sm text-gray-500">Get notified about new courses and features</p>
              </div>
              <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
