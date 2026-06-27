import React, { useState, useEffect } from 'react';
import api from '../../../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiXMark } from 'react-icons/hi2';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ authorName: '', authorDept: '', text: '' });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('authorName', formData.authorName);
      form.append('authorDept', formData.authorDept);
      form.append('text', formData.text);
      if (image) form.append('image', image);

      await api.post('/reviews', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Review submitted successfully! It will appear once an admin approves it.');
      setIsModalOpen(false);
      setFormData({ authorName: '', authorDept: '', text: '' });
      setImage(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-slate-100 dark:bg-slate-900/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16">
          <h2 className="text-center sm:text-left text-3xl font-extrabold text-slate-800 dark:text-white">
            Voices of GPREC Coders
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
          >
            <HiPlus className="w-5 h-5" />
            Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No reviews available yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={r._id} className="glass p-8 rounded-2xl border border-slate-200/10 shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden group">
                {r.image && (
                  <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={`http://localhost:5000${r.image}`} alt="bg" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative z-10">
                  <span className="text-5xl text-primary/30 font-serif leading-none">“</span>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">{r.text}</p>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  {r.image ? (
                     <img src={`http://localhost:5000${r.image}`} alt={r.authorName} className="w-10 h-10 rounded-full object-cover shadow" />
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                       {r.authorName.charAt(0).toUpperCase()}
                     </div>
                  )}
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-xs">{r.authorName}</h5>
                    <p className="text-[10px] text-slate-500">{r.authorDept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Share Your Experience</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Your Name</label>
                    <input type="text" required value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" placeholder="e.g. Rahul K." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Department & Year</label>
                    <input type="text" value={formData.authorDept} onChange={e => setFormData({...formData, authorDept: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" placeholder="e.g. CSE 2024" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Review</label>
                  <textarea required rows={4} maxLength={500} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm resize-none" placeholder="What do you think about Coders Club?"></textarea>
                  <p className="text-right text-[10px] text-slate-400">{formData.text.length}/500</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Attach a Picture (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Reviews;
