'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import { industries, personas, findScenario } from '@/lib/scenarios';
import type { Industry, Persona, TrainingSession } from '@/lib/types';
import { uid, saveSession } from '@/lib/storage';

function difficultyLabel(d: 'low' | 'mid' | 'high') {
  return d === 'high' ? '高' : d === 'mid' ? '中' : '低';
}

function difficultyDots(d: 'low' | 'mid' | 'high') {
  // 5 dots: low=2, mid=3, high=4 (留一个空做“极限”)
  const filled = d === 'low' ? 2 : d === 'mid' ? 3 : 4;
  return { filled, total: 5 };
}

export default function SetupPage() {
  const router = useRouter();
  const [industry, setIndustry] = useState<Industry>('retail');
  const [persona, setPersona] = useState<Persona>('business_savvy');

  const scenario = useMemo(() => findScenario(industry, persona), [industry, persona]);
  const dots = useMemo(() => difficultyDots(scenario.difficulty), [scenario.difficulty]);

  function reset() {
    setIndustry('retail');
    setPersona('business_savvy');
  }

  function start() {
    const id = uid('session');
    const session: TrainingSession = {
      id,
      createdAt: Date.now(),
      // 本稿暂不做“音色选择”，保留字段用于后续语音扩展
      config: { scenarioId: scenario.id, voice: 'female_standard' },
      messages: [
        {
          role: 'assistant',
          content: scenario.initialCustomerMessage,
          ts: Date.now()
        }
      ],
      stage: 'explore',
      stageProgress: 15
    };
    saveSession(session);
    router.push(`/practice/${id}`);
  }

  const right = (
    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
      <span className="material-symbols-outlined text-slate-500">person</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader title="Moments of Truth" subtitle="AI 交互式训练引擎" stepLabel="场景配置与初始化" right={right} />

      <main className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">配置您的训练场景</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              请选择行业背景与客户画像，系统将为您生成真实的“关键时刻”服务挑战。
            </p>
          </div>

          {/* Step 1 */}
          <section className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">选择行业领域</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.map((it) => (
                <button
                  key={it.id}
                  onClick={() => setIndustry(it.id)}
                  className={
                    "text-left rounded-2xl p-5 border transition bg-white dark:bg-slate-900 " +
                    (industry === it.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700')
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${it.colorClass} bg-opacity-20`}>
                      <span className="material-symbols-outlined">{it.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{it.name}</p>
                      {/* 本稿：选择时不展示场景介绍 */}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2 */}
          <section className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">选择客户画像</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={
                    "text-left rounded-2xl p-5 border transition bg-white dark:bg-slate-900 " +
                    (persona === p.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700')
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-slate-500">face</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                        {/* 本稿：选择时不展示客户介绍 */}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      难度: {p.difficulty === 'high' ? '高' : p.difficulty === 'mid' ? '中' : '低'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Bottom Bar */}
          <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-slate-400">info</span>
              <span>
                已选：
                <b className="text-slate-900 dark:text-slate-100">{industries.find(i => i.id === industry)?.name}</b>
                {' | '}
                <b className="text-slate-900 dark:text-slate-100">{personas.find(x => x.id === persona)?.name}</b>
                {' | '}
                场景复杂度
              </span>
              <span className="inline-flex items-center gap-1 ml-1">
                {Array.from({ length: dots.total }).map((_, idx) => (
                  <span
                    key={idx}
                    className={
                      'w-2 h-2 rounded-full ' +
                      (idx < dots.filled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700')
                    }
                  />
                ))}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">（{difficultyLabel(scenario.difficulty)}）</span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={reset}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                重置配置
              </button>
              <button
                type="button"
                onClick={start}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-95 transition flex items-center gap-2"
              >
                开始训练
                <span className="material-symbols-outlined text-base">rocket_launch</span>
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            小技巧：先共情，再问“担心点 / 成功标准 / 希望支持”，然后给主方案 + 兜底 + 低成本惊喜。
          </p>
        </div>
      </main>
    </div>
  );
}
