import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  name,
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 dark:text-slate-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-3 ${
            Icon ? 'pl-12' : 'pl-4'
          } pr-4 bg-slate-50 dark:bg-slate-900 border ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-800 focus:ring-primary focus:border-primary'
          } rounded-xl outline-none transition-all duration-300 focus:ring-2`}
          required={required}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default Input;
