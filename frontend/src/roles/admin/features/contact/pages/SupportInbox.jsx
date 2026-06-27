import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiEnvelope, HiCheckCircle, HiEnvelopeOpen, HiClock } from 'react-icons/hi2';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import api from '../../../../../api/axios';

const SupportInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, resolved

  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/messages');
      setMessages(res.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleResolve = async (id) => {
    try {
      const res = await api.patch(`/contact/messages/${id}/resolve`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'resolved' } : m));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resolve message');
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      const res = await api.post(`/contact/messages/${id}/reply`, { reply: replyText });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'resolved', reply: replyText } : m));
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reply');
    }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return m.status !== 'resolved';
    if (filter === 'resolved') return m.status === 'resolved';
    return true;
  });

  const unreadCount = messages.filter(m => m.status !== 'resolved').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HiEnvelope className="text-primary" /> Support Inbox
          </h1>
          <p className="text-sm text-slate-500 mt-1">Read and respond to queries sent from the Contact page.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner">
          {['all', 'unread', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {f} {f === 'unread' && unreadCount > 0 && <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading messages...</div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-20">
          <HiEnvelopeOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Inbox Zero!</h3>
          <p className="text-sm text-slate-500">No {filter !== 'all' ? filter : ''} messages found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`transition-all border-l-4 ${msg.status === 'resolved' ? 'border-emerald-500 opacity-75' : 'border-primary'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">{msg.subject}</h3>
                      {msg.status === 'resolved' ? (
                        <Badge variant="success" className="uppercase text-[10px] flex items-center gap-1"><HiCheckCircle /> Resolved</Badge>
                      ) : (
                        <Badge variant="warning" className="uppercase text-[10px]">Unread</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span>{msg.name}</span>
                      <span>•</span>
                      <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a>
                      <span>•</span>
                      <span className="flex items-center gap-1"><HiClock /> {new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {msg.message}
                    </div>

                    {/* Admin Reply Section */}
                    {msg.reply && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Admin Reply</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{msg.reply}</p>
                      </div>
                    )}

                    {replyingTo === msg._id && (
                      <div className="mt-4 space-y-2">
                        <textarea
                          autoFocus
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">Cancel</button>
                          <button onClick={() => handleReply(msg._id)} className="px-3 py-1.5 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-all">Send Reply</button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {msg.status !== 'resolved' && replyingTo !== msg._id && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => setReplyingTo(msg._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl shadow-sm transition-all text-sm"
                      >
                        <HiEnvelope className="w-5 h-5" /> Reply
                      </button>
                      <button
                        onClick={() => handleResolve(msg._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl shadow-sm transition-all text-sm"
                      >
                        <HiCheckCircle className="w-5 h-5" /> Resolve
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportInbox;
