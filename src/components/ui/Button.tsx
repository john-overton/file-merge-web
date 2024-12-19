import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) => (
  <button 
    className={`
      px-4 py-2 rounded-md font-medium transition-colors
      ${variant === 'primary' 
        ? `${disabled 
            ? 'bg-primary/50 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary-hover text-white'}`
        : `${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 text-text border border-border'}`
      }
      ${className}
    `}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
