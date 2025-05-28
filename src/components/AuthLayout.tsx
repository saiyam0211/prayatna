import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-[80%] flex items-center justify-center relative overflow-hidden">
      {/* Main content container with improved styling */}
      <div className="relative rounded-2xl w-full max-w-md p-8 bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-10 border border-blue-50">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl"></div>
        {children}
      </div>
    </div>
  );
} 