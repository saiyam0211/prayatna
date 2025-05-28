import React from 'react';
import { Building2 } from 'lucide-react';
import PageCard from '@/components/Network/PageCard';


type Page = {
  id: number;
  name: string;
  industry: string;
  logo: string;
  followers: number;
  isVerified: boolean;
  isFollowing: boolean;
  notifications: boolean;
};

const PagesIFollow: React.FC = () => {
  const samplePages: Page[] = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      industry: 'Software Development',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
      followers: 12500,
      isVerified: true,
      isFollowing: true,
      notifications: true,
    },
    {
      id: 2,
      name: 'Creative Design Studio',
      industry: 'Graphic Design',
      logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=150&h=150&fit=crop',
      followers: 8900,
      isVerified: false,
      isFollowing: false,
      notifications: false,
    },
    {
      id: 3,
      name: 'InnovateLab',
      industry: 'Research & Development',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop',
      followers: 25600,
      isVerified: true,
      isFollowing: true,
      notifications: false,
    },
    {
      id: 4,
      name: 'Digital Marketing Pro',
      industry: 'Marketing & Advertising',
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop',
      followers: 5200,
      isVerified: false,
      isFollowing: false,
      notifications: false,
    },
    {
      id: 5,
      name: 'EcoSustain',
      industry: 'Environmental Technology',
      logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop',
      followers: 18300,
      isVerified: true,
      isFollowing: false,
      notifications: false,
    },
  ];

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#4BA3C7' }}>
            <Building2 size={28} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#2D2D2D' }}>
              Pages & Organizations
            </h1>
            <p style={{ color: '#6B7280' }}>
              Discover and follow amazing companies and organizations
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {samplePages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagesIFollow;
