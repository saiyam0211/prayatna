// src/pages/NetworkPage.tsx (or wherever it resides)

import NetworkSidebar from '@/components/Network/NetworkSidebar';
import NetworkTabs from '@/components/Network/NetworkTabs';
import PeopleYouMayKnow from '@/components/Network/PeopleYouMayKnow';
import InvitationDemo from '@/components/Network/InvitationCard';
import React from 'react';



const NetworkPage: React.FC = () => {
  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

      <main className="flex-1 space-y-6">
      
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Invitations</h2>
           <InvitationDemo/> 
        </section>
        <PeopleYouMayKnow />
      </main>
    </div>
  );
};

export default NetworkPage;
