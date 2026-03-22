import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-500 hover:opacity-90 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm",
    icon: "p-2 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
