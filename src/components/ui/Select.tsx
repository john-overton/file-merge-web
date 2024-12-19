import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium text-text">
        {label}
      </label>
    )}
    <select
      className={`
        w-full px-3 py-2 rounded-md border border-border
        focus:ring-2 focus:ring-primary/20 focus:border-primary
        bg-white
        ${error ? 'border-error' : 'border-border'}
        ${className}
      `}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-sm text-error">{error}</p>
    )}
  </div>
);
