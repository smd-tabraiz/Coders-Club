import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  icon: Icon,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-55 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 focus:ring-primary-500',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 focus:ring-secondary-500',
    accent: 'bg-accent hover:bg-accent-600 text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 focus:ring-accent-500',
    outline: 'border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-primary-500',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="mr-2 border-t-white" />
      ) : Icon ? (
        <Icon className="w-5 h-5 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
