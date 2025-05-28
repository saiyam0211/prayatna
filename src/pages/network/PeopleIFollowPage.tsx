import React, { useState } from 'react';
import { UserPlus, UserCheck, Users, Heart } from 'lucide-react';

type Person = {
  id: number;
  name: string;
  title: string;
  avatar: string;
  mutualConnections: number;
  isActive: boolean;
};

const following: Person[] = [
  { id: 1, name: 'Samantha Lee', title: 'Software Engineer', avatar: 'https://i.pravatar.cc/150?img=11', mutualConnections: 5, isActive: true },
  { id: 2, name: 'Jason Park', title: 'Data Scientist', avatar: 'https://i.pravatar.cc/150?img=12', mutualConnections: 3, isActive: false },
  { id: 5, name: 'Alex Rivera', title: 'UX Designer', avatar: 'https://i.pravatar.cc/150?img=15', mutualConnections: 8, isActive: true },
];

const followers: Person[] = [
  { id: 3, name: 'Emily Carter', title: 'Product Designer', avatar: 'https://i.pravatar.cc/150?img=13', mutualConnections: 2, isActive: true },
  { id: 4, name: 'Daniel Kim', title: 'Marketing Manager', avatar: 'https://i.pravatar.cc/150?img=14', mutualConnections: 7, isActive: false },
  { id: 6, name: 'Maya Patel', title: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?img=16', mutualConnections: 4, isActive: true },
];

const PeopleIFollowPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [followState, setFollowState] = useState<Record<number, boolean>>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const data: Person[] = activeTab === 'following' ? following : followers;

  const toggleFollow = (id: number) => {
    setFollowState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '2rem' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#A484F3' }}
          >
            <Users size={28} color="white" />
          </div>
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: '#2D2D2D' }}
            >
              My Network
            </h1>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex gap-2 mb-8 p-2 rounded-xl" style={{ backgroundColor: '#F2F5F7' }}>
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'following' ? 'shadow-md transform scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: activeTab === 'following' ? '#4BA3C7' : 'transparent',
              color: activeTab === 'following' ? 'white' : '#6B7280'
            }}
            onClick={() => setActiveTab('following')}
          >
            <UserCheck size={18} />
            Following
            <span 
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: activeTab === 'following' ? 'rgba(255,255,255,0.2)' : '#A484F3',
                color: 'white'
              }}
            >
              {following.length}
            </span>
          </button>
          
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'followers' ? 'shadow-md transform scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: activeTab === 'followers' ? '#4BA3C7' : 'transparent',
              color: activeTab === 'followers' ? 'white' : '#6B7280'
            }}
            onClick={() => setActiveTab('followers')}
          >
            <Heart size={18} />
            Followers
            <span 
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: activeTab === 'followers' ? 'rgba(255,255,255,0.2)' : '#A484F3',
                color: 'white'
              }}
            >
              {followers.length}
            </span>
          </button>
        </div>

        {/* People List */}
        <div className="grid gap-4">
          {data.map((person) => (
            <div
              key={person.id}
              className={`p-6 rounded-xl transition-all duration-300 ${
                hoveredId === person.id ? 'shadow-lg transform translate-y-[-2px]' : 'shadow-md'
              }`}
              style={{ backgroundColor: '#F2F5F7' }}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between">
                {/* Person Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover border-3"
                      style={{ borderColor: '#4BA3C7' }}
                    />
                    {/* Activity Status */}
                    <div 
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 ${
                        person.isActive ? '' : 'opacity-40'
                      }`}
                      style={{ 
                        backgroundColor: person.isActive ? '#A2F0C1' : '#6B7280',
                        borderColor: '#F2F5F7'
                      }}
                    />
                  </div>
                  
                  <div>
                    <h3 
                      className="text-xl font-semibold mb-1"
                      style={{ color: '#2D2D2D' }}
                    >
                      {person.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#A484F3' }}
                      />
                      <p 
                        className="text-sm"
                        style={{ color: '#6B7280' }}
                      >
                        {person.title}
                      </p>
                    </div>
                    <p 
                      className="text-xs flex items-center gap-1"
                      style={{ color: '#7DDE92' }}
                    >
                      <Users size={12} />
                      {person.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {activeTab === 'following' ? (
                    <button
                      onClick={() => toggleFollow(person.id)}
                      className="flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                      style={{ 
                        backgroundColor: '#6B7280',
                        color: 'white'
                      }}
                    >
                      <UserCheck size={18} />
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleFollow(person.id)}
                      className="flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                      style={{
                        backgroundColor: followState[person.id] ? '#6B7280' : '#4BA3C7',
                        color: 'white'
                      }}
                    >
                      {followState[person.id] ? (
                        <>
                          <UserCheck size={18} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} />
                          Follow Back
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PeopleIFollowPage;
