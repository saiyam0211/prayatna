import React from 'react';

const NetworkTabs: React.FC = () => {
  return (
    <div className="flex gap-4 border-b p-4">
      <button className="font-semibold border-b-2 border-blue-600">Suggestions</button>
      <button className="text-gray-500">Connections</button>
    </div>
  );
};

export default NetworkTabs;
