'use client';

import AppHeader from '@/components/AppHeader';
import Link from 'next/link';

const scripts = {
  explore: [
    '我先确认一下：你此刻最担心的是什么？',
    '你希望我做到什么程度，你才会觉得“这次处理是成功的”？',
    '如果接下来需要等待/补资料，你希望我给到你什么支持才安心？'
  ],
  offer: [
    '我先给你一个明确方案：我现在马上为你（动作），在（时间点）前给你第一次反馈。',
    '同时准备一个兜底：如果（风险）发生，我会改用（替代路径）保证你不被耽误。',
    '另外我可以额外做一件小事：我帮你（低成本惊喜），让你更省心。'
  ],
  action: [
    '接下来我来负责A，你这边只需要B；我会在C时间点给你结果。',
    '我会把进度通过（短信/邮件/回拨）同步给你，关键节点我会主动联系。'
  ],
  confirm: [
    '我复述一下共识：你要的是（目标），我将（方案+时点+兜底）。这样是否符合你的期望？',
    '今天我先把A处理完，明天（时间）我再回访确认最终结果。'
  ]
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader title="资料库" subtitle="MOT 速查 · 话术 · 练习清单" />

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-extrabold">MOT 关键时刻：一张图记住</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                关键时刻不是“流程”，而是客户情绪和风险最高、最容易形成口碑的触点。把四步跑顺：Explore → Offer → Action → Confirm。
              </p>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Explore 探索', desc: '共情 + 探询三问（担心点/成功标准/希望支持）' },
                  { title: 'Offer 提议', desc: '主方案 + 兜底方案 + 低成本惊喜' },
                  { title: 'Action 行动', desc: '责任人/时点/节点/可追踪' },
                  { title: 'Confirm 确认', desc: '复述共识 + 客户确认 + 回访闭环' }
                ].map((it) => (
                  <div key={it.title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                    <p className="font-bold">{it.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{it.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-lg">四步话术库（可直接照读）</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(scripts) as Array<keyof typeof scripts>).map((k) => (
                  <div key={k} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                    <p className="font-bold">{k.toUpperCase()}</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {scripts[k].map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-base text-slate-400">format_quote</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-lg">你的 PDF 速查手册（内嵌预览）</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">你上传的《MPT快速查阅手册》已放入 public 目录，可在此直接预览。</p>
              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <iframe src="/MPT快速查阅手册.pdf" className="w-full h-[560px]" />
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800">
              <h3 className="font-bold">练习清单</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>第一句：共情 + 复述问题</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>探询三问：担心点/成功标准/希望支持</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>提议：主方案 + 兜底 + 低成本惊喜</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>行动：责任人/时点/可追踪</li>
                <li className="flex items-start gap-2"><span className="material-symbols-outlined text-base">check</span>确认：复述共识 + 回访闭环</li>
              </ul>
              <div className="mt-5 flex gap-3">
                <Link href="/setup" className="flex-1 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-center">开始训练</Link>
                <Link href="/progress" className="flex-1 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 font-bold text-center">看成长</Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">为什么要“兜底 + 惊喜”？</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                兜底是“风险对冲”，让客户敢信；惊喜是“情绪价值”，让客户愿意讲出去。两者都不一定要花钱——关键是贴合场景、可兑现。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold">版本说明</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                当前版本为文字对练 + 自动评价。语音（TTS/ASR）与团队数据同步可作为下一阶段迭代。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
