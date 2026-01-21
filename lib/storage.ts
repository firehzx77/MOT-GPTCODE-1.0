'use client';

import type { TrainingSession, Evaluation } from '@/lib/types';

const SESSIONS_KEY = 'mot_sessions_v1';
const EVAL_KEY = 'mot_evaluations_v1';

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function listSessions(): TrainingSession[] {
  if (typeof window === 'undefined') return [];
  return safeJsonParse(localStorage.getItem(SESSIONS_KEY), [] as TrainingSession[]);
}

export function saveSession(session: TrainingSession) {
  if (typeof window === 'undefined') return;
  const all = listSessions();
  const idx = all.findIndex(s => s.id === session.id);
  if (idx >= 0) all[idx] = session;
  else all.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(all));
}

export function getSession(id: string): TrainingSession | undefined {
  return listSessions().find(s => s.id === id);
}

export function listEvaluations(): Evaluation[] {
  if (typeof window === 'undefined') return [];
  return safeJsonParse(localStorage.getItem(EVAL_KEY), [] as Evaluation[]);
}

export function saveEvaluation(ev: Evaluation) {
  if (typeof window === 'undefined') return;
  const all = listEvaluations();
  const idx = all.findIndex(e => e.sessionId === ev.sessionId);
  if (idx >= 0) all[idx] = ev;
  else all.unshift(ev);
  localStorage.setItem(EVAL_KEY, JSON.stringify(all));
}

export function getEvaluation(sessionId: string): Evaluation | undefined {
  return listEvaluations().find(e => e.sessionId === sessionId);
}

export function uid(prefix = 's'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;
}
