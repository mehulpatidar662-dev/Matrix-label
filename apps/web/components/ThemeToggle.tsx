'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from './ui/Icons';
import { Skeleton } from './ui/Skeleton';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <Skeleton className={`w-8 h-8 rounded-lg ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isDark
          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
      } ${className}`}
    >
      {isDark ? (
        <SunIcon size={15} className="text-amber-400" />
      ) : (
        <MoonIcon size={15} className="text-slate-700" />
      )}
      {showLabel && (
        <span className="text-xs font-mono tracking-tight uppercase">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
