import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiClipboardDocumentList, HiCheckCircle, HiXCircle, HiMagnifyingGlass, HiEye } from 'react-icons/hi2';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';
import { getAllRegistrations, updateRegistrationStatus } from '../registration.service';

const mockRegistrations = [
  { _id: '1', student: 'Anish Reddy', rollNo: '22911A0501', dept: 'CSE', year: 3, event: 'Code Sprint 2026', registeredAt: '2026-06-08', status: 'pending', email: 'anish@gprec.ac.in' },
  { _id: '2', student: 'Harika K', rollNo: '22911A0342', dept: 'IT', year: 3, event: 'Web Dev Bootcamp', registeredAt: '2026-06-07', status: 'approved', email: 'harika@gprec.ac.in' },
  { _id: '3', student: 'Sai Kiran', rollNo: '22911A0412', dept: 'CSE', year: 2, event: 'Hackathon 4.0', registeredAt: '2026-06-06', status: 'pending', email: 'sai@gprec.ac.in' },
  { _id: '4', student: 'Venkatesh P', rollNo: '21911A0289', dept: 'ECE', year: 4, event: 'Code Sprint 2026', registeredAt: '2026-06-06', status: 'approved', email: 'venkat@gprec.ac.in' },
  { _id: '5', student: 'Divya S', rollNo: '22911A0514', dept: 'IT', year: 3, event: 'ML Workshop', registeredAt: '2026-06-05', status: 'rejected', email: 'divya@gprec.ac.in' },
  { _id: '6', student: 'Ravi Teja', rollNo: '23911A0167', dept: 'CSE', year: 2, event: 'ML Workshop', registeredAt: '2026-06-05', status: 'pending', email: 'ravi@gprec.ac.in' },
];

const AdminRegistrations = () => {
  const { can } = useAuth();
  const canEdit = can?.editContent;
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await getAllRegistrations();
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

  // Events map from actual registrations for the filter dropdown
  const events = ['all', ...new Set(registrations.map(r => r.eventId?.title || r.event))];

  const filtered = registrations.filter(r => {
    const studentName = r.name || r.student || r.userId?.name || '';
    const studentRoll = r.rollNo || r.userId?.rollNo || '';
    const eventName = r.eventId?.title || r.event || '';

    const matchSearch = studentName.toLowerCase().includes(search.toLowerCase()) ||
                        studentRoll.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchEvent = filterEvent === 'all' || eventName === filterEvent;
    return matchSearch && matchStatus && matchEvent;
  });

  const updateStatus = async (id, status) => {
    try {
      const res = await updateRegistrationStatus(id, status);
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: res.data.data.status } : r));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const counts = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <HiClipboardDocumentList className="text-primary" /> Registrations
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'text-slate-700 dark:text-white' },
          { label: 'Pending', value: counts.pending, color: 'text-amber-500' },
          { label: 'Approved', value: counts.approved, color: 'text-emerald-500' },
          { label: 'Rejected', value: counts.rejected, color: 'text-rose-500' },
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
            placeholder="Search by name or roll number..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filterEvent}
          onChange={e => setFilterEvent(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          {events.map(ev => <option key={ev} value={ev}>{ev === 'all' ? 'All Events' : ev}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/60">
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase">Student</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Roll No</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden md:table-cell">Event</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden lg:table-cell">Dept / Year</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {filtered.map((r, idx) => (
                <motion.tr
                  key={r._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 dark:text-white">{r.name || r.userId?.name}</p>
                    <p className="text-[10px] text-slate-500">{r.email || r.userId?.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell font-mono">{r.rollNo || r.userId?.rollNo}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 hidden md:table-cell text-xs">{r.eventId?.title || r.event}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <Badge variant="secondary">{r.branch || r.userId?.department} · Y{r.year || r.userId?.year}</Badge>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant={
                      r.status === 'approved' ? 'success' :
                      r.status === 'rejected' ? 'error' : 'warning'
                    }>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {canEdit ? (
                        <>
                          {r.status !== 'approved' && (
                            <button onClick={() => updateStatus(r._id, 'approved')}
                              className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors" title="Approve">
                              <HiCheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {r.status !== 'rejected' && (
                            <button onClick={() => updateStatus(r._id, 'rejected')}
                              className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors" title="Reject">
                              <HiXCircle className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading registrations...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <HiClipboardDocumentList className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No registrations found</p>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
