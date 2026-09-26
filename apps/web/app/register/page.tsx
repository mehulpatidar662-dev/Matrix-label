'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthSidePanel from '@/components/AuthSidePanel';
import ThemeToggle from '@/components/ThemeToggle';
import { MatrixLabelLogo, ChevronRightIcon, CheckSymbolIcon } from '@/components/ui/Icons';
import { Skeleton } from '@/components/ui/Skeleton';
import { apiFetch, User } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    agreeTerms?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string; agreeTerms?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Business email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid business email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmittedMessage(null);

    try {
      await apiFetch<User>('/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setSubmittedMessage(`Enterprise workspace established for ${name}. Redirecting to Console...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch {
      setIsLoading(false);
      setErrors({ email: 'Registration encountered an error. Please try again.' });
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
        <div className="w-full max-w-[420px] mx-auto my-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Enterprise Workspace
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Deploy your first managed computer vision annotation run.
            </p>
          </div>

          {/* Functional skeleton loader when submitting */}
          {isLoading ? (
            <div className="space-y-4 p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>INITIALIZING WORKSPACE STORAGE...</span>
                <span className="animate-pulse">PROVISIONING CLUSTER</span>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              {submittedMessage && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl">
                  {submittedMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Anand Sharma"
                    className={`w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white rounded-xl outline-none transition-all ${
                      errors.name
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

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
                    placeholder="lead@robotics-corp.ai"
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

                {/* Mandatory legal acceptance */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded-md border-slate-300 dark:border-slate-700 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold" target="_blank">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold" target="_blank">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-11 mt-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
                >
                  <span>Create Workspace</span>
                  <ChevronRightIcon size={14} />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
                <span>Already have a workspace account? </span>
                <Link
                  href="/login"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Sign in
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

      {/* Right Column: Information Panel */}
      <AuthSidePanel />
    </div>
  );
}
