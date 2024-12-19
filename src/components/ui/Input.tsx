import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  className = '',
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium text-text">
        {label}
      </label>
    )}
    <input 
      className={`
        w-full px-3 py-2 rounded-md border
        focus:ring-2 focus:ring-primary/20 focus:border-primary
        ${error ? 'border-error' : 'border-border'}
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="text-sm text-error">{error}</p>
    )}
  </div>
);
