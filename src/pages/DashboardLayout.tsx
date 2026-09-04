import React from 'react';
import { Outlet } from 'react-router-dom';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-brand-bgLight selection:bg-brand-cyan selection:text-brand-deepGreen">
      {/* Top Medical & Prototype Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Persistent MedTech Header / Navbar */}
      <Navbar />

      {/* Main Application Content Container with Fixed Left Navigation */}
      <div className="flex-1 flex flex-row w-full overflow-hidden">
        {/* Fixed Left Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
