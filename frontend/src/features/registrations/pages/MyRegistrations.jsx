import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiClipboardDocumentList, HiCalendarDays, HiMagnifyingGlass } from 'react-icons/hi2';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { getMyRegistrations } from '../registration.service';

const statusVariant = (status) =>
  status === 'completed' ? 'success' : status === 'confirmed' ? 'primary' : 'warning';

const categoryColors = {
  Contest: 'primary', Workshop: 'secondary', Hackathon: 'warning', Training: 'success',
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await getMyRegistrations();
      setRegistrations(res.data.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filtered = registrations.filter(r => {
    const eventName = r.eventId?.title || r.event || '';
    const matchSearch = eventName.toLowerCase().includes(search.toLowerCase());
    // Mapped backend status to frontend display styles for this component
    const normalizedStatus = r.status === 'attended' || r.checkedIn ? 'completed' : r.status === 'approved' ? 'confirmed' : 'registered';
    const matchStatus = filterStatus === 'all' || normalizedStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: registrations.length,
    upcoming: registrations.filter(r => r.status !== 'attended' && !r.checkedIn).length,
    completed: registrations.filter(r => r.status === 'attended' || r.checkedIn).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <HiClipboardDocumentList className="text-primary" /> My Registrations
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track all your event registrations, statuses, and results.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-sm">
        {[
          { label: 'Total', value: counts.total, color: 'text-slate-800 dark:text-white' },
          { label: 'Upcoming', value: counts.upcoming, color: 'text-primary' },
          { label: 'Completed', value: counts.completed, color: 'text-emerald-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center py-3">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">All Status</option>
          <option value="registered">Registered</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((reg, idx) => (
          <motion.div
            key={reg._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="h-full flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight">{reg.event}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant={categoryColors[reg.category] || 'secondary'}>{reg.category}</Badge>
                    <Badge variant={statusVariant(reg.status)}>{reg.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <HiCalendarDays className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span><strong className="text-slate-600 dark:text-slate-300">Event Date:</strong> {new Date(reg.eventId?.date || reg.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0 text-center text-slate-400">📍</span>
                  <span><strong className="text-slate-600 dark:text-slate-300">Venue:</strong> {reg.eventId?.venue || reg.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0 text-center text-slate-400">📝</span>
                  <span><strong className="text-slate-600 dark:text-slate-300">Registered On:</strong> {new Date(reg.createdAt).toLocaleDateString()}</span>
                </div>
                {reg.feedback?.rating && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="text-base">⭐</span>
                    <span>Rated: {reg.feedback.rating}/5</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-slate-200/10">
                <Link to={`/dashboard/events`}
                  className="text-xs text-primary font-semibold hover:underline">
                  View Event Details →
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
        {loading ? (
          <div className="col-span-2 py-16 text-center text-slate-400">Loading registrations...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-400">
            <HiClipboardDocumentList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No registrations found</p>
            <Link to="/dashboard/events" className="mt-3 inline-block text-primary text-sm font-semibold hover:underline">Browse Events →</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyRegistrations;
