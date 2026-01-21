'use client';

import Link from 'next/link';
import { toggleTheme } from '@/components/ThemeClient';
import type React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  stepLabel?: string;
  right?: React.ReactNode;
};

export default function AppHeader({
  title = 'Moments of Truth',
  subtitle = 'AI 交互式训练引擎',
  stepLabel,
  right
}: Props) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/setup" className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
          </Link>
          {stepLabel ? (
            <span className="hidden md:inline-flex items-center ml-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {stepLabel}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {right}
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link className="text-slate-500 hover:text-primary" href="/setup">新训练</Link>
            <Link className="text-slate-500 hover:text-primary" href="/progress">成长</Link>
            <Link className="text-slate-500 hover:text-primary" href="/resources">资料</Link>
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="toggle theme"
          >
            <span className="material-symbols-outlined dark:hidden">dark_mode</span>
            <span className="material-symbols-outlined hidden dark:block text-yellow-400">light_mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
