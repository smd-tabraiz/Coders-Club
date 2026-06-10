import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  HiUser, HiEnvelope, HiLockClosed, HiIdentification,
  HiPhone, HiEye, HiEyeSlash, HiAcademicCap
} from 'react-icons/hi2';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

const FieldGroup = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-400">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />}
      {children}
    </div>
  </div>
);

const inputCls = (hasIcon = true) =>
  `w-full py-3 ${hasIcon ? 'pl-12' : 'pl-4'} pr-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all text-sm`;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNo: '',
    department: 'CSE',
    year: '1',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({ ...formData, year: parseInt(formData.year) });
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-2xl shadow-xl shadow-primary/30 mb-3">
              CC
            </div>
            <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
            <p className="text-slate-400 text-sm mt-1">Join the official Coders Club GPREC community</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}
              <FieldGroup label="Full Name" icon={HiUser}>
                <input
                  type="text" name="name" placeholder="e.g. Anish Reddy"
                  value={formData.name} onChange={onChange} required
                  className={inputCls()}
                />
              </FieldGroup>

              {/* Roll Number */}
              <FieldGroup label="Roll Number" icon={HiIdentification}>
                <input
                  type="text" name="rollNo" placeholder="e.g. 22911A0501"
                  value={formData.rollNo} onChange={onChange} required
                  className={inputCls()}
                />
              </FieldGroup>

              {/* Email */}
              <FieldGroup label="Email Address" icon={HiEnvelope}>
                <input
                  type="email" name="email" placeholder="e.g. name@gprec.ac.in"
                  value={formData.email} onChange={onChange} required
                  className={inputCls()}
                />
              </FieldGroup>

              {/* Phone */}
              <FieldGroup label="Phone Number" icon={HiPhone}>
                <input
                  type="tel" name="phone" placeholder="e.g. +91 9876543210"
                  value={formData.phone} onChange={onChange}
                  className={inputCls()}
                />
              </FieldGroup>

              {/* Department */}
              <FieldGroup label="Department" icon={HiAcademicCap}>
                <select
                  name="department" value={formData.department} onChange={onChange}
                  className={inputCls()}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </FieldGroup>

              {/* Year */}
              <FieldGroup label="Year of Study" icon={HiAcademicCap}>
                <select
                  name="year" value={formData.year} onChange={onChange}
                  className={inputCls()}
                >
                  {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
              </FieldGroup>

              {/* Password */}
              <FieldGroup label="Password" icon={HiLockClosed}>
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password} onChange={onChange} required
                  className={`${inputCls()} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </FieldGroup>

              {/* Confirm Password */}
              <FieldGroup label="Confirm Password" icon={HiLockClosed}>
                <input
                  type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword} onChange={onChange} required
                  className={`${inputCls()} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirm ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </FieldGroup>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-300 hover:text-white font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
