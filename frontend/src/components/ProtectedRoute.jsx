import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('ProtectedRoute - Auth State:', { isAuthenticated, user, loading, requiredRole });

  if (loading) {
    console.log('ProtectedRoute - Still loading...');
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/superadmin/login" replace />;
  }

  // Support array of roles
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user?.role)) {
      console.log('ProtectedRoute - Role mismatch:', user?.role, 'required:', roles);
      return <Navigate to="/" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted!');
  return children;
};

export default ProtectedRoute;
