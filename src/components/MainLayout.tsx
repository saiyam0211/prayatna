import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 