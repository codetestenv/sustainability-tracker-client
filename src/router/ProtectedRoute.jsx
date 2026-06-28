import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const AccessDeniedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
    </div>
  </div>
);

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles - if empty/undefined, any authenticated user can access
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isFirstLogin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isFirstLogin && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <AccessDeniedPage />;
  }

  return children;
};

export default ProtectedRoute;
