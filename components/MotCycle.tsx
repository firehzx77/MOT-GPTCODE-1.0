'use client';

import type { MotStage } from '@/lib/types';

const items: Array<{ id: MotStage; label: string; icon: string; color: string }> = [
  { id: 'explore', label: 'Explore', icon: 'search', color: 'bg-explore' },
  { id: 'offer', label: 'Offer', icon: 'lightbulb', color: 'bg-offer' },
  { id: 'action', label: 'Action', icon: 'rocket_launch', color: 'bg-action' },
  { id: 'confirm', label: 'Confirm', icon: 'check_circle', color: 'bg-confirm' }
];

export default function MotCycle({ stage = 'explore', progress = 0 }: { stage?: MotStage; progress?: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">MOT 循环</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">进度 {Math.max(0, Math.min(100, Math.round(progress)))}%</span>
      </div>

      <div className="space-y-3">
        {items.map(it => {
          const active = stage === it.id;
          return (
            <div key={it.id} className={`flex items-center gap-3 p-3 rounded-xl border ${active ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className={`w-9 h-9 rounded-lg ${it.color} text-white flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-lg">{it.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{it.label}</p>
                  {active ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">当前</span>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {it.id === 'explore' ? '共情 + 挖隐性期望' : it.id === 'offer' ? '方案 + 兜底 + 惊喜' : it.id === 'action' ? '责任/时点/可追踪' : '复述共识 + 闭环回访'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
      </div>
    </div>
  );
}
