import React, { useEffect, useState, createContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import api from "../lib/api";

export const AuthContext = createContext(null);

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile on page load...');
        const res = await api.post('/auth/profile');
        console.log('Profile fetch response:', res.data);
        if (res?.data?.profile) {
          setUser(res.data.profile);
          console.log('User set successfully:', res.data.profile);
        } else {
          console.log('No profile data in response');
          setUser(null);
        }
      } catch (error) {
        console.error('Profile fetch failed:', error.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('Profile fetch completed, loading set to false');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err?.response?.data || err.message);
    }
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              EduWithUs
            </Link>

            <div className="flex items-center space-x-6">
              <Link to="/" className="text-white/90 hover:text-yellow-300 transition-colors font-medium">
                Home
              </Link>
              <Link to="/courses" className="text-white/90 hover:text-yellow-300 transition-colors font-medium">
                Courses
              </Link>
              <Link to="/contact" className="text-white/90 hover:text-yellow-300 transition-colors font-medium">
                Contact
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-blue-800 font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        👤 Profile
                      </Link>
                      <Link
                        to={user.role === 'instructor' ? '/teacher-dashboard' : '/student-dashboard'}
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {user.role === 'instructor' ? '🎓 Teacher Dashboard' : '📚 Student Dashboard'}
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth-register"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-semibold px-6 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="grow bg-gray-50">
          <Outlet />
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default Layout;
