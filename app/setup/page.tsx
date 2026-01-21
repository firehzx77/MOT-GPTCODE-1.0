'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import { industries, personas, findScenario } from '@/lib/scenarios';
import type { Industry, Persona, Voice, TrainingSession } from '@/lib/types';
import { uid, saveSession } from '@/lib/storage';

const voiceOptions: Array<{ id: Voice; label: string }> = [
  { id: 'male_calm', label: '男声·沉稳' },
  { id: 'female_standard', label: '女声·标准' },
  { id: 'female_energetic', label: '女声·活力' },
  { id: 'male_strict', label: '男声·严谨' }
];

export default function SetupPage() {
  const router = useRouter();
  const [industry, setIndustry] = useState<Industry>('retail');
  const [persona, setPersona] = useState<Persona>('business_savvy');
  const [voice, setVoice] = useState<Voice>('female_standard');

  const scenario = useMemo(() => findScenario(industry, persona), [industry, persona]);

  function start() {
    const id = uid('session');
    const session: TrainingSession = {
      id,
      createdAt: Date.now(),
      config: { scenarioId: scenario.id, voice },
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AppHeader title="MOT 训练中心" subtitle="场景配置 · 选择行业/客户/难度" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm text-slate-400">训练中心 / 场景配置</p>
            <h2 className="text-4xl font-extrabold tracking-tight mt-2">
              MOT 关键时刻<span className="text-primary">交互练习</span>
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl">
              AI 扮演客户，您扮演服务人员。按 Explore → Offer → Action → Confirm 四步把关键时刻打赢。
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 w-full md:w-[420px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400">本次训练场景</p>
                <p className="font-bold text-lg mt-1">{scenario.title}</p>
                <p className="text-sm text-slate-400 mt-1">客户：{scenario.customerName} · {scenario.customerIntro}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary">
                难度：{scenario.difficulty === 'high' ? '高' : scenario.difficulty === 'mid' ? '中' : '低'}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {scenario.constraints.slice(0, 4).map((c) => (
                <div key={c} className="px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4">1) 选择行业场景</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {industries.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => setIndustry(it.id)}
                    className={`text-left rounded-2xl p-5 border transition ${industry === it.id ? 'bg-primary/15 border-primary' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${it.colorClass} bg-opacity-20`}>
                        <span className="material-symbols-outlined">{it.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold">{it.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{it.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4">2) 选择客户类型（AI 扮演）</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={`text-left rounded-2xl p-5 border transition ${persona === p.id ? 'bg-primary/15 border-primary' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800">
                        {p.difficulty === 'high' ? '挑战' : p.difficulty === 'mid' ? '进阶' : '入门'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {p.tags.map(t => (
                        <span key={t} className="px-2 py-1 rounded-full bg-slate-800/80 text-slate-300 text-[11px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-3">3) 选择对话音色（可选）</h3>
              <p className="text-sm text-slate-400 mb-4">当前版本以文字对练为主，音色用于后续扩展语音TTS。</p>
              <div className="grid grid-cols-2 gap-3">
                {voiceOptions.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`px-3 py-3 rounded-xl border text-sm font-semibold transition ${voice === v.id ? 'bg-primary text-white border-primary' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-3">4) 开始训练</h3>
              <p className="text-sm text-slate-400 mb-4">建议第一轮先“打通四步”，第二轮开始追求“兜底 + 惊喜”。</p>
              <button
                onClick={start}
                className="w-full py-3.5 rounded-xl bg-primary hover:opacity-95 transition font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">play_circle</span>
                开始训练
              </button>
              <div className="mt-4 text-xs text-slate-400">
                提示：进入练习后，你可以用右侧“引导式提问”按钮快速插入探询语句。
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-200">本次初始客户话术</h3>
              <p className="mt-3 text-sm text-slate-300">“{scenario.initialCustomerMessage}”</p>
              <div className="mt-4 text-xs text-slate-500">你要做的第一件事：共情 + 追问“你最担心的是什么？”</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
