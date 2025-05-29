import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Home className="w-4 h-4 text-gray-400" />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && !item.isActive ? (
            <a
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={`font-medium ${
                item.isActive 
                  ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded-lg' 
                  : 'text-gray-900'
              }`}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 