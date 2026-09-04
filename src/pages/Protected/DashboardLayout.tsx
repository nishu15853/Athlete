import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-row overflow-hidden bg-brand-bgLight selection:bg-brand-cyan selection:text-brand-deepGreen">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Dynamic Route Content */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
