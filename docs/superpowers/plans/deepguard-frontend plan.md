# DeepGuard 风控智能体前端交互页面 — 实施计划 [已完成]

> **项目状态**：本实施计划中的所有开发任务已于子项目 `mochi-guard---ai-risk-inspector (1)` 中完全落地实现。
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.


**Goal:** 构建风控智能体可视化前端页面，以机器人思考互动方式展示判定全流程。

**Architecture:** Next.js 单页应用，左右分栏布局（左 35% 机器人面板 + 右 65% 思考输出），useAnalysis hook 管理流程状态机，RobotAssistant 组件切表情，ThoughtBubble + ContentCard 交替展示思考过程。idle 状态右侧显示欢迎引导+输入框，分析完成后弹窗关闭重置回 idle。

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Three.js, React Three Fiber, @react-three/drei

**Design Tokens:** DM Sans (正文) + JetBrains Mono (代码/时间戳)，主色 Sky (#0ea5e9)，设计 token 文件统一管理色彩/间距。

**Design Review Decisions:**
1. D1: idle 状态右侧显示欢迎引导文案 + 输入框
2. D2: 输入框从 Header 移到右侧欢迎区，Header 只保留 logo+标题
3. D3: 补全所有交互状态（输入无效、拖拽 hover、分析中断、错误重试）
4. D4: 加入口引导文案 + 分析完成后的"再来一次"闭环按钮
5. D5: 去掉卡片左边框色条，改用背景色块 + 更醒目的步骤标签区分类型
6. D6: 字体 DM Sans + JetBrains Mono，主色 Sky (#0ea5e9) 替换蓝紫渐变
7. D7: 创建 src/lib/design-tokens.ts，所有色值通过 token 引用
8. D8: 768px 以下改为上下布局，弹窗加 ESC 关闭，淡色文字对比度调亮，触摸目标 ≥44px
9. D9: 弹窗关闭后重置回 idle 状态

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/types/analysis.ts` | 所有 TypeScript 类型定义 |
| `src/lib/design-tokens.ts` | 设计 token：色彩、间距、字号 CSS 变量 |
| `src/lib/mock-data.ts` | Mock 数据，3 种风险等级各一份 |
| `src/hooks/useAnalysis.ts` | 分析流程状态机 + 打字机效果 |
| `src/components/RobotAssistant.tsx` | 3D 机器人角色组件（R3F + GLB），4 种 mood 通过 emissive 切换 |
| `src/components/RobotCanvas.tsx` | R3F Canvas 包装组件，加载 GLB + 配置灯光 + Draco 解码 |
| `src/components/Header.tsx` | 顶部栏：logo + 标题（仅此） |
| `src/components/WelcomePanel.tsx` | idle 状态欢迎引导 + 输入框 |
| `src/components/ThoughtBubble.tsx` | 机器人过渡语气泡 |
| `src/components/ContentCard.tsx` | 内容卡片（背景色块区分类型，无左边框） |
| `src/components/ThinkingOutput.tsx` | 右侧滚动输出区 |
| `src/components/RobotPanel.tsx` | 左侧机器人面板 + 拖拽区 |
| `src/components/RiskConclusion.tsx` | 底部风险等级结论条 |
| `src/components/ResultModal.tsx` | 结果弹窗（ESC 关闭） |
| `src/app/globals.css` | 全局样式 + 自定义动画 + CSS 变量 |
| `src/app/layout.tsx` | Root layout + 字体加载 |
| `src/app/page.tsx` | 主页面，组装所有组件 |

---

### Task 1: 项目初始化

**Files:**
- Create: `deepguard/` (Next.js 项目)

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd /Users/Administrator/Documents/ccproject
npx create-next-app@latest deepguard --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

- [ ] **Step 2: 安装 Three.js 相关依赖**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 3: 复制 3D 模型到 public 目录**

```bash
mkdir -p /Users/Administrator/Documents/ccproject/deepguard/public/models
cp "/Users/Administrator/Documents/ccproject/deepguard  design/assets/robot.glb" /Users/Administrator/Documents/ccproject/deepguard/public/models/robot.glb
```

- [ ] **Step 4: 验证项目可运行**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npm run dev &
sleep 5
curl -s http://localhost:3000 | head -20
```

Expected: HTML 输出包含 Next.js 页面内容

- [ ] **Step 5: 停止 dev server 并提交**

```bash
kill %1 2>/dev/null; true
cd /Users/Administrator/Documents/ccproject/deepguard
git add -A
git commit -m "chore: initialize Next.js project with Three.js and R3F"
```

---

### Task 2: 类型定义 + Mock 数据

**Files:**
- Create: `src/types/analysis.ts`
- Create: `src/lib/mock-data.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
// src/types/analysis.ts

export type Mood = "thinking" | "happy" | "serious" | "angry";

export type RiskLevel = "low" | "medium" | "high";

export type AnalysisPhase =
  | "idle"
  | "asr"
  | "data"
  | "category"
  | "risk"
  | "fraud"
  | "strategy"
  | "result";

export interface TranscriptLine {
  timestamp: string;
  role: "caller" | "callee";
  text: string;
}

export interface MultiDimensionData {
  platformDuration: number;
  enterpriseDuration: number;
  crossRegionCallRatio: number;
  callDiscreteness: string;
}

export interface CategoryResult {
  label: string;
  confidence: number;
  reasoning: string;
}

export interface RiskResult {
  level: RiskLevel;
  confidence: number;
  reasoning: string;
}

export interface FraudResult {
  probability: number;
  reasoning: string;
}

export interface StrategyResult {
  suggestion: string;
  confidence: number;
  reasoning: string;
}

export interface AnalysisResult {
  callId: string;
  transcript: TranscriptLine[];
  multiDimensionData: MultiDimensionData;
  category: CategoryResult;
  risk: RiskResult;
  fraud: FraudResult;
  strategy: StrategyResult;
}

export interface StepThought {
  phase: AnalysisPhase;
  thought: string;
}
```

- [ ] **Step 2: 创建 Mock 数据**

```typescript
// src/lib/mock-data.ts

import { AnalysisResult, StepThought } from "@/types/analysis";

export const stepThoughts: StepThought[] = [
  { phase: "asr", thought: "嗯，让我听听这段通话..." },
  { phase: "data", thought: "转写完了，我再查查这个号码的背景..." },
  { phase: "category", thought: "数据拿到了，让我判断下这通电话的性质..." },
  { phase: "risk", thought: "性质清楚了，看看风险程度..." },
  { phase: "fraud", thought: "风险看完了，再查下涉诈概率..." },
  { phase: "strategy", thought: "都分析完了，我来定个处理方案..." },
];

export const mockHighRisk: AnalysisResult = {
  callId: "CALL-20260513-0042",
  transcript: [
    { timestamp: "00:02", role: "caller", text: "您好，请问是张先生吗？" },
    { timestamp: "00:04", role: "callee", text: "是的，你是哪位？" },
    { timestamp: "00:06", role: "caller", text: "我是XX银行信贷中心的，想跟您确认下贷款利率调整的事。" },
    { timestamp: "00:09", role: "callee", text: "贷款利率？我没有办过贷款啊。" },
    { timestamp: "00:12", role: "caller", text: "系统显示您有一笔待确认的贷款记录，需要您提供银行卡号验证。" },
  ],
  multiDimensionData: {
    platformDuration: 128,
    enterpriseDuration: 3,
    crossRegionCallRatio: 12,
    callDiscreteness: "低",
  },
  category: {
    label: "贷款诈骗",
    confidence: 92,
    reasoning: "通话提到\"银行\"\"贷款利率\"\"银行卡号验证\"，结合呼叫模式——单次突发呼叫、非工作时间，判定为贷款诈骗类通话。",
  },
  risk: {
    level: "high",
    confidence: 92,
    reasoning: "被叫否认有贷款记录 → 主叫主动索要银行卡号 → 呼叫模式异常，风险等级：高风险。",
  },
  fraud: {
    probability: 89,
    reasoning: "特征匹配：冒充银行工作人员 + 索要敏感信息 + 单次突发呼叫，涉诈概率 89%。",
  },
  strategy: {
    suggestion: "自动拦截并标记",
    confidence: 89,
    reasoning: "涉诈概率 89% > 阈值 80%，建议自动拦截并标记，同时向被叫发送防诈提醒通知。",
  },
};

export const mockMediumRisk: AnalysisResult = {
  callId: "CALL-20260513-0107",
  transcript: [
    { timestamp: "00:01", role: "caller", text: "张总您好，我是小王，那个项目的尾款..." },
    { timestamp: "00:03", role: "callee", text: "哦小王啊，尾款的事情我在处理。" },
    { timestamp: "00:06", role: "caller", text: "好的张总，财务那边催得紧，您看能不能先转一部分？" },
    { timestamp: "00:09", role: "callee", text: "行，我下午转。" },
  ],
  multiDimensionData: {
    platformDuration: 256,
    enterpriseDuration: 5,
    crossRegionCallRatio: 35,
    callDiscreteness: "中",
  },
  category: {
    label: "催收类",
    confidence: 78,
    reasoning: "通话涉及\"尾款\"\"转账\"，但双方有称呼互动，更偏向催收类通话。",
  },
  risk: {
    level: "medium",
    confidence: 65,
    reasoning: "存在催款行为但语气平和，异地呼叫占比偏高，需关注。",
  },
  fraud: {
    probability: 32,
    reasoning: "双方有明确身份认知，无威胁或欺诈话术，涉诈概率较低。",
  },
  strategy: {
    suggestion: "人工复核",
    confidence: 65,
    reasoning: "风险中等且置信度未达阈值，建议人工复核确认。",
  },
};

export const mockLowRisk: AnalysisResult = {
  callId: "CALL-20260513-0215",
  transcript: [
    { timestamp: "00:01", role: "caller", text: "妈，我明天回家吃饭。" },
    { timestamp: "00:02", role: "callee", text: "好呀，想吃什么？" },
    { timestamp: "00:04", role: "caller", text: "红烧排骨！" },
    { timestamp: "00:05", role: "callee", text: "行，我明天去买。" },
  ],
  multiDimensionData: {
    platformDuration: 512,
    enterpriseDuration: 8,
    crossRegionCallRatio: 5,
    callDiscreteness: "低",
  },
  category: {
    label: "日常通话",
    confidence: 97,
    reasoning: "通话内容为家庭日常安排，无任何商业或金融相关话题。",
  },
  risk: {
    level: "low",
    confidence: 98,
    reasoning: "无任何风险特征，正常家庭通话。",
  },
  fraud: {
    probability: 2,
    reasoning: "完全无涉诈特征。",
  },
  strategy: {
    suggestion: "放行",
    confidence: 98,
    reasoning: "无风险，正常放行。",
  },
};
```

- [ ] **Step 3: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/types/analysis.ts src/lib/mock-data.ts
git commit -m "feat: add type definitions and mock data"
```

---

### Task 3: RobotAssistant 3D 组件

**Files:**
- Create: `src/components/RobotCanvas.tsx`
- Create: `src/components/RobotAssistant.tsx`

- [ ] **Step 1: 创建 RobotCanvas 组件（R3F Canvas 包装）**

```tsx
// src/components/RobotCanvas.tsx

"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import RobotModel from "./RobotAssistant";
import { Mood } from "@/types/analysis";

interface RobotCanvasProps {
  mood: Mood;
}

export default function RobotCanvas({ mood }: RobotCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 2.8], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} color="#4a6cf7" />
      <directionalLight position={[5, 10, 7]} intensity={1.0} />
      <pointLight position={[-2, 2, 3]} intensity={1.5} color="#22d3ee" distance={10} />
      <pointLight position={[2, 0, 2]} intensity={1.0} color="#0ea5e9" distance={10} />
      <RobotModel mood={mood} />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={5} blur={2.5} />
      <Environment preset="night" />
    </Canvas>
  );
}
```

- [ ] **Step 2: 创建 RobotAssistant 组件（3D 模型 + 情绪切换）**

```tsx
// src/components/RobotAssistant.tsx

"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Mood } from "@/types/analysis";

const MOOD_EMISSIVE: Record<Mood, THREE.Color> = {
  thinking: new THREE.Color("#22d3ee"),
  happy: new THREE.Color("#10b981"),
  serious: new THREE.Color("#f59e0b"),
  angry: new THREE.Color("#ef4444"),
};

const MOOD_EMISSIVE_INTENSITY: Record<Mood, number> = {
  thinking: 0.15,
  happy: 0.2,
  serious: 0.15,
  angry: 0.3,
};

interface RobotModelProps {
  mood: Mood;
}

export default function RobotModel({ mood }: RobotModelProps) {
  const { scene } = useGLTF("/models/robot.glb");
  const groupRef = useRef<THREE.Group>(null);
  const targetEmissive = useRef(MOOD_EMISSIVE[mood]);
  const targetIntensity = useRef(MOOD_EMISSIVE_INTENSITY[mood]);

  useEffect(() => {
    targetEmissive.current = MOOD_EMISSIVE[mood];
    targetIntensity.current = MOOD_EMISSIVE_INTENSITY[mood];
  }, [mood]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // 浮动动画
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;

    // 缓慢自转
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;

    // 情绪切换：平滑过渡 emissive 颜色
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          mat.emissive.lerp(targetEmissive.current, 0.05);
          mat.emissiveIntensity += (targetIntensity.current - mat.emissiveIntensity) * 0.05;
        }
      }
    });

    // angry 时轻微抖动
    if (mood === "angry") {
      groupRef.current.position.x = (Math.random() - 0.5) * 0.008;
    } else {
      groupRef.current.position.x *= 0.9;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.8} position={[0, -0.6, 0]} />
    </group>
  );
}

useGLTF.preload("/models/robot.glb");
```

- [ ] **Step 2: 在 globals.css 添加动画 keyframes**

在 `src/app/globals.css` 的 `@tailwind` 指令之后添加：

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- [ ] **Step 3: 验证组件渲染无报错**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npm run build 2>&1 | tail -5
```

Expected: Build succeeds (组件还未被引用，但类型检查应通过)

- [ ] **Step 4: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/components/RobotCanvas.tsx src/components/RobotAssistant.tsx src/app/globals.css
git commit -m "feat: add 3D RobotAssistant with R3F and mood-driven emissive"
```

---

### Task 4: ThoughtBubble + ContentCard 组件

**Files:**
- Create: `src/components/ThoughtBubble.tsx`
- Create: `src/components/ContentCard.tsx`

- [ ] **Step 1: 创建 ThoughtBubble 组件**

```tsx
// src/components/ThoughtBubble.tsx

"use client";

export default function ThoughtBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 animate-[slideIn_0.5s_ease-out]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4a6cf7] to-[#6c5ce7] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 220 220" className="w-4 h-4">
          <circle cx="110" cy="110" r="90" fill="#4a6cf7" />
          <ellipse cx="85" cy="100" rx="12" ry="8" fill="#6ee7ff" />
          <ellipse cx="135" cy="100" rx="12" ry="8" fill="#6ee7ff" />
        </svg>
      </div>
      <div className="bg-[#111827] rounded-xl rounded-tl-none px-3.5 py-2.5 text-[#8b8fa3] text-[13px] italic max-w-[85%]">
        {text}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 ContentCard 组件**

```tsx
// src/components/ContentCard.tsx

"use client";

import { TranscriptLine } from "@/types/analysis";

type ContentCardType = "asr" | "data" | "reasoning" | "strategy";

interface ContentCardProps {
  type: ContentCardType;
  label: string;
  children: React.ReactNode;
}

const borderColors: Record<ContentCardType, string> = {
  asr: "border-l-[#4a6cf7]",
  data: "border-l-[#f59e0b]",
  reasoning: "border-l-[#10b981]",
  strategy: "border-l-[#38bdf8]",
};

const labelColors: Record<ContentCardType, string> = {
  asr: "text-[#4a6cf7]",
  data: "text-[#f59e0b]",
  reasoning: "text-[#10b981]",
  strategy: "text-[#38bdf8]",
};

export default function ContentCard({ type, label, children }: ContentCardProps) {
  return (
    <div
      className={`bg-[#111827] rounded-[10px] px-4 py-3.5 border-l-[3px] ${borderColors[type]} animate-[slideIn_0.5s_ease-out]`}
    >
      <div className={`text-[10px] font-semibold mb-2 ${labelColors[type]}`}>{label}</div>
      {children}
    </div>
  );
}

export function TranscriptContent({ lines }: { lines: TranscriptLine[] }) {
  return (
    <div className="text-xs leading-7">
      {lines.map((line, i) => (
        <div key={i}>
          <span className="text-[#4a5578] text-[10px] mr-2">{line.timestamp}</span>
          <span className={line.role === "caller" ? "text-[#6c7ae0]" : "text-[#e07c5e]"}>
            {line.role === "caller" ? "主叫" : "被叫"}
          </span>
          : {line.text}
        </div>
      ))}
    </div>
  );
}

export function DataContent({ items }: { items: { done: boolean; text: string }[] }) {
  return (
    <div className="text-xs leading-8 text-[#9ca3af]">
      {items.map((item, i) => (
        <div key={i}>
          <span className={item.done ? "text-[#10b981]" : "text-[#f59e0b] animate-pulse"}>●</span>{" "}
          {item.text}
        </div>
      ))}
    </div>
  );
}

export function ReasoningContent({ text }: { text: string }) {
  return <div className="text-xs text-[#6b7280] italic leading-5">{text}</div>;
}

export function StrategyContent({ text }: { text: string }) {
  return <div className="text-xs text-[#38bdf8] leading-5">{text}</div>;
}
```

- [ ] **Step 3: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/components/ThoughtBubble.tsx src/components/ContentCard.tsx
git commit -m "feat: add ThoughtBubble and ContentCard components"
```

---

### Task 5: Header + RobotPanel 组件

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/RobotPanel.tsx`

- [ ] **Step 1: 创建 Header 组件**

```tsx
// src/components/Header.tsx

"use client";

interface HeaderProps {
  onSubmit: (input: string) => void;
}

export default function Header({ onSubmit }: HeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) onSubmit(value);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f1424] border-b border-[#1e2a4a]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-[#4a6cf7] to-[#6c5ce7] rounded-lg flex items-center justify-center text-base">
          🛡
        </div>
        <span className="text-lg font-bold text-[#e0e0e0]">DeepGuard</span>
        <span className="text-xs text-[#6c7ae0] ml-2">风控智能体</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          className="bg-[#111827] border border-[#2a3a6a] rounded-lg px-4 py-2 text-[#e0e0e0] text-sm w-64 outline-none focus:border-[#4a6cf7] transition-colors"
          placeholder="输入通话 ID..."
          onKeyDown={handleKeyDown}
        />
        <div className="bg-[#111827] border-2 border-dashed border-[#3a4a7a] rounded-lg px-4 py-2 text-[#4a5578] text-[13px] cursor-pointer hover:border-[#4a6cf7] hover:text-[#6c7ae0] transition-colors">
          拖拽音频文件
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 创建 RobotPanel 组件**

```tsx
// src/components/RobotPanel.tsx

"use client";

import RobotCanvas from "./RobotCanvas";
import { Mood } from "@/types/analysis";

interface RobotPanelProps {
  mood: Mood;
  statusText: string;
}

export default function RobotPanel({ mood, statusText }: RobotPanelProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 预留：处理音频文件拖拽
  };

  return (
    <div
      className="w-[35%] bg-[#0a0e1a] border-r border-[#1e2a4a] flex flex-col items-center justify-center p-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-[280px] h-[320px]">
          <RobotCanvas mood={mood} />
        </div>
        <div className="text-[#6c7ae0] text-sm italic animate-pulse">{statusText}</div>
        <div className="mt-5 w-32 h-14 border-2 border-dashed border-[#3a4a7a] rounded-xl flex items-center justify-center text-[#4a5578] text-[11px] hover:border-[#0ea5e9] hover:text-[#6c7ae0] transition-colors cursor-pointer">
          拖拽音频文件
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/components/Header.tsx src/components/RobotPanel.tsx
git commit -m "feat: add Header and RobotPanel components"
```

---

### Task 6: RiskConclusion + ResultModal 组件

**Files:**
- Create: `src/components/RiskConclusion.tsx`
- Create: `src/components/ResultModal.tsx`

- [ ] **Step 1: 创建 RiskConclusion 组件**

```tsx
// src/components/RiskConclusion.tsx

"use client";

import { RiskLevel } from "@/types/analysis";

interface RiskConclusionProps {
  riskLevel: RiskLevel | null;
  callId: string;
  categoryLabel: string;
  fraudProbability: number;
  onViewResult: () => void;
}

const badgeStyles: Record<RiskLevel, string> = {
  low: "bg-[#10b981] text-white",
  medium: "bg-[#f59e0b] text-white",
  high: "bg-[#ef4444] text-white",
};

const labels: Record<RiskLevel, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
};

export default function RiskConclusion({
  riskLevel,
  callId,
  categoryLabel,
  fraudProbability,
  onViewResult,
}: RiskConclusionProps) {
  if (!riskLevel) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 py-2.5 bg-[#0f1424] border-t border-[#1e2a4a] flex items-center justify-between z-50 animate-[fadeIn_0.3s]">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-md text-[13px] font-semibold ${badgeStyles[riskLevel]}`}>
          {labels[riskLevel]}
        </div>
        <div className="text-[#9ca3af] text-xs">
          通话 ID: {callId} | {categoryLabel} | 涉诈概率 {fraudProbability}%
        </div>
      </div>
      <button
        onClick={onViewResult}
        className="bg-[#4a6cf7] text-white px-5 py-2 rounded-lg text-[13px] cursor-pointer border-none hover:bg-[#3a5ce5] transition-colors"
      >
        查看完整结果
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 创建 ResultModal 组件**

```tsx
// src/components/ResultModal.tsx

"use client";

import { AnalysisResult } from "@/types/analysis";

interface ResultModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

const riskLabels = { low: "低风险", medium: "中风险", high: "高风险" };
const riskBadgeStyles = {
  low: "bg-[#10b981] text-white",
  medium: "bg-[#f59e0b] text-white",
  high: "bg-[#ef4444] text-white",
};

export default function ResultModal({ result, onClose }: ResultModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center animate-[fadeIn_0.3s]"
      onClick={onClose}
    >
      <div
        className="bg-[#111827] rounded-2xl w-[560px] max-h-[80vh] overflow-hidden border border-[#2a3a6a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="px-6 py-4 border-b border-[#1e2a4a] flex items-center justify-between">
          <div className="text-base font-semibold">风控分析结果</div>
          <div className="text-[#6b7280] text-xl cursor-pointer" onClick={onClose}>✕</div>
        </div>

        {/* body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[60vh]">
          {/* call id */}
          <div className="mb-4">
            <div className="text-[11px] text-[#6b7280] mb-2">通话 ID</div>
            <div className="text-sm text-[#e0e0e0]">{result.callId}</div>
          </div>

          {/* transcript */}
          <div className="mb-4">
            <div className="text-[11px] text-[#6b7280] mb-2">通话内容</div>
            <div className="bg-[#0a0e1a] rounded-lg p-3 max-h-40 overflow-y-auto text-[11px] leading-7">
              {result.transcript.map((line, i) => (
                <div key={i}>
                  <span className={line.role === "caller" ? "text-[#6c7ae0]" : "text-[#e07c5e]"}>
                    {line.role === "caller" ? "主叫" : "被叫"}
                  </span>
                  : {line.text}
                </div>
              ))}
            </div>
          </div>

          {/* metrics */}
          <div>
            {/* category */}
            <div className="flex items-center justify-between py-2.5 border-b border-[#1e2a4a]">
              <div className="text-[13px] text-[#e0e0e0]">类目</div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">{result.category.label}</span>
                <ConfidenceBar value={result.category.confidence} color="#10b981" />
                <span className="text-xs text-[#9ca3af]">{result.category.confidence}%</span>
              </div>
            </div>

            {/* risk */}
            <div className="flex items-center justify-between py-2.5 border-b border-[#1e2a4a]">
              <div className="text-[13px] text-[#e0e0e0]">风险等级</div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-[3px] rounded text-[11px] ${riskBadgeStyles[result.risk.level]}`}>
                  {riskLabels[result.risk.level]}
                </span>
                <ConfidenceBar value={result.risk.confidence} color={result.risk.level === "high" ? "#ef4444" : result.risk.level === "medium" ? "#f59e0b" : "#10b981"} />
                <span className="text-xs text-[#9ca3af]">{result.risk.confidence}%</span>
              </div>
            </div>

            {/* strategy */}
            <div className="flex items-center justify-between py-2.5">
              <div className="text-[13px] text-[#e0e0e0]">处理建议</div>
              <div className="flex items-center gap-2">
                {result.strategy.confidence > 80 ? (
                  <span className="px-2.5 py-[3px] rounded text-[11px] bg-[#10b981] text-white">已处理 · {result.strategy.suggestion}</span>
                ) : (
                  <span className="px-2.5 py-[3px] rounded text-[11px] bg-[#f59e0b] text-white">需二次确认</span>
                )}
                <ConfidenceBar value={result.strategy.confidence} color="#38bdf8" />
                <span className="text-xs text-[#9ca3af]">{result.strategy.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-15 h-1.5 bg-[#1e2a4a] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/components/RiskConclusion.tsx src/components/ResultModal.tsx
git commit -m "feat: add RiskConclusion and ResultModal components"
```

---

### Task 7: useAnalysis hook

**Files:**
- Create: `src/hooks/useAnalysis.ts`

- [ ] **Step 1: 创建 useAnalysis hook**

```typescript
// src/hooks/useAnalysis.ts

"use client";

import { useState, useCallback, useRef } from "react";
import { AnalysisPhase, AnalysisResult, Mood, RiskLevel } from "@/types/analysis";
import { stepThoughts, mockHighRisk, mockMediumRisk, mockLowRisk } from "@/lib/mock-data";

export interface StepOutput {
  phase: AnalysisPhase;
  thought: string;
  content: React.ReactNode | null;
  done: boolean;
}

const mockResults: Record<RiskLevel, AnalysisResult> = {
  high: mockHighRisk,
  medium: mockMediumRisk,
  low: mockLowRisk,
};

const randomRiskLevels: RiskLevel[] = ["high", "medium", "low"];

export function useAnalysis() {
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [mood, setMood] = useState<Mood>("thinking");
  const [statusText, setStatusText] = useState("等待输入...");
  const [steps, setSteps] = useState<StepOutput[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setPhase("idle");
    setMood("thinking");
    setStatusText("等待输入...");
    setSteps([]);
    setResult(null);
    setShowModal(false);
  }, []);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const startAnalysis = useCallback(async (input: string) => {
    abortRef.current = false;
    setSteps([]);
    setResult(null);
    setShowModal(false);

    // 随机选一个 mock 结果
    const riskLevel = randomRiskLevels[Math.floor(Math.random() * randomRiskLevels.length)];
    const mockResult = mockResults[riskLevel];

    const newSteps: StepOutput[] = [];

    for (let i = 0; i < stepThoughts.length; i++) {
      if (abortRef.current) return;

      const step = stepThoughts[i];
      setPhase(step.phase);
      setMood("thinking");
      setStatusText(step.thought);

      // 添加 thought bubble
      newSteps.push({
        phase: step.phase,
        thought: step.thought,
        content: null,
        done: false,
      });
      setSteps([...newSteps]);

      await sleep(500);
      if (abortRef.current) return;

      // 添加 content
      const contentNode = getContentForPhase(step.phase, mockResult);
      newSteps[newSteps.length - 1] = {
        ...newSteps[newSteps.length - 1],
        content: contentNode,
        done: true,
      };
      setSteps([...newSteps]);

      await sleep(1500);
      if (abortRef.current) return;
    }

    // 完成
    setPhase("result");
    const finalMood: Mood = riskLevel === "low" ? "happy" : riskLevel === "medium" ? "serious" : "angry";
    setMood(finalMood);
    setStatusText(riskLevel === "low" ? "分析完成，一切正常" : riskLevel === "medium" ? "分析完成，存在风险" : "分析完成，发现高风险");
    setResult(mockResult);
  }, []);

  return {
    phase,
    mood,
    statusText,
    steps,
    result,
    showModal,
    setShowModal,
    startAnalysis,
    reset,
  };
}

function getContentForPhase(phase: AnalysisPhase, result: AnalysisResult): string {
  switch (phase) {
    case "asr":
      return result.transcript
        .map((l) => `[${l.timestamp}] ${l.role === "caller" ? "主叫" : "被叫"}: ${l.text}`)
        .join("\n");
    case "data":
      return [
        `号码接入平台 ${result.multiDimensionData.platformDuration} 天，${result.multiDimensionData.platformDuration > 100 ? "不算新号" : "新号"}`,
        `企业在网 ${result.multiDimensionData.enterpriseDuration} 年，稳定`,
        `异地呼叫占比 ${result.multiDimensionData.crossRegionCallRatio}%，${result.multiDimensionData.crossRegionCallRatio > 30 ? "偏高" : "正常范围"}`,
        `呼叫离散度${result.multiDimensionData.callDiscreteness}`,
      ].join("\n");
    case "category":
      return result.category.reasoning;
    case "risk":
      return result.risk.reasoning;
    case "fraud":
      return result.fraud.reasoning;
    case "strategy":
      return result.strategy.reasoning;
    default:
      return "";
  }
}
```

- [ ] **Step 2: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/hooks/useAnalysis.ts
git commit -m "feat: add useAnalysis hook with state machine"
```

---

### Task 8: ThinkingOutput 组件

**Files:**
- Create: `src/components/ThinkingOutput.tsx`

- [ ] **Step 1: 创建 ThinkingOutput 组件**

```tsx
// src/components/ThinkingOutput.tsx

"use client";

import { useEffect, useRef } from "react";
import ThoughtBubble from "./ThoughtBubble";
import ContentCard, {
  TranscriptContent,
  DataContent,
  ReasoningContent,
  StrategyContent,
} from "./ContentCard";
import { StepOutput, AnalysisResult } from "@/types/analysis";

interface ThinkingOutputProps {
  steps: StepOutput[];
  result: AnalysisResult | null;
}

export default function ThinkingOutput({ steps, result }: ThinkingOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps]);

  return (
    <div className="w-[65%] p-5 overflow-y-auto flex flex-col gap-4">
      {steps.map((step, i) => (
        <div key={i}>
          <ThoughtBubble text={step.thought} />
          {step.content && (
            <div className="mt-3">
              <StepContent phase={step.phase} content={step.content} result={result} />
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function StepContent({
  phase,
  content,
  result,
}: {
  phase: string;
  content: string;
  result: AnalysisResult | null;
}) {
  if (!result) return null;
  const text = content as string;

  switch (phase) {
    case "asr": {
      const lines = text.split("\n").map((line) => {
        const match = line.match(/\[(.+?)\]\s+(主叫|被叫):\s*(.+)/);
        if (!match) return null;
        return {
          timestamp: match[1],
          role: match[2] === "主叫" ? "caller" as const : "callee" as const,
          text: match[3],
        };
      }).filter(Boolean);
      return (
        <ContentCard type="asr" label="ASR 转写">
          <TranscriptContent lines={lines as any} />
        </ContentCard>
      );
    }
    case "data": {
      const items = text.split("\n").map((t) => ({ done: true, text: t }));
      return (
        <ContentCard type="data" label="多维数据分析">
          <DataContent items={items} />
        </ContentCard>
      );
    }
    case "category":
      return (
        <ContentCard type="reasoning" label="类目分类">
          <ReasoningContent text={text} />
        </ContentCard>
      );
    case "risk":
      return (
        <ContentCard type="reasoning" label="风险判定" >
          <ReasoningContent text={text} />
        </ContentCard>
      );
    case "fraud":
      return (
        <ContentCard type="reasoning" label="涉诈判定">
          <ReasoningContent text={text} />
        </ContentCard>
      );
    case "strategy":
      return (
        <ContentCard type="strategy" label="处理策略">
          <StrategyContent text={text} />
        </ContentCard>
      );
    default:
      return null;
  }
}
```

- [ ] **Step 2: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/components/ThinkingOutput.tsx
git commit -m "feat: add ThinkingOutput component"
```

---

### Task 9: 主页面组装

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (深色主题背景)

- [ ] **Step 1: 修改 layout.tsx 设置深色主题**

```tsx
// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepGuard - 风控智能体",
  description: "业务风控预测智能体可视化平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark">
      <body className="bg-[#0a0e1a] text-[#e0e0e0] min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: 修改 globals.css 添加深色主题基础样式**

在 globals.css 已有内容基础上，确保以下样式在 tailwind 指令之后：

```css
/* 确保已有 @tailwind 指令和 keyframes，在末尾添加： */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0a0e1a;
}
::-webkit-scrollbar-thumb {
  background: #2a3a6a;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3a4a7a;
}
```

- [ ] **Step 3: 创建主页面**

```tsx
// src/app/page.tsx

"use client";

import Header from "@/components/Header";
import RobotPanel from "@/components/RobotPanel";
import ThinkingOutput from "@/components/ThinkingOutput";
import RiskConclusion from "@/components/RiskConclusion";
import ResultModal from "@/components/ResultModal";
import { useAnalysis } from "@/hooks/useAnalysis";

export default function Home() {
  const {
    mood,
    statusText,
    steps,
    result,
    showModal,
    setShowModal,
    startAnalysis,
    reset,
  } = useAnalysis();

  const handleSubmit = (input: string) => {
    reset();
    startAnalysis(input);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onSubmit={handleSubmit} />

      <div className="flex flex-1 overflow-hidden">
        <RobotPanel mood={mood} statusText={statusText} />
        <ThinkingOutput steps={steps} result={result} />
      </div>

      {result && (
        <RiskConclusion
          riskLevel={result.risk.level}
          callId={result.callId}
          categoryLabel={result.category.label}
          fraudProbability={result.fraud.probability}
          onViewResult={() => setShowModal(true)}
        />
      )}

      {showModal && result && (
        <ResultModal result={result} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: 验证构建通过**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npm run build 2>&1 | tail -10
```

Expected: Build succeeds

- [ ] **Step 5: 提交**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add src/app/page.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: assemble main page with all components"
```

---

### Task 10: 功能验证 + 修复

**Files:**
- Potentially modify any component based on testing feedback

- [ ] **Step 1: 启动 dev server 并手动测试**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npm run dev
```

在浏览器打开 http://localhost:3000，逐项测试：

1. 页面加载：深色主题，左右分栏，机器人显示
2. 输入通话 ID 并回车：触发分析流程
3. 分析流程：机器人表情切换、过渡语出现、内容卡片逐步展开
4. 最终结果：底部结论条出现，风险标签颜色正确
5. 查看结果弹窗：内容完整，置信度条显示正确
6. 关闭弹窗：正常关闭

- [ ] **Step 2: 修复发现的问题**

根据手动测试中发现的问题，逐个修复。常见问题可能包括：
- ESLint 错误
- 类型错误
- 样式偏差
- 动画不流畅

- [ ] **Step 3: 运行 lint 验证**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npx eslint . 2>&1
```

Expected: 0 errors, 0 warnings

- [ ] **Step 4: 运行 build 验证**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
npm run build 2>&1 | tail -10
```

Expected: Build succeeds

- [ ] **Step 5: 提交最终修复**

```bash
cd /Users/Administrator/Documents/ccproject/deepguard
git add -A
git commit -m "fix: address issues found during manual testing"
```
