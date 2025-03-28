import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin-page/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 