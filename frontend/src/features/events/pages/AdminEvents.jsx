import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCalendarDays, HiPlusCircle, HiPencilSquare, HiTrash, HiMagnifyingGlass, HiEye } from 'react-icons/hi2';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';
import { getAllEvents, deleteEvent, updateEvent } from '../event.service';

const categoryColors = {
  Contest: 'primary', Workshop: 'secondary', Hackathon: 'warning', Training: 'success',
};

const AdminEvents = () => {
  const { can } = useAuth();
  const canEdit = can?.editContent;
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event? This cannot be undone.')) {
      try {
        await deleteEvent(id);
        setEvents(prev => prev.filter(e => e._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const toggleStatus = async (id) => {
    const targetEvent = events.find(e => e._id === id);
    if (!targetEvent) return;
    const newStatus = targetEvent.status === 'upcoming' ? 'completed' : 'upcoming';
    
    try {
      const fd = new FormData();
      fd.append('status', newStatus);
      const res = await updateEvent(id, fd);
      setEvents(prev => prev.map(e => e._id === id ? res.data.data : e));
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const counts = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    completed: events.filter(e => e.status === 'completed').length,
    totalRegistrations: events.reduce((sum, e) => sum + (e.registrations || 0), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HiCalendarDays className="text-primary" /> {canEdit ? 'Manage Events' : 'All Events (View Only)'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {canEdit ? 'Create, edit, delete and manage all club events.' : 'You have read-only access. Contact an admin to make changes.'}
          </p>
        </div>
        {canEdit && (
          <Link to="/dashboard/events/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
            <HiPlusCircle className="w-5 h-5" /> Create Event
          </Link>
        )}
      </div>
      {!canEdit && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          👁️ Club Member — Read-Only View. You can see all events but cannot create, edit, or delete.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: counts.total, color: 'text-slate-800 dark:text-white' },
          { label: 'Upcoming', value: counts.upcoming, color: 'text-primary' },
          { label: 'Completed', value: counts.completed, color: 'text-emerald-500' },
          { label: 'Total Registrations', value: counts.totalRegistrations, color: 'text-amber-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center py-4">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Events Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/60">
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase">Event</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden md:table-cell">Category</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Date</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase hidden lg:table-cell">Registrations</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {filtered.map((ev, idx) => (
                <motion.tr
                  key={ev._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800 dark:text-white">{ev.name}</p>
                    <p className="text-[10px] text-slate-500">by {ev.createdBy?.name || 'Unknown'}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <Badge variant={categoryColors[ev.category] || 'secondary'}>{ev.category}</Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell">{new Date(ev.date).toDateString()}</td>
                  <td className="px-5 py-4 text-center hidden lg:table-cell">
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      {ev.registrations || 0} / {ev.maxParticipants}
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${Math.min(100, ((ev.registrations || 0) / (ev.maxParticipants || 1)) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {canEdit ? (
                      <button onClick={() => toggleStatus(ev._id)}>
                        <Badge variant={ev.status === 'upcoming' ? 'primary' : 'success'}>{ev.status}</Badge>
                      </button>
                    ) : (
                      <Badge variant={ev.status === 'upcoming' ? 'primary' : 'success'}>{ev.status}</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/dashboard/events/${ev._id}`} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors" title="View">
                        <HiEye className="w-4 h-4" />
                      </Link>
                      {canEdit && (
                        <>
                          <Link to={`/dashboard/events/${ev._id}/edit`} className="p-2 rounded-lg hover:bg-secondary/10 text-secondary transition-colors" title="Edit">
                            <HiPencilSquare className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(ev._id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors" title="Delete">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading events...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <HiCalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No events found</p>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default AdminEvents;
