import NetworkSidebar from '@/components/Network/NetworkSidebar';
import NetworkTabs from '@/components/Network/NetworkTabs';
import React from 'react';

import { Outlet } from 'react-router-dom';

const ConnectionLayout: React.FC = () => {
  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">
      <NetworkSidebar />
      <main className="flex-1 space-y-6">
        <NetworkTabs />
        <Outlet />
      </main>
    </div>
  );
};

export default ConnectionLayout;
