import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { HiBars3, HiSun, HiMoon, HiBell, HiMagnifyingGlass } from 'react-icons/hi2';
import Avatar from '../ui/Avatar';

const Navbar = ({ onMobileToggle }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const notificationPath = user?.role === 'superadmin' ? '/superadmin/my-notifications' :
                           user?.role === 'admin' ? '/admin/my-notifications' :
                           user?.role === 'member' ? '/member/notifications' :
                           '/dashboard/notifications';

  const handleNotificationClick = (e) => {
    e.preventDefault();
    if (location.pathname === notificationPath) {
      navigate(-1);
    } else {
      navigate(notificationPath);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const profilePath = user?.role === 'superadmin' ? '/superadmin/profile' :
                      user?.role === 'admin' ? '/admin/profile' :
                      user?.role === 'member' ? '/member/profile' :
                      '/dashboard/profile';

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (location.pathname === profilePath) {
      navigate(-1);
    } else {
      navigate(profilePath);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full h-20 px-6 glass flex items-center justify-between border-b border-slate-200/20 dark:border-slate-800/10">
      {/* Mobile Toggle & Brand title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileToggle}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-200/20 md:hidden dark:text-white cursor-pointer"
        >
          <HiBars3 className="w-6 h-6" />
        </button>
        <h2 className="hidden sm:block text-xl font-bold text-slate-800 dark:text-white capitalize">
          Hello, {user?.name || 'Coder'}
        </h2>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-md w-full mx-4 relative hidden md:block">
        <input
          type="text"
          placeholder="Search events, members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 pl-12 pr-4 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
        />
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      </form>

      {/* Controls: Mode, Notification, Profile */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <HiBell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar Link */}
        <button onClick={handleProfileClick} className="flex items-center gap-2 select-none cursor-pointer border-none bg-transparent p-0">
          <Avatar src={user?.photo} name={user?.name} size="sm" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
