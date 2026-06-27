import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border border-white/10 p-8 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl">
          {/* Brand header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-2xl shadow-xl shadow-primary/30 mb-3">
              CC
            </div>
            <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-1">Access the Coders Club GPREC dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. name@gprec.ac.in"
                  value={formData.email}
                  onChange={onChange}
                  required
                  className="w-full py-3 pl-12 pr-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={onChange}
                  required
                  className="w-full py-3 pl-12 pr-12 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-xs">
              <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 font-semibold text-slate-400 hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold text-slate-300 hover:text-white transition-colors">
              Register
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
            <p className="text-[11px] text-slate-500">
              Demo: use any email (add <span className="text-slate-400 font-mono">admin</span> for admin role) · any password
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
