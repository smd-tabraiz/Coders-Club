import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiBell, HiCheckCircle, HiPaperAirplane, HiTrash } from 'react-icons/hi2';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import api from '../../../api/axios';

const pastNotifications = [
  { id: 1, title: 'Code Sprint 2026 Registration Open', message: 'Registration for Code Sprint 2026 is now open. Register before June 20th.', target: 'All Members', sentAt: '2026-06-08 10:00 AM', type: 'event' },
  { id: 2, title: 'Hackathon 4.0 Results', message: 'Congratulations to all participants! Merit list is now published on the portal.', target: 'All Members', sentAt: '2026-05-28 03:00 PM', type: 'result' },
  { id: 3, title: 'New DSA Class Schedule', message: 'DSA classes will now be held every Tuesday and Thursday from 4–6 PM.', target: 'Members', sentAt: '2026-05-25 09:00 AM', type: 'general' },
];

const TYPES = ['general', 'event', 'result', 'announcement', 'warning'];
const TARGETS = ['All Members', 'Members Only', 'Admins Only', 'Specific Department'];

const AdminNotifications = () => {
  const [form, setForm] = useState({ title: '', message: '', type: 'general', target: 'All Members' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(pastNotifications);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    
    setLoading(true);
    try {
      await api.post('/notifications', form);
      
      const newNotif = {
        id: Date.now(),
        title: form.title,
        message: form.message,
        target: form.target,
        sentAt: new Date().toLocaleString(),
        type: form.type,
      };
      setHistory(prev => [newNotif, ...prev]);
      setSent(true);
      setForm({ title: '', message: '', type: 'general', target: 'All Members' });
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error('Failed to send notification', err);
      alert('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(n => n.id !== id));
  };

  const typeColor = (type) => {
    switch (type) {
      case 'event': return 'primary';
      case 'result': return 'success';
      case 'warning': return 'warning';
      case 'announcement': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <HiBell className="text-primary" /> Send Notification
        </h1>
        <p className="text-sm text-slate-500 mt-1">Broadcast announcements to members, admins, or specific groups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compose Form */}
        <Card>
          <h3 className="font-bold text-slate-800 dark:text-white mb-5 text-base">✍️ Compose Notification</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Hackathon Registration Open"
                required
                className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Type your announcement here..."
                required
                className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm capitalize"
                >
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Send To</label>
                <select
                  name="target"
                  value={form.target}
                  onChange={handleChange}
                  className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  {TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <HiPaperAirplane className="w-5 h-5" /> {loading ? 'Sending...' : 'Send Notification'}
            </motion.button>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-500 font-semibold text-sm justify-center"
              >
                <HiCheckCircle className="w-5 h-5" /> Notification sent successfully!
              </motion.div>
            )}
          </form>
        </Card>

        {/* Send History */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">📜 Sent History</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {history.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{n.title}</p>
                        <Badge variant={typeColor(n.type)}>{n.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                    </div>
                    <button onClick={() => handleDelete(n.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors flex-shrink-0">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/10">
                    <span>📤 {n.target}</span>
                    <span>{n.sentAt}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
            {history.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <HiBell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notifications sent yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
