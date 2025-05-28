import EventCard from "@/components/Network/EventCard";
import React from "react";


// Define the Event type
type Event = {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  venue?: string;
  description: string;
  category: string;
  attendees: number;
  price: string;
  isRegistered: boolean;
  image?: string;
};

const EventsPage: React.FC = () => {
  const sampleEvents: Event[] = [
    {
      id: 1,
      title: 'React Developer Meetup',
      date: '2025-06-15T18:00:00',
      location: 'Downtown Tech Hub',
      venue: 'Conference Room A',
      description: 'Join us for an evening of React development discussions, networking, and learning from industry experts.',
      category: 'Technology',
      attendees: 45,
      price: 'Free',
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Design Thinking Workshop',
      date: '2025-06-20T10:00:00',
      endDate: '2025-06-20T16:00:00',
      location: 'Creative Space Mumbai',
      description: 'Learn the fundamentals of design thinking through hands-on exercises and real-world case studies.',
      category: 'Design',
      attendees: 28,
      price: '299',
      isRegistered: true
    },
    {
      id: 3,
      title: 'Startup Pitch Night',
      date: '2025-06-25T19:00:00',
      location: 'Innovation Center',
      venue: 'Main Auditorium',
      description: 'Watch promising startups pitch their ideas to investors and industry leaders in this exciting evening event.',
      category: 'Business',
      attendees: 120,
      price: 'Free',
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2D2D2D' }}>
          Upcoming Events
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
