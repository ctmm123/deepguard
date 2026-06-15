
import { AnalysisResult, StepThought, AppStatus, RiskLevel } from "../types";

export const stepThoughts: StepThought[] = [
  { phase: AppStatus.ASR, thought: "嗯，让我听听这段通话..." },
  { phase: AppStatus.DATA, thought: "转写完了，我再查查这个号码的背景..." },
  { phase: AppStatus.CATEGORY, thought: "数据拿到了，让我判断下这通电话的性质..." },
  { phase: AppStatus.RISK, thought: "性质清楚了，看看风险程度..." },
  { phase: AppStatus.FRAUD, thought: "风险看完了，再查下涉诈概率..." },
  { phase: AppStatus.STRATEGY, thought: "都分析完了，我来定个处理方案..." },
];

export const mockHighRisk: AnalysisResult = {
  callId: "ID-9527-X",
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
    level: RiskLevel.HIGH,
    confidence: 92,
    reasoning: "被叫否认有贷款记录 -> 主叫主动索要银行卡号 -> 呼叫模式异常，风险等级：高风险。",
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
  callId: "ID-8848-M",
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
    level: RiskLevel.MEDIUM,
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
  callId: "ID-1024-L",
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
    level: RiskLevel.LOW,
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

export const mockResults: Record<RiskLevel, AnalysisResult> = {
  [RiskLevel.HIGH]: mockHighRisk,
  [RiskLevel.MEDIUM]: mockMediumRisk,
  [RiskLevel.LOW]: mockLowRisk,
};
