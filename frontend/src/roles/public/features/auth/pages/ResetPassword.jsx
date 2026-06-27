import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLockClosed } from 'react-icons/hi2';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import Card from '../../../../../components/ui/Card';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // Mock reset
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-primary-950 to-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card glass={true} hoverEffect={false} className="border border-white/10 p-8">
          <div className="flex flex-col items-center mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-white">New Password</h2>
            <p className="text-slate-400 text-sm mt-1">Set a secure password for your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center">
              Password has been updated. Redirecting to login...
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={onChange}
                icon={HiLockClosed}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={onChange}
                icon={HiLockClosed}
                required
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
                Save Password
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
