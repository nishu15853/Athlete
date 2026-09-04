import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const SESSION_KEY = 'athletemind_session';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem(SESSION_KEY));

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login, preserving the intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
