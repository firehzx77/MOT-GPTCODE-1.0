'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import MotCycle from '@/components/MotCycle';
import GuidedQuestionPanel from '@/components/GuidedQuestionPanel';
import ChatBubble from '@/components/ChatBubble';
import CoachHintCard from '@/components/CoachHintCard';
import { getSession, saveSession, saveEvaluation } from '@/lib/storage';
import { getScenarioById } from '@/lib/scenarios';
import type { ChatMessage, CoachHint, Evaluation, MotStage, TrainingSession } from '@/lib/types';
import { stageLabel } from '@/lib/prompts';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PracticePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [session, setSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<CoachHint | undefined>(undefined);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getSession(id);
    setSession(s || null);
  }, [id]);

  const scenario = useMemo(() => {
    if (!session) return undefined;
    return getScenarioById(session.config.scenarioId);
  }, [session]);

  useEffect(() => {
    // auto scroll
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [session?.messages?.length]);

  function insertText(t: string) {
    setText(prev => (prev ? `${prev}\n${t}` : t));
  }

  async function send() {
    if (!session || !scenario) return;
    const content = text.trim();
    if (!content) return;

    setError(null);
    setLoading(true);

    const nextMessages: ChatMessage[] = [...session.messages, { role: 'user', content, ts: Date.now() }];

    const nextSession: TrainingSession = { ...session, messages: nextMessages };
    setSession(nextSession);
    saveSession(nextSession);
    setText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id, messages: nextMessages })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'API error');

      const replyMsg: ChatMessage = { role: 'assistant', content: json.reply, ts: Date.now() };
      const updated: TrainingSession = { ...nextSession, messages: [...nextMessages, replyMsg] };
      setSession(updated);
      saveSession(updated);

      // Update hint & stage
      const hintRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id, messages: updated.messages, mode: 'hint' })
      });
      const hintJson = await hintRes.json();
      if (hintRes.ok) {
        const data = hintJson?.data;
        const nextHint: CoachHint = {
          stage: data.stage as MotStage,
          progress: clamp(Number(data.progress) || 0, 0, 100),
          hint: String(data.hint || ''),
          tags: Array.isArray(data.tags) ? data.tags.map((x: any) => String(x)) : []
        };
        setHint(nextHint);
        const withStage: TrainingSession = { ...updated, stage: nextHint.stage, stageProgress: nextHint.progress };
        setSession(withStage);
        saveSession(withStage);
      }
    } catch (e: any) {
      setError(e?.message || '请求失败');
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  async function generateReport() {
    if (!session || !scenario) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id, messages: session.messages, mode: 'evaluation' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || '评价失败');

      // 兼容：若模型输出无法解析为结构化 JSON，则返回 raw 文本（用于报告页展示）
      if (!json?.data) {
        const defaultStageBox = { stars: 3, strengths: [], gaps: [] };
        const ev: Evaluation = {
          sessionId: session.id,
          createdAt: Date.now(),
          raw: String(json?.raw || ''),
          overallScore: 0,
          title: '评分报告（原始文本）',
          summary: '模型输出未能解析为结构化评分报告，已为你保留原始文本。你仍可据此复盘对话并提炼改进点。',
          motValueScore: 0,
          motValueRationale: '',
          dimensions: { empathy: 0, logic: 0, compliance: 0, efficiency: 0, professionalism: 0 },
          stages: {
            explore: defaultStageBox,
            offer: defaultStageBox,
            action: defaultStageBox,
            confirm: defaultStageBox
          },
          keyMoments: [],
          checklist: {
            askedWorryQuestion: false,
            askedSuccessCriteriaQuestion: false,
            askedSupportIfHappensQuestion: false,
            proposedFallback: false,
            proposedDelight: false
          },
          nextTime: { threeMoves: [], sampleScripts: [] }
        };
        saveEvaluation(ev);
        router.push(`/report/${session.id}`);
        return;
      }

      const d = json.data;
      const defaultStageBox = { stars: 3, strengths: [], gaps: [] };
      const safeStages = d.stages || {
        explore: defaultStageBox,
        offer: defaultStageBox,
        action: defaultStageBox,
        confirm: defaultStageBox
      };
      const safeChecklist = d.checklist || {
        askedWorryQuestion: false,
        askedSuccessCriteriaQuestion: false,
        askedSupportIfHappensQuestion: false,
        proposedFallback: false,
        proposedDelight: false
      };
      const safeNextTime = d.nextTime || { threeMoves: [], sampleScripts: [] };
      const ev: Evaluation = {
        sessionId: session.id,
        createdAt: Date.now(),
        overallScore: clamp(Number(d.overallScore) || 0, 0, 100),
        title: String(d.title || '评价结果'),
        summary: String(d.summary || ''),
        motValueScore: clamp(Number(d.motValueScore) || 0, -3, 3),
        motValueRationale: String(d.motValueRationale || ''),
        dimensions: {
          empathy: clamp(Number(d.dimensions?.empathy) || 0, 0, 100),
          logic: clamp(Number(d.dimensions?.logic) || 0, 0, 100),
          compliance: clamp(Number(d.dimensions?.compliance) || 0, 0, 100),
          efficiency: clamp(Number(d.dimensions?.efficiency) || 0, 0, 100),
          professionalism: clamp(Number(d.dimensions?.professionalism) || 0, 0, 100)
        },
        stages: safeStages,
        keyMoments: Array.isArray(d.keyMoments) ? d.keyMoments : [],
        checklist: safeChecklist,
        nextTime: safeNextTime
      };

      saveEvaluation(ev);
      router.push(`/report/${session.id}`);
    } catch (e: any) {
      setError(e?.message || '评价失败');
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  if (!session || !scenario) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AppHeader title="MOT 关键时刻" subtitle="加载中" />
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-slate-500">找不到该训练会话，请从“新训练”重新开始。</p>
            <button
              onClick={() => router.push('/setup')}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-white"
            >
              去创建训练
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader
        title="关键时刻互动练习"
        subtitle={`${scenario.title} · AI扮演客户`}
        stepLabel={stageLabel(session.stage)}
        right={
          <button
            onClick={generateReport}
            disabled={loading}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:opacity-95 disabled:opacity-60"
          >
            <span className="material-symbols-outlined">analytics</span>
            生成评分报告
          </button>
        }
      />

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">当前场景</p>
                  <p className="font-bold mt-1">{scenario.title}</p>
                  <p className="text-sm text-slate-500 mt-1">客户：{scenario.customerName}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{scenario.difficulty === 'high' ? '高难' : scenario.difficulty === 'mid' ? '中等' : '入门'}</span>
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-500">背景</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                  {scenario.background.map(b => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-base">arrow_right</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-500">关键约束</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {scenario.constraints.map(c => (
                    <span key={c} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-200">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            <MotCycle stage={session.stage} progress={session.stageProgress || 0} />
            <CoachHintCard hint={hint} />
          </div>

          {/* Center */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold">对练对话区</p>
                  <p className="text-xs text-slate-500">你是服务人员，AI 是客户。把四步打完整。</p>
                </div>
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:opacity-95 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined">analytics</span>
                  评分
                </button>
              </div>

              <div ref={listRef} className="h-[520px] overflow-y-auto px-6 py-5 bg-slate-50 dark:bg-slate-950/40">
                {session.messages.map((m, idx) => (
                  <ChatBubble key={idx} msg={m} />
                ))}
              </div>

              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                {error ? (
                  <div className="mb-3 px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-100">
                    {error}
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={2}
                    placeholder="输入你要对客户说的话..."
                    className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={send}
                    disabled={loading}
                    className="px-4 rounded-xl bg-primary text-white font-bold hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">send</span>
                    发送
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">小技巧：先共情，再问“最担心什么 / 成功标准 / 希望支持”，然后给主方案 + 兜底 + 小惊喜。</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <GuidedQuestionPanel onInsert={insertText} />

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">menu_book</span>
                快速学习
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">需要复习要点？打开“资料”页的速查卡片。</p>
              <button
                onClick={() => router.push('/resources')}
                className="mt-4 w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                去资料库
              </button>
            </div>

            <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800">
              <p className="font-bold">本轮目标</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>至少问出 1 个隐性期望</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>提议中包含 1 个兜底方案</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>尝试给 1 个低成本惊喜</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>明确时点 + 可追踪 + 回访闭环</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
