'use client';

import type { CoachHint } from '@/lib/types';

export default function CoachHintCard({ hint }: { hint?: CoachHint }) {
  if (!hint) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">school</span>
          导师提示
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">开始说第一句话后，这里会给你最关键的一条指导。</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">school</span>
            导师提示
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">当前阶段：{hint.stage} · {Math.round(hint.progress)}%</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">1 条关键动作</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{hint.hint}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {hint.tags?.map(t => (
          <span key={t} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
