'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import { getEvaluation, getSession } from '@/lib/storage';
import { getScenarioById } from '@/lib/scenarios';
import type { Evaluation, MotStage } from '@/lib/types';

function Stars({ n }: { n: number }) {
  const arr = Array.from({ length: 5 }, (_, i) => i < n);
  return (
    <div className="flex gap-1">
      {arr.map((on, idx) => (
        <span key={idx} className="material-symbols-outlined text-base" style={{ color: on ? '#f59e0b' : 'rgba(148,163,184,0.6)' }}>
          star
        </span>
      ))}
    </div>
  );
}

function valueLabel(v: number) {
  if (v <= -3) return '极差';
  if (v === -2) return '差';
  if (v === -1) return '偏模板';
  if (v === 0) return '合格';
  if (v === 1) return '良好';
  if (v === 2) return '优秀';
  return '惊喜口碑';
}

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [ev, setEv] = useState<Evaluation | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const e = getEvaluation(id);
    if (e) setEv(e);
    else setMissing(true);
  }, [id]);

  const session = useMemo(() => getSession(id), [id]);
  const scenario = useMemo(() => (session ? getScenarioById(session.config.scenarioId) : undefined), [session]);

  if (missing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AppHeader title="练习报告" subtitle="未找到报告" />
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-slate-500">该会话还没有生成报告。请回到对练页点击“生成评分报告”。</p>
            <button onClick={() => router.push(`/practice/${id}`)} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white font-bold">回到对练</button>
          </div>
        </div>
      </div>
    );
  }

  if (!ev) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AppHeader title="练习报告" subtitle="加载中" />
      </div>
    );
  }

  const dims = ev.dimensions;
  const checklist = ev.checklist;

  const stagesOrder: MotStage[] = ['explore', 'offer', 'action', 'confirm'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader
        title="训练报告"
        subtitle={scenario ? `${scenario.title} · ${scenario.customerName}` : 'MOT 训练'}
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">
              <span className="material-symbols-outlined">print</span>
              打印/导出PDF
            </button>
            <button onClick={() => router.push('/progress')} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold">
              <span className="material-symbols-outlined">trending_up</span>
              查看成长
            </button>
          </div>
        }
      />

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Summary */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <p className="text-xs text-slate-500">综合评分</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">{Math.round(ev.overallScore)}</p>
                <div className="pb-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{ev.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{ev.summary}</p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">价值量表（-3..+3）</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-extrabold text-2xl text-primary">{ev.motValueScore}</p>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{valueLabel(ev.motValueScore)}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{ev.motValueRationale}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[{k:'共情',v:dims.empathy},{k:'逻辑',v:dims.logic},{k:'合规',v:dims.compliance},{k:'效率',v:dims.efficiency},{k:'专业度',v:dims.professionalism}].map((it) => (
                  <div key={it.k} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">{it.k}</p>
                      <p className="text-sm font-bold">{Math.round(it.v)}</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, it.v))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">关键动作检查</h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: '问到“最担心什么”', ok: checklist.askedWorryQuestion },
                  { label: '问到“成功标准是什么”', ok: checklist.askedSuccessCriteriaQuestion },
                  { label: '问到“如果发生...希望我支持什么”', ok: checklist.askedSupportIfHappensQuestion },
                  { label: '提议中包含兜底方案', ok: checklist.proposedFallback },
                  { label: '提议中给到小惊喜', ok: checklist.proposedDelight }
                ].map(it => (
                  <div key={it.label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm">{it.label}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${it.ok ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      {it.ok ? '已完成' : '未覆盖'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={() => router.push(`/practice/${id}`)} className="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-bold">回到对练</button>
                <button onClick={() => router.push('/setup')} className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">再来一轮</button>
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {ev.raw ? (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-100">原始评分输出</h3>
                    <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mt-1">
                      由于模型输出未能被解析为结构化 JSON，本次报告以“原文”方式展示。你依然可以据此复盘关键时刻、提炼三问/兜底/惊喜/闭环。
                    </p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(ev.raw || '')}
                    className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
                  >
                    复制原文
                  </button>
                </div>
                <pre className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-amber-900 dark:text-amber-100 bg-white/70 dark:bg-slate-900/40 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 max-h-[420px] overflow-auto">
{ev.raw}
                </pre>
              </div>
            ) : null}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">MOT 四阶段表现</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {stagesOrder.map((st) => {
                  const box = ev.stages?.[st];
                  return (
                    <div key={st} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="font-bold">
                          {st === 'explore' ? 'Explore 探索' : st === 'offer' ? 'Offer 提议' : st === 'action' ? 'Action 行动' : 'Confirm 确认'}
                        </p>
                        <Stars n={Math.max(1, Math.min(5, Number(box?.stars) || 1))} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500">做得好</p>
                          <ul className="mt-2 space-y-1 text-sm">
                            {(box?.strengths || []).slice(0, 4).map((x: string) => (
                              <li key={x} className="flex items-start gap-2"><span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span><span>{x}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">可改进</p>
                          <ul className="mt-2 space-y-1 text-sm">
                            {(box?.gaps || []).slice(0, 4).map((x: string) => (
                              <li key={x} className="flex items-start gap-2"><span className="material-symbols-outlined text-amber-600 text-base">error</span><span>{x}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">关键时刻回放</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">挑 2-4 个拐点：哪里拉满了价值，哪里可能翻车。</p>

              <div className="mt-4 space-y-4">
                {ev.keyMoments?.slice(0, 6).map((km, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${km.kind === 'best' ? 'bg-emerald-600 text-white' : km.kind === 'risk' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                        {km.kind === 'best' ? '最佳点' : km.kind === 'risk' ? '风险点' : '转折点'}
                      </span>
                      <span className="text-xs text-slate-500">阶段：{km.stage}</span>
                    </div>
                    {km.quoteCustomer ? (
                      <p className="mt-3 text-sm text-slate-700 dark:text-slate-200"><span className="font-bold">客户：</span>“{km.quoteCustomer}”</p>
                    ) : null}
                    {km.quoteYou ? (
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><span className="font-bold">你：</span>“{km.quoteYou}”</p>
                    ) : null}
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><span className="font-bold">为什么重要：</span>{km.whyItMatters}</p>
                    {km.betterMove ? (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300"><span className="font-bold">更好一句：</span>{km.betterMove}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold">下一次三步走</h3>
                  <p className="text-sm text-slate-300 mt-1">把“探询三问 + 兜底 + 惊喜 + 可追踪 + 闭环”变成肌肉记忆。</p>
                </div>
                <button onClick={() => router.push('/setup')} className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold">再练一轮</button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <p className="font-bold">三步动作</p>
                  <ol className="mt-3 space-y-2 text-sm text-slate-200 list-decimal list-inside">
                    {ev.nextTime?.threeMoves?.map((x, i) => <li key={i}>{x}</li>)}
                  </ol>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <p className="font-bold">可直接照读的话术</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {ev.nextTime?.sampleScripts?.map((x, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-base">format_quote</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
