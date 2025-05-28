import React, { useState, MouseEvent } from 'react';
import { MoreVertical, Trash2, MessageCircle, Users } from 'lucide-react';

// Define the connection type
type Connection = {
  id: number;
  name: string;
  title: string;
  avatar: string;
  isOnline: boolean;
};

const dummyConnections: Connection[] = [
  { id: 1, name: 'Alice Johnson', title: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?img=1', isOnline: true },
  { id: 2, name: 'Bob Smith', title: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=2', isOnline: false },
  { id: 3, name: 'Carla Diaz', title: 'UX Designer', avatar: 'https://i.pravatar.cc/150?img=3', isOnline: true },
  { id: 4, name: 'David Kim', title: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?img=4', isOnline: false },
  { id: 5, name: 'Emma Wilson', title: 'Data Scientist', avatar: 'https://i.pravatar.cc/150?img=5', isOnline: true },
];

const ConnectionsPage: React.FC = () => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const closeMenu = () => {
    setMenuOpenId(null);
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '2rem' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#4BA3C7' }}>
            <Users size={24} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#2D2D2D' }}>
              {dummyConnections.length} Connections
            </h1>
          </div>
        </div>

        {/* Connections Grid */}
        <div className="grid gap-4">
          {dummyConnections.map((connection) => (
            <div
              key={connection.id}
              className={`p-6 rounded-xl transition-all duration-300 relative ${
                hoveredId === connection.id ? 'shadow-lg transform translate-y-[-2px]' : 'shadow-md'
              }`}
              style={{ backgroundColor: '#F2F5F7' }}
              onMouseEnter={() => setHoveredId(connection.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex justify-between items-center">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-16 h-16 rounded-full object-cover border-3"
                      style={{ borderColor: '#4BA3C7' }}
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 ${
                        connection.isOnline ? '' : 'opacity-30'
                      }`}
                      style={{
                        backgroundColor: connection.isOnline ? '#A2F0C1' : '#6B7280',
                        borderColor: '#F2F5F7',
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1" style={{ color: '#2D2D2D' }}>
                      {connection.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A484F3' }} />
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {connection.title}
                      </p>
                    </div>
                    <p className="text-xs mt-1" style={{ color: connection.isOnline ? '#7DDE92' : '#6B7280' }}>
                      {connection.isOnline ? 'Online now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                    style={{ backgroundColor: '#4BA3C7', color: 'white' }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#7DDE92';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#4BA3C7';
                    }}
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(connection.id)}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{
                        backgroundColor: menuOpenId === connection.id ? '#A484F3' : 'transparent',
                        color: menuOpenId === connection.id ? 'white' : '#6B7280',
                      }}
                      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                        if (menuOpenId !== connection.id) {
                          (e.target as HTMLButtonElement).style.backgroundColor = '#A484F3';
                          (e.target as HTMLButtonElement).style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                        if (menuOpenId !== connection.id) {
                          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                          (e.target as HTMLButtonElement).style.color = '#6B7280';
                        }
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* Dropdown */}
                    {menuOpenId === connection.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeMenu} />
                        <div
                          className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl z-20 border overflow-hidden"
                          style={{ backgroundColor: 'white', borderColor: '#4BA3C7' }}
                        >
                          <button
                            className="flex items-center w-full px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
                            style={{ color: '#F76E6E' }}
                            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                              (e.target as HTMLButtonElement).style.backgroundColor = '#F76E6E';
                              (e.target as HTMLButtonElement).style.color = 'white';
                            }}
                            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                              (e.target as HTMLButtonElement).style.color = '#F76E6E';
                            }}
                            onClick={() => {
                              alert(`Remove ${connection.name}`);
                              closeMenu();
                            }}
                          >
                            <Trash2 size={16} className="mr-3" />
                            Remove Connection
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
