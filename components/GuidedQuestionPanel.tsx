'use client';

type Props = {
  onInsert: (text: string) => void;
};

const groups: Array<{ title: string; icon: string; items: Array<{ label: string; text: string }> }> = [
  {
    title: '引导式探询（挖隐性期望）',
    icon: 'question_answer',
    items: [
      { label: '担心点', text: '我想先确认一下，你此刻最担心的是什么？' },
      { label: '成功标准', text: '你理想中的“成功解决”，你会用什么标准来判断？' },
      { label: '希望支持', text: '如果接下来发生（例如：需要再核验/需要等待），你希望我给到你什么支持？' }
    ]
  },
  {
    title: '提议（至少 1 个兜底 + 1 个惊喜）',
    icon: 'lightbulb',
    items: [
      { label: '主方案', text: '我先给你一个明确方案：我现在马上为你（具体动作），预计在（时间点）给你第一次反馈。' },
      { label: '兜底方案', text: '同时我也准备一个兜底方案：如果（风险点）发生，我会改用（替代路径/加急/补发/改期）保证你不被耽误。' },
      { label: '小惊喜', text: '另外我想额外为你做一件事：我可以（低成本贴合场景的惊喜），让你更省心。' }
    ]
  },
  {
    title: '行动与确认（可追踪 + 闭环）',
    icon: 'task_alt',
    items: [
      { label: '行动清单', text: '我把接下来的动作说清楚：我负责（动作A）；（时间点）前给你结果；你这边只需要（动作B）。' },
      { label: '可追踪', text: '为了让你放心，我会把进度通过（短信/邮件/回拨）同步给你，关键节点我都会主动联系。' },
      { label: '确认闭环', text: '我复述一下我们达成的共识：你需要（目标），我将（方案+时点+兜底）。这样是否符合你的期望？' }
    ]
  }
];

export default function GuidedQuestionPanel({ onInsert }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">tips_and_updates</span>
        话术快捷插入
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        用按钮快速把“探询三问、兜底、惊喜、可追踪、闭环”打全。
      </p>

      <div className="mt-4 space-y-4">
        {groups.map((g) => (
          <div key={g.title} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">{g.icon}</span>
              <p className="font-semibold text-sm">{g.title}</p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {g.items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => onInsert(it.text)}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{it.label}</span>
                    <span className="material-symbols-outlined text-slate-400 text-base">add_circle</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{it.text}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
