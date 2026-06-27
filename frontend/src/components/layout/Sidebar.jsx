import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome, HiCalendarDays, HiUserGroup, HiPhoto, HiUser, HiEnvelope,
  HiChartBar, HiTrophy, HiArrowRightOnRectangle, HiChevronLeft,
  HiChevronRight, HiUsers, HiCog6Tooth, HiBell, HiShieldCheck,
  HiClipboardDocumentList, HiPlusCircle, HiUserPlus, HiEye,
  HiDocumentText, HiMagnifyingGlass,
} from 'react-icons/hi2';

// ─── Role Menu Configs ────────────────────────────────────────────────────────

const SUPERADMIN_MENU = [
  { label: 'OVERVIEW' },
  { name: 'Dashboard',       path: '/superadmin',                      icon: HiHome,                  end: true },
  { label: 'USER CONTROL' },
  { name: 'User Management', path: '/superadmin/users',     icon: HiUsers },
  { name: 'Add Admin',       path: '/superadmin/add-admin',      icon: HiUserPlus },
  { label: 'CONTENT' },
  { name: 'Manage Events',   path: '/superadmin/events',         icon: HiCalendarDays, end: true },
  { name: 'Create Event',    path: '/superadmin/events/create',        icon: HiPlusCircle },
  { name: 'Registrations',   path: '/superadmin/registrations',  icon: HiClipboardDocumentList },
  { name: 'Teams',           path: '/superadmin/teams',                icon: HiUserGroup },
  { name: 'Gallery',         path: '/superadmin/gallery',              icon: HiPhoto },
  { label: 'REPORTS' },
  { name: 'Analytics',       path: '/superadmin/analytics',            icon: HiChartBar },
  { name: 'Reviews',         path: '/superadmin/reviews',              icon: HiDocumentText },
  { name: 'Activity Logs',   path: '/superadmin/activity',             icon: HiShieldCheck },
  { name: 'Send Notification', path: '/superadmin/notifications', icon: HiBell },
  { name: 'Support Inbox',   path: '/superadmin/inbox',                icon: HiEnvelope },
  { label: 'SYSTEM' },
  { name: 'System Settings', path: '/superadmin/settings',  icon: HiCog6Tooth },
  { name: 'Profile',         path: '/superadmin/profile',              icon: HiUser },
];

const ADMIN_MENU = [
  { label: 'OVERVIEW' },
  { name: 'Dashboard',       path: '/admin',                      icon: HiHome,                  end: true },
  { label: 'ADMIN' },
  { name: 'User Management', path: '/admin/users',          icon: HiUsers },
  { name: 'Add Admin',       path: '/admin/add-admin',      icon: HiUserPlus },
  { label: 'CONTENT' },
  { name: 'Manage Events',   path: '/admin/events',         icon: HiCalendarDays, end: true },
  { name: 'Create Event',    path: '/admin/events/create',        icon: HiPlusCircle },
  { name: 'Registrations',   path: '/admin/registrations',  icon: HiClipboardDocumentList },
  { name: 'Teams',           path: '/admin/teams',                icon: HiUserGroup },
  { name: 'Gallery',         path: '/admin/gallery',              icon: HiPhoto },
  { label: 'REPORTS' },
  { name: 'Analytics',       path: '/admin/analytics',            icon: HiChartBar },
  { name: 'Reviews',         path: '/admin/reviews',              icon: HiDocumentText },
  { name: 'Send Notification', path: '/admin/notifications', icon: HiBell },
  { name: 'Support Inbox',   path: '/admin/inbox',                icon: HiEnvelope },
  { label: 'SYSTEM' },
  { name: 'System Settings', path: '/admin/settings',       icon: HiCog6Tooth },
  { name: 'Profile',         path: '/admin/profile',              icon: HiUser },
];

const MEMBER_MENU = [
  { label: 'OVERVIEW' },
  { name: 'Dashboard',       path: '/member',                      icon: HiHome,                  end: true },
  { name: 'All Events',      path: '/member/events',         icon: HiCalendarDays },
  { name: 'Registrations',   path: '/member/registrations',  icon: HiClipboardDocumentList },
  { name: 'Teams',           path: '/member/teams',                icon: HiUserGroup },
  { name: 'Gallery',         path: '/member/gallery',              icon: HiPhoto },
  { label: 'REPORTS' },
  { name: 'Analytics',       path: '/member/analytics',            icon: HiChartBar },
  { label: 'ACCOUNT' },
  { name: 'Profile',         path: '/member/profile',              icon: HiUser },
  { name: 'Contact',         path: '/member/contact',              icon: HiEnvelope },
];

const STUDENT_MENU = [
  { label: 'MY SPACE' },
  { name: 'Dashboard',         path: '/dashboard',                     icon: HiHome,  end: true },
  { name: 'My Registrations',  path: '/dashboard/my-registrations',   icon: HiClipboardDocumentList },
  { label: 'EXPLORE' },
  { name: 'Browse Events',     path: '/dashboard/events',              icon: HiCalendarDays },
  { name: 'Leaderboard',       path: '/dashboard/leaderboard',         icon: HiTrophy },
  { name: 'Gallery',           path: '/dashboard/gallery',             icon: HiPhoto },
  { label: 'ACCOUNT' },
  { name: 'Notifications',     path: '/dashboard/notifications',       icon: HiBell },
  { name: 'Profile',           path: '/dashboard/profile',             icon: HiUser },
  { name: 'Contact',           path: '/dashboard/contact',             icon: HiEnvelope },
];

// ─── Role UI Config ───────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  superadmin: { label: 'Super Admin', gradient: 'from-amber-400 to-rose-500',    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  admin:      { label: 'Admin',       gradient: 'from-primary to-secondary',     badge: 'bg-primary/20 text-primary-300 border-primary/30' },
  member:     { label: 'Club Member', gradient: 'from-emerald-400 to-teal-500',  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  student:    { label: 'Student',     gradient: 'from-secondary to-accent',      badge: 'bg-secondary/20 text-secondary-300 border-secondary/30' },
};

// ─── Sidebar Component ────────────────────────────────────────────────────────

//  <div className="p-3 border-t border-slate-800/60 space-y-1 flex-shrink-0">
//         <button
//           onClick={toggleSidebar}
//           className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-500 hover:text-white transition-colors cursor-pointer"
//           title={isOpen ? 'Collapse' : 'Expand'}
//         >
//           {isOpen ? <HiChevronLeft className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
//         </button>
//         </div>




const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'student';
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const menu = role === 'superadmin' ? SUPERADMIN_MENU
             : role === 'admin'      ? ADMIN_MENU
             : role === 'member'     ? MEMBER_MENU
             : STUDENT_MENU;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-30 bg-slate-950 border-r border-slate-800/60 text-slate-400 shadow-2xl select-none overflow-hidden"
    >
      {/* Brand */}
      <div className="flex items-center justify-between h-[72px] px-4 border-b border-slate-800/60 flex-shrink-0">
        <NavLink to="/" className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr ${cfg.gradient} text-white font-black text-base flex items-center justify-center shadow-lg`}>
            CC
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden min-w-0">
                <p className="font-bold text-white text-sm whitespace-nowrap">Coders Club</p>
                <p className="text-[10px] text-slate-500 whitespace-nowrap">GPREC</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-500 hover:text-white transition-colors cursor-pointer ${!isOpen && 'hidden'}`}
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        
      </div>

      {/* Toggle Button when collapsed (centered below logo) */}
      {!isOpen && (
        <div className="flex justify-center mt-4 mb-2">
          <button
            onClick={toggleSidebar}
            className="bg-slate-800/80 text-white rounded-lg p-2 shadow-md hover:bg-primary transition-colors cursor-pointer border border-slate-700/50"
            title="Expand Sidebar"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Role badge */}
      {/* <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pt-4 pb-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${cfg.badge}`}>
              <HiShieldCheck className="w-3 h-3" />
              {cfg.label}
              {user?.isSuperAdminLocked && <span className="ml-1 text-amber-300">🔒</span>}
            </div>
            {user?.name && (
              <p className="mt-2 text-xs text-slate-400 font-medium truncate">{user.name}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {menu.map((item, idx) => {
          // Section label
          if (item.label) {
            return (
              <AnimatePresence key={`label-${idx}`}>
                {isOpen ? (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="px-3 pt-4 pb-1 text-[9px] font-black uppercase tracking-widest text-slate-600"
                  >
                    {item.label}
                  </motion.p>
                ) : <div key={`sep-${idx}`} className="my-2 border-t border-slate-800/50" />}
              </AnimatePresence>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={!isOpen ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-md`
                    : 'hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-sm whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {/* <div className="p-3 border-t border-slate-800/60 space-y-1 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-500 hover:text-white transition-colors cursor-pointer"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? <HiChevronLeft className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
        </button>
        </div> */}
        <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 transition-all duration-200 cursor-pointer"
          title={!isOpen ? 'Logout' : undefined}
        >
          <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm whitespace-nowrap">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
