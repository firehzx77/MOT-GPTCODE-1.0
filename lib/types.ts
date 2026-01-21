export type Industry = 'retail' | 'bank' | 'telecom' | 'hotel' | 'logistics';
export type Persona = 'senior_angry' | 'business_savvy' | 'tech_young';
export type Voice = 'male_calm' | 'female_standard' | 'female_energetic' | 'male_strict';

export type MotStage = 'explore' | 'offer' | 'action' | 'confirm';

export type Scenario = {
  id: string;
  title: string;
  industry: Industry;
  persona: Persona;
  difficulty: 'low' | 'mid' | 'high';
  customerName: string;
  customerIntro: string;
  background: string[];
  constraints: string[];
  initialCustomerMessage: string;
  hiddenExpectationsHints: string[];
  potentialSurprises: string[];
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  ts?: number;
};

export type SessionConfig = {
  scenarioId: string;
  voice: Voice;
};

export type TrainingSession = {
  id: string;
  createdAt: number;
  config: SessionConfig;
  messages: ChatMessage[];
  stage?: MotStage;
  stageProgress?: number; // 0-100
};

export type Evaluation = {
  sessionId: string;
  createdAt: number;
  /** 当模型输出无法解析为结构化 JSON 时，保留原始文本供展示/排查 */
  raw?: string;
  overallScore: number; // 0-100
  title: string;
  summary: string;
  motValueScore: number; // -3..+3
  motValueRationale: string;
  dimensions: {
    empathy: number;
    logic: number;
    compliance: number;
    efficiency: number;
    professionalism: number;
  };
  stages: Record<MotStage, {
    stars: number; // 1..5
    strengths: string[];
    gaps: string[];
  }>;
  keyMoments: Array<{
    kind: 'best' | 'risk' | 'turning_point';
    stage: MotStage;
    quoteCustomer?: string;
    quoteYou?: string;
    whyItMatters: string;
    betterMove?: string;
  }>;
  checklist: {
    askedWorryQuestion: boolean;
    askedSuccessCriteriaQuestion: boolean;
    askedSupportIfHappensQuestion: boolean;
    proposedFallback: boolean;
    proposedDelight: boolean;
  };
  nextTime: {
    threeMoves: string[];
    sampleScripts: string[];
  };
};

export type CoachHint = {
  stage: MotStage;
  progress: number;
  hint: string;
  tags: string[];
};
