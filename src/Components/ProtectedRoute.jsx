import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/authUtils';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * @param {object} props - Component props
 * @param {element} props.children - Child component to render if authenticated
 * @param {boolean} props.adminOnly - If true, only admin users can access
 * @returns {element} - Rendered component or redirect to login
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin-only route and user is not admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
