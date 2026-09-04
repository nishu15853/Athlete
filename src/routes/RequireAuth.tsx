import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const SESSION_KEY = 'athletemind_session';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem(SESSION_KEY));

  if (!isAuthenticated) {
    // Redirect unauthenticated users to /login and preserve intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
