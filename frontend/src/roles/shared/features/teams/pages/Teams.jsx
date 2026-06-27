import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../../context/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import api from '../../../../../api/axios';

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rolePath = user?.role === 'superadmin' ? '/superadmin' : user?.role === 'admin' ? '/admin' : user?.role === 'member' ? '/member' : '/dashboard';

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Batch State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams');
        setBatches(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch teams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatch) return;
    setSubmitting(true);
    try {
      const res = await api.post('/teams', { batch: newBatch });
      setBatches([res.data.data, ...batches]);
      setIsModalOpen(false);
      setNewBatch('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create batch');
    } finally {
      setSubmitting(false);
    }
  };

  const gradients = [
    'from-violet-500 to-indigo-500',
    'from-blue-500 to-indigo-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-cyan-500'
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Our Teams</h1>
          <p className="text-sm text-slate-500">Meet the batch coordinators and core pillars of Coders Club</p>
        </div>
        {(user?.role === 'superadmin' || user?.role === 'admin') && (
          <Button onClick={() => setIsModalOpen(true)}>Create New Batch</Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          No teams found. { (user?.role === 'admin' || user?.role === 'superadmin') && 'Try creating a team batch by visiting the URL directly.' }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {batches.map((batch, idx) => (
            <motion.div
              key={batch.batch}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => navigate(`${rolePath}/teams/${batch.batch}/batch`)}
              className="cursor-pointer flex"
            >
              <Card className="p-0 overflow-hidden border border-slate-200/10 flex flex-col justify-between w-full min-h-[200px] hover:shadow-2xl transition-all duration-300">
                <div className={`p-8 bg-gradient-to-tr ${gradients[idx % gradients.length]} text-white flex-1 flex flex-col justify-between`}>
                  <div className="space-y-1">
                    <h3 className="text-4xl font-black">{batch.batch}</h3>
                    <p className="text-sm font-semibold opacity-90">Batch of {batch.batch}</p>
                  </div>
                  <div className="flex justify-between items-center pt-6">
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                      {batch.members?.length || 0} Active Members
                    </span>
                    <span className="text-xs font-bold underline">View Batch Page →</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Create New Batch</h3>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <Input
                label="Batch Year"
                type="number"
                placeholder="e.g. 2027"
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
                required
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" loading={submitting}>
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Teams;
