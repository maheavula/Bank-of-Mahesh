import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-950/50 border border-emerald-400/30';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-space-850 hover:bg-space-800 text-slate-200 border border-white/10 shadow-md';
  } else if (variant === 'danger') {
    variantStyles = 'bg-gradient-to-r from-rose-600 to-red-700 text-white hover:from-rose-500 hover:to-red-600 shadow-lg shadow-rose-950/50 border border-rose-400/30';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5';
  }

  let sizeStyles = '';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-xs gap-1.5';
  if (size === 'md') sizeStyles = 'px-4 py-2.5 text-sm gap-2';
  if (size === 'lg') sizeStyles = 'px-6 py-3.5 text-base gap-2.5';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
