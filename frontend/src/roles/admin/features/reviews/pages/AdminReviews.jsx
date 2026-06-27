import React, { useState, useEffect } from 'react';
import api from '../../../../../api/axios';
import { HiCheck, HiXMark, HiTrash } from 'react-icons/hi2';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import Spinner from '../../../../../components/ui/Spinner';
import Button from '../../../../../components/ui/Button';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/admin');
      setReviews(res.data.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      fetchReviews();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Review Moderation</h1>
          <p className="text-sm text-slate-500 mt-1">Manage public testimonials from users</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold shadow-sm"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredReviews.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          No reviews found.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => (
            <Card key={review._id} className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{review.authorName}</h3>
                    <p className="text-xs text-slate-500">{review.authorDept}</p>
                  </div>
                  <Badge variant={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'danger' : 'warning'}>
                    {review.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4">
                  "{review.text}"
                </p>

                {review.image && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 h-32 flex items-center justify-center">
                    <img src={`http://localhost:5000${review.image}`} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {review.status !== 'approved' && (
                  <button onClick={() => handleUpdateStatus(review._id, 'approved')} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="Approve">
                    <HiCheck className="w-5 h-5" />
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button onClick={() => handleUpdateStatus(review._id, 'rejected')} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title="Reject">
                    <HiXMark className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => handleDelete(review._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
