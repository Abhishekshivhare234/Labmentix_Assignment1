import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './Layout';

const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only redirect to login after loading is complete and user is still null
  if (!user) {
    return <Navigate to="/auth-register" replace />;
  }

  if (allowedRoles) {
    // Handle both string and array formats for allowedRoles
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!rolesArray.includes(user.role)) {
      return (
        <div className="p-8 max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600">You don't have permission to access this page.</p>
            <p className="text-sm text-red-500 mt-2">
              Required role: {rolesArray.join(', ')} | Your role: {user.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;