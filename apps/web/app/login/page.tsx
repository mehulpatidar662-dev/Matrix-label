'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthSidePanel from '@/components/AuthSidePanel';
import ThemeToggle from '@/components/ThemeToggle';
import { MatrixLabelLogo, ChevronRightIcon, CheckSymbolIcon, CaliperIcon } from '@/components/ui/Icons';
import { Skeleton } from '@/components/ui/Skeleton';
import { apiFetch, User } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid business email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDemoLogin = async (demoEmail: string, demoName: string) => {
    setIsLoading(true);
    setSubmittedMessage(null);
    try {
      await apiFetch<User>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: demoEmail, name: demoName }),
      });
      setSubmittedMessage(`Authenticated as ${demoName}. Launching Client Console...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmittedMessage(null);

    try {
      await apiFetch<User>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSubmittedMessage(`Authenticated as ${email}. Entering workspace...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch {
      setIsLoading(false);
      setErrors({ email: 'Authentication failed. Please verify credentials.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/60 dark:bg-[#070A0F] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Left Column: Form (~50%) */}
      <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-between">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <MatrixLabelLogo size={18} />
            </div>
            <span className="font-extrabold text-[18px] text-slate-900 dark:text-white tracking-tight">
              MatrixLabel
            </span>
          </Link>

          <ThemeToggle />
        </div>

        {/* Vertically centered form container */}
        <div className="w-full max-w-[440px] mx-auto my-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In to Workspace
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Access your computer vision annotation jobs, quality certificates, and telemetry.
            </p>
          </div>

          {/* Quick 1-Click Demo Logins Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Instant 1-Click Demo Evaluation</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Explore the fully functional console immediately without signing up:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('lead@autonomy-systems.ai', 'Vision Engineering Lead')}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="font-bold text-indigo-600 dark:text-indigo-400">Autonomous Vision</div>
                <div className="text-[10px] text-slate-400 truncate">lead@autonomy-systems.ai</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('robotics@medtech-ai.org', 'Surgical Robotics Director')}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="font-bold text-cyan-600 dark:text-cyan-400">Surgical Robotics</div>
                <div className="text-[10px] text-slate-400 truncate">robotics@medtech-ai.org</div>
              </button>
            </div>
          </div>

          {/* Functional skeleton loader when submitting */}
          {isLoading ? (
            <div className="space-y-4 p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>VERIFYING CREDENTIALS...</span>
                <span className="animate-pulse">LAUNCHING DASHBOARD</span>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-2/3" />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              {submittedMessage && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckSymbolIcon size={14} className="text-emerald-600 shrink-0" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Business Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className={`w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white rounded-xl outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Min 8 characters
                    </span>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white rounded-xl outline-none transition-all ${
                      errors.password
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  {errors.password && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-11 mt-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
                >
                  <span>Authenticate & Launch Console</span>
                  <ChevronRightIcon size={14} />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
                <span>No workspace account yet? </span>
                <Link
                  href="/register"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Register here
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer legal links */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 MatrixLabel</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Information Panel (~50%) */}
      <AuthSidePanel />
    </div>
  );
}
