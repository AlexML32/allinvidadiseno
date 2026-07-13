import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && role && !roles.includes(role)) {
    // Redirigir al home correcto según rol
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'DELIVERY') return <Navigate to="/delivery/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
