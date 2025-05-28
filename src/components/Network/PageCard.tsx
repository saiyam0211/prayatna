import React, { useState } from 'react';
import {
  CheckCircle,
  Plus,
  Bell,
  BellOff,
  Users,
  Building2,
  X,
} from 'lucide-react';

type Page = {
  name: string;
  logo: string;
  isVerified?: boolean;
  industry?: string;
  followers?: number;
  isFollowing?: boolean;
  notifications?: boolean;
};

type PageCardProps = {
  page: Page;
};

const PageCard: React.FC<PageCardProps> = ({ page }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(page.isFollowing || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(page.notifications || false);
  const [isFollowHovered, setIsFollowHovered] = useState<boolean>(false);

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
    if (isFollowing) setNotificationsEnabled(false);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <div
      className={`p-6 rounded-xl transition-all duration-300 ${
        isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
      }`}
      style={{ backgroundColor: '#F2F5F7' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - Page Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={page.logo}
              alt={page.name}
              className="w-16 h-16 rounded-full object-cover border-3 shadow-sm"
              style={{ borderColor: '#4BA3C7' }}
            />
            {page.isVerified && (
              <div
                className="absolute -bottom-1 -right-1 rounded-full p-1"
                style={{ backgroundColor: '#A2F0C1' }}
              >
                <CheckCircle size={16} color="#2D2D2D" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{page.name}</h3>
              {page.isVerified && (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Building2 size={14} className="text-purple-400" />
              <p className="text-sm text-gray-500">{page.industry}</p>
            </div>

            <div className="flex items-center gap-1">
              <Users size={12} className="text-green-400" />
              <p className="text-xs font-medium text-green-400">
                {page.followers ? `${page.followers.toLocaleString()} followers` : 'New page'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {isFollowing && (
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: notificationsEnabled ? '#A484F3' : 'transparent',
                color: notificationsEnabled ? 'white' : '#6B7280',
              }}
              onMouseEnter={(e) => {
                if (!notificationsEnabled) {
                  (e.target as HTMLElement).style.backgroundColor = '#A484F3';
                  (e.target as HTMLElement).style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!notificationsEnabled) {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLElement).style.color = '#6B7280';
                }
              }}
            >
              {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            </button>
          )}

          <button
            onClick={toggleFollow}
            onMouseEnter={() => setIsFollowHovered(true)}
            onMouseLeave={() => setIsFollowHovered(false)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
            style={{
              backgroundColor: isFollowing
                ? isFollowHovered
                  ? '#F76E6E'
                  : '#6B7280'
                : '#4BA3C7',
              color: 'white',
            }}
          >
            {isFollowing ? (
              isFollowHovered ? (
                <>
                  <X size={18} />
                  Unfollow
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Following
                </>
              )
            ) : (
              <>
                <Plus size={18} />
                Follow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
