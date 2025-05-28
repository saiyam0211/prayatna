import React from 'react';

const ConnectionsList: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
      {/* Map your connections here */}
      <p className="text-gray-500">You have 120 connections.</p>
    </div>
  );
};

export default ConnectionsList;