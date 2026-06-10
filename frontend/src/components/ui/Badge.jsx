import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const badgeVariants = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300',
    secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-300',
    accent: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-300',
    success: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    warning: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    danger: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
    error: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-5 ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
