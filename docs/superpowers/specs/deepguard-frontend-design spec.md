# 风控智能体前端交互页面 — 设计文档

## 概述

为业务风控预测智能体构建一套可视化前端页面，将后台判定流程以"机器人思考互动"的方式直观展示，让使用者感受到智能和高级感。

## 技术栈

- Next.js + React + TypeScript
- Tailwind CSS（深色科技主题）
- RobotAssistant 组件（CSS/Tailwind 实现，4 种 mood 表情）
- Mock 数据，预留 API 接口

## 项目位置

位于当前工作区子目录 `mochi-guard---ai-risk-inspector (1)/`

## 页面布局

左右分栏，深色科技风格：

```
┌──────────────────────────────────────────────┐
│  Header (logo + 通话ID输入框 + 音频拖拽区)    │
├───────────────┬──────────────────────────────┤
│               │                              │
│  RobotPanel   │     ThinkingOutput           │
│  (35%)        │     (65%)                    │
│               │                              │
│  机器人角色    │  ThoughtBubble → ContentCard  │
│  状态过渡语    │  ThoughtBubble → ContentCard  │
│  拖拽区域      │  ...                         │
│               │                              │
├───────────────┴──────────────────────────────┤
│  RiskConclusion (底部风险等级结论条，固定)      │
└──────────────────────────────────────────────┘
```

## 组件清单

### Header
- 项目 logo
- 通话 ID 输入框（回车触发分析）
- 音频文件拖拽区（拖入后触发分析）

### RobotPanel（左侧 35%）
- `RobotAssistant` 组件，接收 `mood` prop 切表情
- 状态过渡语文字（"嗯，让我听听这段通话..."）
- 拖拽音频的接收区域

### ThinkingOutput（右侧 65%）
- 滚动容器，自动滚到底部
- 内含交替出现的 ThoughtBubble 和 ContentCard

### ThoughtBubble
- 机器人头像 + 过渡语气泡
- 每步开始前先出现，表达机器人的"思考意图"
- 样式：斜体、略淡的颜色

### ContentCard
- 承载每步的输出内容
- 根据步骤类型有不同样式：
  - ASR 转写：正常色，主/被叫分色，含时分秒
  - 多维数据：正常色，逐条展开
  - 推理过程（类目/风险/涉诈/策略）：淡色斜体

### RiskConclusion
- 固定在页面底部
- 分析完成后显示风险等级条（低/中/高，对应绿/橙/红）
- 点击展开结果弹窗

### ResultModal（结果弹窗）
- 通话 ID
- 转写文本（占弹窗 1/3 高度，可滚动）
- 类目（置信度百分比）
- 风险等级（置信度百分比）
- 处理建议（置信度百分比）
  - 置信度 > 80%：显示"已处理"标签
  - 置信度 ≤ 80%：显示"需二次确认"按钮

## 机器人角色

使用 `RobotAssistant` 组件（React + TailwindCSS），支持 4 种 mood：

| mood | 表情 | 视觉特征 | 对应阶段 |
|------|------|---------|---------|
| thinking | 思考 | 微眯眼、嘴歪、问号气泡、浮动 | 分析过程中 |
| happy | 开心 | 弯弧眼、大笑嘴、举臂、星星 | 低风险结果 |
| serious | 严肃 | 圆眼直视、平嘴 | 中风险结果 |
| angry | 生气 | 窄眼旋转、倒弧嘴、抖动、感叹号 | 高风险结果 |

组件特征：圆头+深色面罩(#07111F)、两侧耳机带发光点、麦克风、小身体+波形条动画、手臂姿势随表情变化、整体浮动动画。

表情切换时发光色跟随变化：cyan(thinking) → green(happy) → amber(serious) → red(angry)。

## 交互流程（思考互动式）

不是流水线式步骤推进，而是机器人在"思考"，边想边说。右侧卡片是思考过程的自然流露。

### 流程阶段

| 阶段 | 机器人过渡语 | 输出卡片内容 | 卡片样式 |
|------|-------------|-------------|---------|
| ASR转写 | "嗯，让我听听这段通话..." | 转写文本，主/被叫分色，含时分秒 | 正常色 |
| 多维数据 | "转写完了，我再查查这个号码的背景..." | 4项数据逐条展开 | 正常色 |
| 类目分类 | "数据拿到了，让我判断下这通电话的性质..." | 推理过程 | 淡色斜体 |
| 风险判定 | "性质清楚了，看看风险程度..." | 推理过程 | 淡色斜体 |
| 涉诈判定 | "风险看完了，再查下涉诈概率..." | 推理过程 | 淡色斜体 |
| 处理策略 | "都分析完了，我来定个处理方案..." | 推理过程 | 单色 |
| 结果 | 表情变化 | 弹出结果弹窗 | 弹窗 |

### 状态变化规则

1. **进入步骤时**：机器人 mood 切换为 thinking，ThoughtBubble 出现过渡语
2. **停顿 0.5s**：模拟思考间隙
3. **ContentCard 出现**：内容逐字/逐条展开（打字机效果）
4. **步骤完成**：机器人短暂恢复平静，然后进入下一步
5. **最终结果**：机器人 mood 切换为 happy/serious/angry，RiskConclusion 显示，ResultModal 弹出

### 动画节奏

- 每步 3-5 秒
- 打字机效果：每字 30-50ms
- 多维数据逐条展开：每条间隔 0.3-0.5s
- 结果弹窗：淡入 0.3s

## 多维数据清单

1. 正在获取号码接入平台时长
2. 正在获取企业接入平台在网时长
3. 正在获取号码异地呼叫占比
4. 正在分析号码呼叫离散度

## 输入方式

1. **通话 ID 输入**：Header 中的输入框，回车触发
2. **音频拖拽**：RobotPanel 中的拖拽区，拖入后机器人有接收反馈动画，然后触发分析

## 深色主题色彩

| 用途 | 色值 |
|------|------|
| 页面背景 | #0a0e1a |
| 卡片背景 | #111827 |
| 主强调色 | #4a6cf7 (蓝紫) |
| 主文字 | #e0e0e0 |
| 次文字 | #9ca3af |
| 推理淡色 | #6b7280 |
| 低风险 | #10b981 |
| 中风险 | #f59e0b |
| 高风险 | #ef4444 |
| 主叫文字 | #6c7ae0 |
| 被叫文字 | #e07c5e |

## 数据接口预留

Mock 数据结构，后续对接后端 API 时替换数据源：

```typescript
interface AnalysisResult {
  callId: string;
  transcript: TranscriptLine[];
  multiDimensionData: {
    platformDuration: number;    // 号码接入平台时长(天)
    enterpriseDuration: number;  // 企业在网时长(年)
    crossRegionCallRatio: number; // 异地呼叫占比(%)
    callDiscreteness: string;    // 呼叫离散度描述
  };
  category: { label: string; confidence: number; reasoning: string };
  risk: { level: "low" | "medium" | "high"; confidence: number; reasoning: string };
  fraud: { probability: number; reasoning: string };
  strategy: { suggestion: string; confidence: number; reasoning: string };
}

interface TranscriptLine {
  timestamp: string;  // HH:MM:SS
  role: "caller" | "callee";
  text: string;
}
```

## 文件结构

```
deepguard/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # 主页面
│   │   └── globals.css
│   ├── components/
│   │   ├── RobotAssistant.tsx    # 机器人角色组件
│   │   ├── Header.tsx
│   │   ├── RobotPanel.tsx
│   │   ├── ThinkingOutput.tsx
│   │   ├── ThoughtBubble.tsx
│   │   ├── ContentCard.tsx
│   │   ├── RiskConclusion.tsx
│   │   └── ResultModal.tsx
│   ├── hooks/
│   │   └── useAnalysis.ts       # 分析流程状态管理
│   ├── lib/
│   │   └── mock-data.ts         # Mock 数据
│   └── types/
│       └── analysis.ts          # 类型定义
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```
