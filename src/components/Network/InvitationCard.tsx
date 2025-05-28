import React, { useState, FC } from 'react';

type InvitationCardProps = {
  name: string;
  mutuals: number;
  image: string;
};

const InvitationCard: FC<InvitationCardProps> = ({ name, mutuals, image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center justify-between p-5 rounded-lg transition-all duration-200 ${
        isHovered ? 'shadow-lg transform translate-y-[-2px]' : 'shadow-md'
      }`}
      style={{ backgroundColor: '#F2F5F7' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-2"
            style={{ borderColor: '#4BA3C7' }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
            style={{ backgroundColor: 'green', borderColor: '#F2F5F7' }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg" style={{ color: '#2D2D2D' }}>
            {name}
          </h3>
          <p className="text-sm flex items-center gap-1" style={{ color: '#6B7280' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A484F3' }}></span>
            {mutuals} mutual connections
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 hover:scale-105"
          style={{
            borderColor: '#6B7280',
            color: '#6B7280',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#6B7280';
            (e.target as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.target as HTMLButtonElement).style.color = '#6B7280';
          }}
        >
          Ignore
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
          style={{ backgroundColor: '#4BA3C7' }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#7DDE92';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#4BA3C7';
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const InvitationDemo: FC = () => {
  const sampleData: InvitationCardProps[] = [
    {
      name: 'Sarah Johnson',
      mutuals: 12,
      image:
        'https://images.unsplash.com/photo-1494790108755-2616c375c6f0?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Alex Chen',
      mutuals: 8,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Maria Garcia',
      mutuals: 15,
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-full mx-auto space-y-4">
        {sampleData.map((person, index) => (
          <InvitationCard
            key={index}
            name={person.name}
            mutuals={person.mutuals}
            image={person.image}
          />
        ))}
      </div>
    </div>
  );
};

export default InvitationDemo;
