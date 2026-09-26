'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { MatrixLabelLogo, MenuIcon, CloseIcon, ChevronRightIcon, LogOutIcon } from './ui/Icons';
import { getClientSession, clearClientSession, User } from '@/lib/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSessionUser(getClientSession());
  }, [pathname]);

  const handleLogout = () => {
    clearClientSession();
    setSessionUser(null);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const isPageRoute = ['pricing', 'terms', 'privacy', 'dashboard'].includes(targetId);
    if (isPageRoute) {
      setMobileMenuOpen(false);
      return;
    }
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Solutions', href: '/#solutions', id: 'solutions' },
    { label: 'Workbench', href: '/#demo', id: 'demo' },
    { label: 'Quality & QA', href: '/#qa', id: 'qa' },
    { label: 'Pricing', href: '/pricing', id: 'pricing' },
    { label: 'Console', href: '/dashboard', id: 'dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200 bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-[1280px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3 outline-none group"
        >
          <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-xl shadow-xs group-hover:bg-indigo-700 transition-colors">
            <MatrixLabelLogo size={20} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            MatrixLabel
          </span>
        </Link>

        {/* Center: Desktop Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-full border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.id)}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/80 transition-all shadow-none hover:shadow-xs"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {sessionUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors inline-flex items-center gap-2"
                title="Go to Client Console"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[130px]">{sessionUser.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-900 dark:text-indigo-200">
                  Console
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOutIcon size={14} />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-1.5"
              >
                <span>Start Project</span>
                <ChevronRightIcon size={13} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.id)}
                className="block text-sm font-medium px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            {sessionUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold py-2.5 px-4 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{sessionUser.name} (Console)</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium py-2 text-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold py-2.5 text-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold py-2.5 text-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-md shadow-indigo-500/20"
                >
                  Start Project
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
