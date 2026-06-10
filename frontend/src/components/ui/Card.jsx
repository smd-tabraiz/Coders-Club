import React from 'react';

const Card = ({ children, className = '', hoverEffect = true, glass = true }) => {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${
        glass ? 'glass' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
      } ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
