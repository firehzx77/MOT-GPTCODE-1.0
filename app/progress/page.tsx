'use client';

import { useEffect, useMemo, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { listEvaluations, listSessions } from '@/lib/storage';
import type { Evaluation } from '@/lib/types';
import Link from 'next/link';

function LineChart({ values }: { values: number[] }) {
  const w = 600;
  const h = 220;
  const pad = 20;
  const maxV = 100;
  const minV = 0;
  if (values.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-slate-500">暂无数据</div>
    );
  }
  const step = values.length === 1 ? 0 : (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (v - minV) / (maxV - minV));
    return [x, y] as const;
  });
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px]">
      {/* grid */}
      {Array.from({ length: 6 }, (_, i) => {
        const y = pad + ((h - pad * 2) * i) / 5;
        return <line key={i} x1={pad} x2={w - pad} y1={y} y2={y} stroke="rgba(148,163,184,0.35)" strokeWidth="1" />;
      })}
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="5" fill="currentColor" className="text-primary" />
      ))}
    </svg>
  );
}

export default function ProgressPage() {
  const [items, setItems] = useState<Evaluation[]>([]);

  useEffect(() => {
    setItems(listEvaluations());
  }, []);

  const values = useMemo(() => [...items].reverse().map(i => Math.round(i.overallScore)), [items]);
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const best = values.length ? Math.max(...values) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader title="成长分析" subtitle="趋势 · 优势 · 短板" />

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-extrabold">训练成长趋势</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">每次生成报告后，趋势会自动记录在本地（localStorage）。</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">平均分</p>
                    <p className="text-2xl font-extrabold">{avg}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">最高分</p>
                    <p className="text-2xl font-extrabold">{best}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <LineChart values={values} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">报告列表</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">点击可回看对应训练报告。</p>

              <div className="mt-4 space-y-3">
                {items.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-slate-500">
                    还没有任何报告。先去创建一次训练并生成评分报告吧。
                  </div>
                ) : null}

                {items.map((e) => (
                  <Link key={e.sessionId} href={`/report/${e.sessionId}`} className="block p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{e.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(e.createdAt).toLocaleString()}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{Math.round(e.overallScore)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{e.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800">
              <h3 className="font-bold">下一阶段的刻意练习</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">arrow_right</span>每轮至少完整覆盖“探询三问”</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">arrow_right</span>提议里必须出现“兜底方案 + 可追踪”</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">arrow_right</span>尝试 1 个不花钱的“惊喜”动作</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">arrow_right</span>确认阶段用“复述共识 + 明确回访”做闭环</li>
              </ul>

              <div className="mt-5 flex gap-3">
                <Link href="/setup" className="flex-1 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-center">开始新训练</Link>
                <Link href="/resources" className="flex-1 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 font-bold text-center">资料库</Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">数据说明</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">当前版本不需要数据库：数据保存在浏览器 localStorage。若要团队化/多端同步，后续可接入 Supabase / Firebase / Airtable。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
