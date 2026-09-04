import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { LandingPage } from '../pages/Public/LandingPage';
import { LoginPage } from '../pages/Public/LoginPage';
import { DashboardLayout } from '../pages/Protected/DashboardLayout';
import { LiveAnalysisPage } from '../pages/Protected/LiveAnalysisPage';
import { ExercisePage } from '../pages/Protected/ExercisePage';
import { SessionHistoryPage } from '../pages/Protected/SessionHistoryPage';
import { AboutPage } from '../pages/Protected/AboutPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route Hierarchy */}
        {/* / renders high-conversion LandingPage directly without bouncing to /login */}
        <Route path="/" element={<LandingPage />} />

        {/* /login is the dedicated authentication route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          {/* Default: Live Biomechanics Cockpit */}
          <Route index element={<LiveAnalysisPage />} />

          {/* Exercise Rep Counter & Depth Tracker */}
          <Route path="exercise" element={<ExercisePage />} />

          {/* Session History & Trend Analytics */}
          <Route path="history" element={<SessionHistoryPage />} />

          {/* Technical Documentation & Math */}
          <Route path="about" element={<AboutPage />} />

          {/* MedTech Overview preview */}
          <Route path="overview" element={<LandingPage />} />
        </Route>

        {/* Convenient top-level redirects into protected area */}
        <Route
          path="/exercise"
          element={
            <RequireAuth>
              <Navigate to="/dashboard/exercise" replace />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <Navigate to="/dashboard/history" replace />
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth>
              <Navigate to="/dashboard/about" replace />
            </RequireAuth>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
