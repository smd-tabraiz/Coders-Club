import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiEnvelope, HiCheckCircle } from 'react-icons/hi2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-2xl shadow-xl shadow-primary/30 mb-3">
              CC
            </div>
            <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
            <p className="text-slate-400 text-sm mt-1">We'll send a recovery link to your inbox</p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <HiCheckCircle className="w-12 h-12 text-emerald-400" />
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  If the email exists, a password reset link has been sent to <strong>{email}</strong>.
                </div>
              </div>
              <Link to="/login" className="block text-slate-300 hover:text-white font-bold text-sm transition-colors">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Registered Email</label>
                <div className="relative">
                  <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@gprec.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full py-3 pl-12 pr-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">
                  ← Cancel and go back
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
