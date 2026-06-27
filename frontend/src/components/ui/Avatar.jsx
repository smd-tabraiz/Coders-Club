import React from 'react';

const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-32 h-32 text-3xl',
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'C';
    const parts = fullName.split(' ');
    const initials = parts.map(p => p[0]).join('');
    return initials.substring(0, 2).toUpperCase();
  };

  const isDefaultAvatar = src === 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60';
  const displaySrc = isDefaultAvatar ? '' : src;

  return (
    <div className={`relative inline-block ${className}`}>
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={name}
          className={`object-cover rounded-full border border-slate-200/50 dark:border-slate-800/50 ${sizeClasses[size]}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none'; // hide broken img and show initials fallback
          }}
        />
      ) : (
        <div
          className={`flex items-center justify-center font-bold text-white rounded-full bg-gradient-to-tr from-primary to-secondary ${sizeClasses[size]}`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
