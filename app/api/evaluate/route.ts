import { NextResponse } from 'next/server';
import { z } from 'zod';
import { deepseekChat } from '@/lib/deepseek';
import { getScenarioById } from '@/lib/scenarios';
import type { ChatMessage } from '@/lib/types';
import { evaluationSystemPrompt, hintSystemPrompt } from '@/lib/prompts';
import JSON5 from 'json5';

function escapeUnescapedNewlinesInStrings(input: string) {
  let out = '';
  let inString = false;
  let quote: '"' | "'" = '"';
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const isLineBreak = ch === '\n' || ch === '\r' || ch === '\u2028' || ch === '\u2029';

    if (!inString) {
      if (ch === '"' || ch === "'") {
        inString = true;
        quote = ch as any;
      }
      out += ch;
      continue;
    }

    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      out += ch;
      escaped = true;
      continue;
    }

    if (isLineBreak) {
      out += '\\n';
      continue;
    }

    if (ch === quote) {
      inString = false;
      out += ch;
      continue;
    }

    out += ch;
  }

  return out;
}

export const runtime = 'nodejs';

const BodySchema = z.object({
  scenarioId: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1)
    })
  ),
  mode: z.enum(['evaluation', 'hint']).default('evaluation')
});

function formatTranscript(msgs: ChatMessage[]) {
  return msgs
    .filter(m => m.role !== 'system')
    .map(m => (m.role === 'assistant' ? `客户: ${m.content}` : `你: ${m.content}`))
    .join('\n');
}

function extractJson(text: string) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) throw new Error('Model did not return JSON');
  let slice = text
    .slice(first, last + 1)
    .trim()
    // 常见“智能引号”修正
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  // 容错：模型偶尔会在字符串里输出未转义换行，导致 JSON/JSON5 解析失败
  slice = escapeUnescapedNewlinesInStrings(slice);

  // 先按严格 JSON 解析，失败再用 JSON5（容错：尾逗号/单引号/注释等）
  try {
    return JSON.parse(slice);
  } catch {
    return JSON5.parse(slice);
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);
    const scenario = getScenarioById(body.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: 'Unknown scenarioId' }, { status: 400 });
    }

    const transcript = formatTranscript(body.messages);

    const system = body.mode === 'hint' ? hintSystemPrompt() : evaluationSystemPrompt(scenario);

    const content = await deepseekChat({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `场景：${scenario.title}\n\n对话记录：\n${transcript}` }
      ],
      temperature: body.mode === 'hint' ? 0.2 : 0.1,
      max_tokens: body.mode === 'hint' ? 220 : 900
    });

    try {
      const parsed = extractJson(content);
      return NextResponse.json({ data: parsed });
    } catch (e: any) {
      // 保底：即使解析失败，也把原始内容返回，前端可展示“原文报告”
      const raw = typeof content === 'string' ? content : '';
      return NextResponse.json({ error: e?.message || 'Parse failed', raw }, { status: 200 });
    }
  } catch (err: any) {
    const message = typeof err?.message === 'string' ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
