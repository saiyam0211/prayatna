import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  X,
  MoreHorizontal,
  MapPin,
  Users,
  Briefcase,
  Star,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface Person {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  location: string;
  mutualConnections: number;
  skills: string[];
  isVerified: boolean;
  trending: boolean;
  experience: string;
  backgroundGradient: string;
}

const PeopleYouMayKnow: React.FC = () => {
  const [connectedPeople, setConnectedPeople] = useState<Set<number>>(new Set());
  const [dismissedPeople, setDismissedPeople] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());

  const people: Person[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Product Manager',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      location: 'San Francisco, CA',
      mutualConnections: 12,
      skills: ['Product Strategy', 'UX Design', 'Analytics'],
      isVerified: true,
      trending: true,
      experience: '5+ years',
      backgroundGradient: 'from-blue-400/20 to-purple-400/20',
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      title: 'Senior Full Stack Developer',
      company: 'StartupXYZ',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      location: 'New York, NY',
      mutualConnections: 8,
      skills: ['React', 'Node.js', 'TypeScript'],
      isVerified: false,
      trending: false,
      experience: '4+ years',
      backgroundGradient: 'from-green-400/20 to-blue-400/20',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Lead UX Designer',
      company: 'DesignStudio',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      location: 'Austin, TX',
      mutualConnections: 15,
      skills: ['UI/UX', 'Figma', 'Design Systems'],
      isVerified: true,
      trending: true,
      experience: '6+ years',
      backgroundGradient: 'from-purple-400/20 to-pink-400/20',
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Marketing Director',
      company: 'GrowthCo',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      location: 'Seattle, WA',
      mutualConnections: 6,
      skills: ['Digital Marketing', 'Growth Hacking', 'Analytics'],
      isVerified: false,
      trending: false,
      experience: '7+ years',
      backgroundGradient: 'from-orange-400/20 to-red-400/20',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Senior Data Scientist',
      company: 'AI Labs',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face',
      location: 'Boston, MA',
      mutualConnections: 23,
      skills: ['Machine Learning', 'Python', 'Data Analytics'],
      isVerified: true,
      trending: true,
      experience: '8+ years',
      backgroundGradient: 'from-cyan-400/20 to-blue-400/20',
    },
    {
      id: 6,
      name: 'Alex Morgan',
      title: 'Frontend Engineering Lead',
      company: 'WebCorp',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      location: 'Portland, OR',
      mutualConnections: 4,
      skills: ['React', 'Vue.js', 'Frontend Architecture'],
      isVerified: false,
      trending: false,
      experience: '5+ years',
      backgroundGradient: 'from-green-400/20 to-teal-400/20',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(new Set(people.map((p) => p.id)));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = (personId: number) => {
    setConnectedPeople((prev) => new Set([...prev, personId]));
  };

  const handleDismiss = (personId: number) => {
    setDismissedPeople((prev) => new Set([...prev, personId]));
  };

  const visiblePeople = people.filter((person) => !dismissedPeople.has(person.id));

  return (
    <section className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Add your UI rendering logic here as in original file */}
    </section>
  );
};

export default PeopleYouMayKnow;
