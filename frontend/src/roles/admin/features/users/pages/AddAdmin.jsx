import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUserPlus, HiCheckCircle, HiShieldCheck, HiInformationCircle } from 'react-icons/hi2';
import Card from '../../../../../components/ui/Card';
import { useAuth } from '../../../../../context/AuthContext';
import { addAdmin } from '../../../../../features/users/user.service';

const AddAdmin = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const [form, setForm] = useState({ name: '', email: '', department: 'ECS', password: '', confirmPassword: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    
    try {
      await addAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
      });
      setSuccess(true);
      setForm({ name: '', email: '', department: 'ECS', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all';

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <HiUserPlus className="text-primary" /> Add Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isSuperAdmin
            ? 'Grant admin access to a faculty member or trusted user.'
            : 'As an Admin, you can add new admin accounts. You cannot delete existing admins.'}
        </p>
      </div>

      {/* Permission notice */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${isSuperAdmin ? 'bg-amber-500/10 border-amber-500/20' : 'bg-primary/5 border-primary/20'}`}>
        <HiShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSuperAdmin ? 'text-amber-500' : 'text-primary'}`} />
        <div>
          <p className={`text-sm font-bold ${isSuperAdmin ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
            {isSuperAdmin ? 'Super Admin Privilege' : 'Admin Privilege'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSuperAdmin
              ? 'You can add new admins and also delete existing admin accounts from User Management.'
              : 'You can add new admins. However, only the Super Admin can delete admin accounts.'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <h3 className="font-bold text-slate-800 dark:text-white mb-5">👤 New Admin Details</h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            <HiCheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Admin account created successfully!</p>
              <p className="text-xs mt-0.5 opacity-80">The new admin can now log in and manage club content.</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Dr. Priya Sharma" required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. admin@gprec.ac.in" required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Department</label>
              <select name="department" value={form.department} onChange={handleChange} className={inputCls}>
                {['ECS', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assign Role</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-sm">
                <HiShieldCheck className="w-5 h-5" /> Admin
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Role is fixed as Admin. Only superadmin is set at registration.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Temporary Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required className={inputCls} />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
            <HiInformationCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500">The new admin will be asked to change this temporary password on first login. They will have full access to event management, registrations, and team management.</p>
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <HiUserPlus className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Admin Account'}
          </motion.button>
        </form>
      </Card>
    </div>
  );
};

export default AddAdmin;
