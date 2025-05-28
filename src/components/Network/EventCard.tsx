import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Bookmark, Share2 } from 'lucide-react';

interface Event {
  title: string;
  date: string;
  endDate?: string;
  image?: string;
  location: string;
  venue?: string;
  description: string;
  attendees?: number;
  price?: string | number;
  category?: string;
  isRegistered?: boolean;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div
      className={`rounded-xl transition-all duration-300 overflow-hidden ${
        isHovered ? 'shadow-xl transform translate-y-[-4px]' : 'shadow-lg'
      }`}
      style={{ backgroundColor: '#F2F5F7' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div
        className="h-48 relative"
        style={{
          background: `linear-gradient(135deg, #4BA3C7 0%, #A484F3 100%)`,
        }}
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Calendar size={48} color="white" opacity={0.8} />
          </div>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: event.image
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'
              : 'transparent',
          }}
        />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleBookmark}
            className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: isBookmarked ? '#7DDE92' : 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'white' : 'none'} />
          </button>
          <button
            className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Category */}
        {event.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
          >
            {event.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 line-clamp-2" style={{ color: '#2D2D2D' }}>
          {event.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#4BA3C7' }}>
            <Clock size={16} color="white" />
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: '#2D2D2D' }}>
              {formatDate(event.date)}
            </p>
            {event.endDate && (
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Until {formatDate(event.endDate)}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#A484F3' }}>
            <MapPin size={16} color="white" />
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: '#2D2D2D' }}>
              {event.location}
            </p>
            {event.venue && (
              <p className="text-xs" style={{ color: '#6B7280' }}>
                {event.venue}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
          {event.description}
        </p>

        {/* Attendees */}
        {event.attendees && (
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#7DDE92' }}>
              <Users size={16} color="white" />
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {event.attendees} people attending
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
            style={{ backgroundColor: '#4BA3C7', color: 'white' }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#7DDE92';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#4BA3C7';
            }}
          >
            {event.isRegistered ? 'View Details' : 'Register Now'}
          </button>

          {event.price && (
            <div
              className="flex items-center px-4 py-3 rounded-lg font-bold"
              style={{ backgroundColor: '#A2F0C1', color: '#2D2D2D' }}
            >
              {event.price === 'Free' ? 'FREE' : `$${event.price}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
