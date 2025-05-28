import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] via-[#F2F5F7] to-[#E5E7EB] overflow-hidden">
      {/* Student-themed decorative elements */}
      <div className="absolute inset-0 z-0">
        
        {/* PW Gurukulam branding elements */}
        {/* Book stack illustration - left side */}
        <div className="absolute -left-10 top-1/4 w-64 h-64 transform -rotate-12 animate-float-slow" style={{ opacity: 0.1 }}>
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4BA3C7] w-full h-full">
            {/* Stack of books */}
            <rect x="40" y="120" width="120" height="15" rx="2" fill="#4BA3C7"/>
            <rect x="45" y="100" width="110" height="15" rx="2" fill="#A484F3"/>
            <rect x="50" y="80" width="100" height="15" rx="2" fill="#7DDE92"/>
            <rect x="55" y="60" width="90" height="15" rx="2" fill="#4BA3C7"/>
            {/* Book pages */}
            <rect x="42" y="122" width="3" height="11" fill="white"/>
            <rect x="47" y="102" width="3" height="11" fill="white"/>
            <rect x="52" y="82" width="3" height="11" fill="white"/>
            <rect x="57" y="62" width="3" height="11" fill="white"/>
          </svg>
        </div>
        
        {/* Graduation cap - top right */}
        <div className="absolute -top-10 right-10 w-48 h-48 transform rotate-12 animate-float-slow" style={{ opacity: 0.1 }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A484F3] w-full h-full">
            <polygon points="50,20 20,35 50,50 80,35" fill="currentColor"/>
            <rect x="48" y="35" width="4" height="25" fill="currentColor"/>
            <circle cx="50" cy="62" r="3" fill="currentColor"/>
            <path d="M20,35 Q20,45 30,50 Q40,55 50,50" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Pencil illustration - bottom left */}
        <div className="absolute -bottom-10 -left-10 w-48 h-48 transform rotate-45 animate-float" style={{ opacity: 0.1 }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7DDE92] w-full h-full">
            <rect x="15" y="45" width="60" height="10" rx="5" fill="#F76E6E"/>
            <rect x="70" y="47" width="15" height="6" rx="3" fill="#2D2D2D"/>
            <polygon points="10,45 15,50 15,45" fill="#2D2D2D"/>
            <rect x="20" y="47" width="8" height="6" fill="#4BA3C7"/>
          </svg>
        </div>
        
        {/* Calculator - bottom right */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 animate-float-slow" style={{ opacity: 0.1 }}>
          <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4BA3C7] w-full h-full">
            <rect x="10" y="10" width="60" height="80" rx="5" fill="currentColor"/>
            <rect x="15" y="15" width="50" height="15" rx="2" fill="white"/>
            <circle cx="25" cy="45" r="4" fill="white"/>
            <circle cx="40" cy="45" r="4" fill="white"/>
            <circle cx="55" cy="45" r="4" fill="white"/>
            <circle cx="25" cy="60" r="4" fill="white"/>
            <circle cx="40" cy="60" r="4" fill="white"/>
            <circle cx="55" cy="60" r="4" fill="white"/>
            <circle cx="25" cy="75" r="4" fill="white"/>
            <circle cx="40" cy="75" r="4" fill="white"/>
            <circle cx="55" cy="75" r="4" fill="white"/>
          </svg>
        </div>
        
        {/* Scattered study icons */}
        {Array.from({ length: 8 }).map((_, i) => {
          const icons = [
            // Lightbulb
            <svg key="lightbulb" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
            </svg>,
            // Star
            <svg key="star" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>,
            // Trophy
            <svg key="trophy" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 10.31 16.31 13 13 13H11C7.69 13 5 10.31 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 15H15V16C15 16.55 14.55 17 14 17H10C9.45 17 9 16.55 9 16V15ZM8 18H16V19C16 19.55 15.55 20 15 20H9C8.45 20 8 19.55 8 20V18Z"/>
            </svg>
          ];
          const Icon = icons[i % icons.length];
          return (
            <div 
              key={i}
              className="absolute text-[#A484F3] animate-float"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                opacity: 0.08 + (Math.random() * 0.04),
                transform: `rotate(${Math.random() * 45}deg) scale(${0.8 + Math.random() * 0.4})`,
                width: '32px',
                height: '32px',
                animationDelay: `${i * 0.7}s`
              }}
            >
              {Icon}
            </div>
          );
        })}
        
        {/* Floating particles for dynamic effect */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`particle-${i}`}
            className="absolute rounded-full bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] opacity-20 animate-float"
            style={{
              top: `${10 + i * 10}%`,
              left: `${5 + i * 12}%`,
              width: `${6 + i * 3}px`,
              height: `${6 + i * 3}px`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content container with school theme styling */}
      <div className="relative rounded-3xl w-full max-w-md p-8 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(75,163,199,0.2)] z-10 border border-[#4BA3C7]/20">
        {/* PW Gurukulam brand accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4BA3C7] via-[#A484F3] to-[#7DDE92] rounded-t-3xl"></div>
        
        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4BA3C7]/5 via-transparent to-[#A484F3]/5 pointer-events-none"></div>
        
        {children}
      </div>
    </div>
  );
} 