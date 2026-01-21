# MOT 关键时刻互动练习（DeepSeek 版）

这是一个可直接部署到 GitHub + Vercel 的 **MOT（Explore → Offer → Action → Confirm）**互动训练应用：
- AI 扮演客户，你扮演服务人员
- 右侧一键插入“探询三问/兜底/惊喜/可追踪/闭环”话术
- 一键生成评分报告：四阶段星级 + 价值量表（-3..+3） + 关键时刻回放 + 下一次三步走
- 成长趋势页：本地记录每次训练分数

## 1. 本地运行

```bash
npm install
npm run dev
```

然后访问：http://localhost:3000

## 2. 环境变量

复制 `.env.example` 为 `.env.local`，填入你的 DeepSeek Key：

```bash
DEEPSEEK_API_KEY=...
```

## 3. 部署到 Vercel

1) 将本仓库 push 到 GitHub
2) Vercel 新建项目并导入该仓库
3) 在 Vercel 的 Environment Variables 添加：`DEEPSEEK_API_KEY`（必填）
4) Build Command 保持默认 (`next build`)

## 4. 目录结构
- `app/setup` 场景配置
- `app/practice/[id]` 对练对话
- `app/report/[id]` 评分报告
- `app/progress` 成长趋势
- `app/resources` 资料库（含你上传的 PDF 预览）

## 5. 注意事项
- 当前版本数据默认保存在浏览器 localStorage（无需数据库）。
- 若要多端同步/团队化，可在下一版接入 Supabase/Firebase/Airtable。
