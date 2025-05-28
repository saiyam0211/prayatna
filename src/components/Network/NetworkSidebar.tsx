import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Calendar, FileText, ChevronRight } from 'lucide-react';

// Define the shape of a navigation item
interface NavItem {
  label: string;
  icon: React.ReactNode;
  count: number;
  path: string;
}

const NetworkSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Connections');
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      label: 'Connections',
      icon: <Users size={20} />,
      count: 120,
      path: '/network/connections',
    },
    {
      label: 'People I Follow',
      icon: <UserPlus size={20} />,
      count: 85,
      path: '/network/people-i-follow',
    },
    {
      label: 'Events',
      icon: <Calendar size={20} />,
      count: 12,
      path: '/network/events',
    },
    {
      label: 'Pages',
      icon: <FileText size={20} />,
      count: 48,
      path: '/network/pages',
    },
  ];

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.label);
    navigate(item.path);
  };

  return (
    <aside className="w-72 h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] p-6 text-white">
        <h2 className="text-xl font-bold mb-1">My Network</h2>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                  activeItem === item.label
                    ? 'bg-gradient-to-r from-[#4BA3C7]/10 to-[#A484F3]/10 border-2 border-[#4BA3C7]/20 shadow-sm'
                    : 'hover:bg-[#F2F5F7] border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      activeItem === item.label
                        ? 'bg-[#4BA3C7] text-white'
                        : 'bg-[#F2F5F7] text-[#4BA3C7] group-hover:bg-[#4BA3C7] group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div
                      className={`font-semibold transition-colors ${
                        activeItem === item.label
                          ? 'text-[#2D2D2D]'
                          : 'text-[#2D2D2D] group-hover:text-[#2D2D2D]'
                      }`}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeItem === item.label
                        ? 'bg-[#7DDE92] text-[#2D2D2D]'
                        : 'bg-[#F2F5F7] text-[#6B7280] group-hover:bg-[#A484F3]/20 group-hover:text-[#A484F3]'
                    }`}
                  >
                    {item.count}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`transition-all ${
                      activeItem === item.label
                        ? 'text-[#4BA3C7] translate-x-1'
                        : 'text-[#6B7280] group-hover:text-[#4BA3C7] group-hover:translate-x-1'
                    }`}
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default NetworkSidebar;
