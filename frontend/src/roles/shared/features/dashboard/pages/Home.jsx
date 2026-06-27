import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  HiOutlineCalendar, HiOutlineTicket, HiOutlineAcademicCap, HiOutlineTrophy,
  HiOutlineUsers, HiOutlineChartBar, HiOutlineBell, HiOutlineCog6Tooth,
  HiOutlineUserGroup, HiOutlinePhoto, HiOutlineShieldCheck, HiOutlineEye,
  HiOutlineClipboardDocumentList, HiOutlinePlusCircle, HiOutlineUserPlus,
  HiArrowRight, HiLockClosed,
} from 'react-icons/hi2';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import api from '../../../../../api/axios';

// ─── Shared Components ────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, gradient, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card className="flex items-center gap-4 h-full">
      <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${gradient} text-white shadow-lg flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{value}</p>
        <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-tight">{label}</p>
      </div>
    </Card>
  </motion.div>
);

const QuickAction = ({ title, desc, to, icon: Icon, gradient }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}
      className={`p-5 rounded-2xl bg-gradient-to-tr ${gradient} text-white shadow-lg cursor-pointer h-full`}
    >
      <Icon className="w-7 h-7 mb-3 opacity-90" />
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-[11px] opacity-75 mt-1 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-1 mt-3 text-xs font-bold opacity-90">Go <HiArrowRight className="w-3 h-3" /></div>
    </motion.div>
  </Link>
);

// ─── Super Admin Dashboard ────────────────────────────────────────────────────

const SuperAdminDashboard = ({ user }) => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalEvents: 0,
    adminCount: 0,
    certificates: 0,
    recentUsers: [],
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes] = await Promise.all([
          api.get('/users'),
          api.get('/events')
        ]);
        const users = usersRes.data.data || [];
        const events = eventsRes.data.data || [];
        
        const admins = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
        // Sort descending by creation date
        const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setData({
          totalUsers: users.length,
          totalEvents: events.length,
          adminCount: admins.length,
          certificates: 0, // Placeholder
          recentUsers: sortedUsers.slice(0, 4),
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Users',   value: data.totalUsers, icon: HiOutlineUsers,    gradient: 'from-primary to-secondary' },
    { label: 'Total Events',  value: data.totalEvents,  icon: HiOutlineCalendar, gradient: 'from-secondary to-accent' },
    { label: 'Admin Accounts',value: data.adminCount,   icon: HiOutlineShieldCheck, gradient: 'from-amber-400 to-rose-500' },
    { label: 'Certificates',  value: data.certificates, icon: HiOutlineAcademicCap, gradient: 'from-emerald-400 to-teal-500' },
  ];
  const actions = [
    { title: 'User Management',   desc: 'Manage all users & roles',         to: '/superadmin/users',     icon: HiOutlineUsers,    gradient: 'from-primary to-secondary' },
    { title: 'Add Admin',         desc: 'Create new admin accounts',        to: '/superadmin/add-admin',      icon: HiOutlineUserPlus, gradient: 'from-amber-500 to-orange-500' },
    { title: 'Create Event',      desc: 'Schedule a new event',             to: '/superadmin/events/create',        icon: HiOutlinePlusCircle, gradient: 'from-secondary to-accent' },
    { title: 'Manage Events',     desc: 'Edit, delete, publish events',     to: '/superadmin/events',         icon: HiOutlineCalendar, gradient: 'from-violet-500 to-purple-600' },
    { title: 'Registrations',     desc: 'Approve or reject registrations',  to: '/superadmin/registrations',  icon: HiOutlineClipboardDocumentList, gradient: 'from-rose-500 to-pink-500' },
    { title: 'System Settings',   desc: 'Configure platform settings',      to: '/superadmin/settings',  icon: HiOutlineCog6Tooth, gradient: 'from-slate-600 to-slate-800' },
  ];
  const recentUsers = data.recentUsers;
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-tr from-slate-900 via-amber-900/30 to-rose-900/30 text-white relative overflow-hidden shadow-xl border border-amber-500/20">
        <div className="absolute right-6 bottom-0 text-[10rem] font-black opacity-5 select-none leading-none">⚡</div>
        <div className="relative z-10 max-w-xl space-y-2">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 mb-2">
            <HiLockClosed className="w-3.5 h-3.5" /> Super Admin — Locked Role
          </div> */}
          <h1 className="text-3xl font-extrabold">Welcome, <span className="whitespace-nowrap">{user?.name} ⚡</span></h1>
          <p className="text-slate-300 text-sm">Full platform control. Your role is permanently fixed and cannot be modified.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/superadmin/users" className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-semibold transition-all">User Management →</Link>
            <Link to="/superadmin/settings" className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-all">System Settings →</Link>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actions.map(a => <QuickAction key={a.title} {...a} />)}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">👥 Recent Users</h3>
          <Link to="/superadmin/users" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <HiArrowRight className="w-4 h-4" /></Link>
        </div>
        <Card className="p-0 overflow-hidden">
          {recentUsers.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/60">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Name</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase">Role</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase hidden md:table-cell">Dept</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase hidden lg:table-cell">Joined</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-200/10">
                {recentUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white">{u.name}</td>
                    <td className="px-5 py-3 text-center"><Badge variant={u.role === 'admin' ? 'primary' : u.role === 'member' ? 'success' : 'secondary'}>{u.role}</Badge></td>
                    <td className="px-5 py-3 text-slate-500 text-xs hidden md:table-cell">{u.department || 'N/A'}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs hidden lg:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No recent users found.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const AdminDashboard = ({ user }) => {
  const [data, setData] = useState({
    totalEvents: 0,
    activeMembers: 0,
    pendingRegs: 0,
    certificates: 0,
    recentRegs: []
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, usersRes, regsRes] = await Promise.all([
          api.get('/events'),
          api.get('/users'),
          api.get('/registrations')
        ]);
        const events = eventsRes.data.data || [];
        const users = usersRes.data.data || [];
        const regs = regsRes.data.data || [];

        const members = users.filter(u => u.role === 'member');
        const pending = regs.filter(r => r.status === 'pending');
        const sortedRegs = [...regs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const formattedRegs = sortedRegs.slice(0, 4).map(r => ({
          name: r.user?.name || 'Unknown',
          event: r.event?.title || r.event?.name || 'Unknown Event',
          status: r.status
        }));

        setData({
          totalEvents: events.length,
          activeMembers: members.length,
          pendingRegs: pending.length,
          certificates: 0,
          recentRegs: formattedRegs
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Events',         value: data.totalEvents,  icon: HiOutlineCalendar,             gradient: 'from-primary to-secondary' },
    { label: 'Active Members',        value: data.activeMembers, icon: HiOutlineUsers,                gradient: 'from-secondary to-accent' },
    { label: 'Pending Registrations', value: data.pendingRegs,  icon: HiOutlineClipboardDocumentList,gradient: 'from-amber-400 to-orange-500' },
    { label: 'Certificates Issued',   value: data.certificates, icon: HiOutlineAcademicCap,          gradient: 'from-emerald-400 to-teal-500' },
  ];
  const actions = [
    { title: 'User Management',   desc: 'Manage users, assign roles',     to: '/admin/users',          icon: HiOutlineUsers, gradient: 'from-blue-500 to-cyan-500' },
    { title: 'Add Admin',         desc: 'Grant admin access to a member', to: '/admin/add-admin',      icon: HiOutlineUserPlus, gradient: 'from-amber-500 to-orange-500' },
    { title: 'Create Event',      desc: 'Schedule a new event',           to: '/admin/events/create',        icon: HiOutlinePlusCircle, gradient: 'from-primary to-secondary' },
    { title: 'Manage Events',     desc: 'Edit, delete, publish events',   to: '/admin/events',         icon: HiOutlineCalendar, gradient: 'from-secondary to-accent' },
    { title: 'Registrations',     desc: 'Approve/reject registrations',   to: '/admin/registrations',  icon: HiOutlineClipboardDocumentList, gradient: 'from-rose-500 to-pink-500' },
    { title: 'System Settings',   desc: 'Configure platform',             to: '/admin/settings',       icon: HiOutlineCog6Tooth, gradient: 'from-slate-500 to-slate-700' },
    { title: 'Send Notification', desc: 'Broadcast to members',           to: '/admin/notifications',  icon: HiOutlineBell, gradient: 'from-violet-500 to-purple-600' },
    { title: 'Analytics',         desc: 'View platform reports',          to: '/admin/analytics',            icon: HiOutlineChartBar, gradient: 'from-emerald-500 to-teal-500' },
  ];
  const recentRegs = data.recentRegs;
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-tr from-slate-900 via-primary/50 to-secondary/40 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-6 bottom-0.5 text-[9rem] font-black opacity-5 select-none leading-none">ADM</div>
        <div className="relative z-10 max-w-xl space-y-2">
          <h1 className="text-3xl font-extrabold">Hello, {user?.name}! 🛡️</h1>
          <p className="text-slate-300 text-sm">Manage events, approve registrations, and keep the club running.</p>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actions.map(a => <QuickAction key={a.title} {...a} />)}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">📋 Recent Registrations</h3>
          <Link to="/admin/registrations" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <HiArrowRight className="w-4 h-4" /></Link>
        </div>
        <Card className="p-0 overflow-hidden">
          {recentRegs.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/60">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Student</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Event</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-200/10">
                {recentRegs.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white">{r.name}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs hidden sm:table-cell">{r.event}</td>
                    <td className="px-5 py-3 text-center"><Badge variant={r.status === 'approved' ? 'success' : 'warning'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No recent registrations found.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── Club Member Dashboard ────────────────────────────────────────────────────

const MemberDashboard = ({ user }) => {
  const [data, setData] = useState({
    totalEvents: 0,
    totalRegs: 0,
    activeMembers: 0,
    eventsThisMonth: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, usersRes, regsRes] = await Promise.all([
          api.get('/events'),
          api.get('/users'),
          api.get('/registrations')
        ]);
        const events = eventsRes.data.data || [];
        const users = usersRes.data.data || [];
        const regs = regsRes.data.data || [];

        const members = users.filter(u => u.role === 'member');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthEvents = events.filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        setData({
          totalEvents: events.length,
          totalRegs: regs.length,
          activeMembers: members.length,
          eventsThisMonth: thisMonthEvents.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Events',        value: data.totalEvents,  icon: HiOutlineCalendar,             gradient: 'from-primary to-secondary' },
    { label: 'Total Registrations', value: data.totalRegs, icon: HiOutlineClipboardDocumentList,gradient: 'from-secondary to-accent' },
    { label: 'Active Members',      value: data.activeMembers, icon: HiOutlineUsers,                gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Events This Month',   value: data.eventsThisMonth,   icon: HiOutlineTrophy,               gradient: 'from-amber-400 to-orange-500' },
  ];
  const viewActions = [
    { title: 'View All Events',     desc: 'Browse all club events (read-only)',        to: '/member/events',         icon: HiOutlineEye, gradient: 'from-primary to-secondary' },
    { title: 'View Registrations',  desc: 'See all student registrations',             to: '/member/registrations',  icon: HiOutlineClipboardDocumentList, gradient: 'from-secondary to-accent' },
    { title: 'View Analytics',      desc: 'Platform-wide stats & reports',             to: '/member/analytics',            icon: HiOutlineChartBar, gradient: 'from-emerald-400 to-teal-500' },
    { title: 'Teams',               desc: 'See all club teams and batches',            to: '/member/teams',                icon: HiOutlineUserGroup, gradient: 'from-violet-500 to-purple-600' },
    { title: 'Gallery',             desc: 'Browse all event photos',                   to: '/member/gallery',              icon: HiOutlinePhoto, gradient: 'from-pink-500 to-rose-500' },
  ];
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-tr from-slate-900 via-emerald-900/30 to-teal-900/30 text-white relative overflow-hidden shadow-xl border border-emerald-500/20">
        <div className="relative z-10 max-w-xl space-y-2">
          <h1 className="text-3xl font-extrabold">Welcome, {user?.name}!</h1>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {viewActions.map(a => <QuickAction key={a.title} {...a} />)}
        </div>
      </div>
    </div>
  );
};

// ─── Student Dashboard ────────────────────────────────────────────────────────

const StudentDashboard = ({ user }) => {
  const [data, setData] = useState({
    upcomingEvents: 0,
    announcements: [],
    myEvents: []
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, regsRes, notifsRes] = await Promise.all([
          api.get('/events'),
          api.get('/registrations/my'),
          api.get('/notifications')
        ]);
        const events = eventsRes.data.data || [];
        const regs = regsRes.data.data || [];
        const notifs = notifsRes.data.data || [];

        const now = new Date();
        const upcoming = events.filter(e => new Date(e.date) >= now);

        const formattedRegs = regs.map(r => ({
          event: r.event?.title || r.event?.name || 'Unknown',
          date: r.event?.date ? new Date(r.event.date).toLocaleDateString() : 'N/A',
          status: r.status,
          result: r.status === 'completed' ? 'Participated' : null
        }));

        const formattedNotifs = notifs.slice(0, 3).map(n => ({
          title: n.title,
          date: new Date(n.createdAt).toLocaleDateString(),
          type: n.type || 'Announcement'
        }));

        setData({
          upcomingEvents: upcoming.length,
          announcements: formattedNotifs,
          myEvents: formattedRegs
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Upcoming Events',     value: data.upcomingEvents,                          icon: HiOutlineCalendar, gradient: 'from-primary to-secondary' },
    { label: 'My Registrations',    value: user?.eventsParticipated || '0', icon: HiOutlineTicket,gradient: 'from-secondary to-accent' },
    { label: 'My Certificates',     value: user?.certificates || '0',                          icon: HiOutlineAcademicCap, gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Leaderboard Rank',    value: user?.ranking ? `#${user.ranking}` : 'N/A',  icon: HiOutlineTrophy,  gradient: 'from-amber-400 to-orange-500' },
  ];
  const announcements = data.announcements;
  const myEvents = data.myEvents;
  const rolePath = user?.role === 'superadmin' ? '/superadmin' : user?.role === 'admin' ? '/admin' : user?.role === 'member' ? '/member' : '/dashboard';
  const regPath = user?.role === 'student' ? '/dashboard/my-registrations' : `${rolePath}/registrations`;
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-tr from-slate-900 to-primary/70 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-6 bottom-0 text-[10rem] font-black opacity-5 select-none leading-none">{'</>'}</div>
        <div className="relative z-10 max-w-xl space-y-3">
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.name || 'Coder'}! 👋</h1>
          <p className="text-slate-300 text-sm">Check your registrations, browse upcoming events, and level up your skills with Coders Club GPREC.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to={`${rolePath}/events`} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-all">Browse Events →</Link>
            <Link to={regPath} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-all">My Registrations →</Link>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>
      {user?.badges?.length > 0 && (
        <Card>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">🏅 My Badges</h3>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-primary-300 border border-primary/20 text-sm font-semibold">
                <span>{b.icon}</span> {b.name}
              </div>
            ))}
          </div>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">📋 My Event Registrations</h3>
          <Card className="p-0 overflow-hidden">
            {myEvents.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/60">
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Event</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase hidden md:table-cell">Result</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-200/10">
                  {myEvents.map((e, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white">{e.event}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs hidden sm:table-cell">{e.date}</td>
                      <td className="px-5 py-3 text-center"><Badge variant={e.status === 'Completed' ? 'success' : 'primary'}>{e.status}</Badge></td>
                      <td className="px-5 py-3 text-slate-500 text-xs hidden md:table-cell">{e.result || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No event registrations found.</p>
            )}
          </Card>
        </div>
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">📢 Announcements</h3>
          <Card className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((a, i) => (
                <div key={i} className="flex items-start justify-between pb-4 last:pb-0 last:border-b-0 border-b border-slate-200/20 gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.date}</p>
                  </div>
                  <Badge variant={a.type === 'Result' ? 'success' : 'primary'}>{a.type}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No announcements available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── Router ───────────────────────────────────────────────────────────────────

const Home = () => {
  const { user } = useAuth();
  const role = user?.role || 'student';
  if (role === 'superadmin') return <SuperAdminDashboard user={user} />;
  if (role === 'admin')      return <AdminDashboard user={user} />;
  if (role === 'member')     return <MemberDashboard user={user} />;
  return <StudentDashboard user={user} />;
};

export default Home;
