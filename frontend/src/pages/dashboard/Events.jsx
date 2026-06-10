import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiPlus, HiMagnifyingGlass, HiCalendarDays, HiMapPin } from 'react-icons/hi2';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [categoryFilter, statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const categoryParam = categoryFilter === 'All' ? '' : categoryFilter.toLowerCase();
      const statusParam = statusFilter === 'all' ? '' : statusFilter;
      
      const res = await api.get(`/events?category=${categoryParam}&status=${statusParam}`);
      setEvents(res.data.data);
    } catch (err) {
      // Mock events on fetch failure
      const mockEvents = [
        {
          _id: '1',
          name: 'Code Sprint 2026',
          category: 'competition',
          banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
          description: 'Sharpen algorithms and logic skills.',
          venue: 'CSE Seminar Hall',
          date: '2026-10-15T10:00:00Z',
          time: '10:00 AM',
          status: 'upcoming',
          registrationFee: 50,
          maxParticipants: 100,
        },
        {
          _id: '2',
          name: 'React Web Bootcamp',
          category: 'workshop',
          banner: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
          description: 'A 3-day deep dive into modern frontend frameworks.',
          venue: 'Computer Lab 3',
          date: '2026-11-05T09:00:00Z',
          time: '09:00 AM',
          status: 'upcoming',
          registrationFee: 0,
          maxParticipants: 60,
        },
        {
          _id: '3',
          name: 'Hackathon 5.0',
          category: 'hackathon',
          banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
          description: 'Building solutions for local admin challenges.',
          venue: 'Auditorium',
          date: '2026-06-12T09:00:00Z',
          time: '09:00 AM',
          status: 'ongoing',
          registrationFee: 100,
          maxParticipants: 200,
        },
        {
          _id: '4',
          name: 'DSA Foundation Course',
          category: 'seminar',
          banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
          description: 'Learn stacks, queues, and tree traversals.',
          venue: 'Webinar Platform',
          date: '2026-05-10T14:00:00Z',
          time: '02:00 PM',
          status: 'completed',
          registrationFee: 0,
          maxParticipants: 500,
        }
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((evt) =>
    evt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <div className="space-y-8 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Coding Events</h1>
          <p className="text-sm text-slate-500">Explore technical sessions, bootcamps and competitions</p>
        </div>
        
        {isAdmin && (
          <Link
            to="/dashboard/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:bg-primary-600 hover:-translate-y-0.5"
          >
            <HiPlus className="w-5 h-5" />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        {/* Category dropdown & Status Tab buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold rounded-xl outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Categories</option>
            <option value="Workshop">Workshops</option>
            <option value="Hackathon">Hackathons</option>
            <option value="Competition">Competitions</option>
            <option value="Seminar">Seminars</option>
          </select>

          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-1 border border-slate-200/10">
            {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-slate-200/10">
          <p className="text-slate-500 font-medium">No events found matching current criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <motion.div
              key={evt._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex"
            >
              <Card className="flex flex-col justify-between overflow-hidden p-0 h-full w-full border border-slate-200/10 bg-white dark:bg-slate-900">
                {/* Banner Area */}
                <div className="h-44 relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img src={evt.banner} alt={evt.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute top-4 right-4">
                    <Badge variant={evt.status === 'upcoming' ? 'primary' : evt.status === 'ongoing' ? 'warning' : 'success'}>
                      {evt.status}
                    </Badge>
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider">{evt.category}</span>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{evt.name}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-200/20">
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-2"><HiCalendarDays className="text-primary w-4.5 h-4.5" /> {new Date(evt.date).toDateString()}</span>
                      <span className="flex items-center gap-2"><HiMapPin className="text-accent w-4.5 h-4.5" /> {evt.venue}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {evt.registrationFee === 0 ? 'Free' : `₹${evt.registrationFee}`}
                      </span>
                      <Link
                        to={`/dashboard/events/${evt._id}`}
                        className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-950 text-xs font-bold transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

import Spinner from '../../components/ui/Spinner';

export default Events;
