
import { useState, useCallback, useRef } from "react";
import { AppStatus, AnalysisResult, Mood, RiskLevel, StepThought } from "../types";
import { stepThoughts, mockResults } from "../lib/mock-data";

export interface StepOutput {
  phase: AppStatus;
  thought: string;
  content: string | null;
  done: boolean;
}

const randomRiskLevels: RiskLevel[] = [RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW];

export function useAnalysis() {
  const [phase, setPhase] = useState<AppStatus>(AppStatus.IDLE);
  const [mood, setMood] = useState<Mood>("thinking");
  const [statusText, setStatusText] = useState("等待输入...");
  const [steps, setSteps] = useState<StepOutput[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setPhase(AppStatus.IDLE);
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
    
    // Simulate initial delay
    setStatusText("正在加载资源...");
    await sleep(800);
    if (abortRef.current) return;

    // Pick a result randomly for demo (or based on input)
    const riskLevel = randomRiskLevels[Math.floor(Math.random() * randomRiskLevels.length)];
    
    // 智能格式化 Call ID：如果是纯数字，如 1、2，格式化为 ID-0001, ID-0002
    let formattedCallId = input.trim();
    if (/^\d+$/.test(formattedCallId)) {
      formattedCallId = `ID-${formattedCallId.padStart(4, "0")}`;
    }
    
    const baseResult = mockResults[riskLevel];
    const mockResult = {
      ...baseResult,
      callId: formattedCallId,
    };
    
    // Set result early so ContentCards can access data during the loop
    setResult(mockResult);

    const newSteps: StepOutput[] = [];

    for (let i = 0; i < stepThoughts.length; i++) {
      if (abortRef.current) return;

      const step = stepThoughts[i];
      setPhase(step.phase);
      setMood("thinking");
      setStatusText(step.thought);

      // Add thought bubble
      newSteps.push({
        phase: step.phase,
        thought: step.thought,
        content: null,
        done: false,
      });
      setSteps([...newSteps]);

      await sleep(1000);
      if (abortRef.current) return;

      // Fill content
      const content = getContentForPhase(step.phase, mockResult);
      newSteps[newSteps.length - 1] = {
        ...newSteps[newSteps.length - 1],
        content: content,
        done: true,
      };
      setSteps([...newSteps]);

      await sleep(1500);
      if (abortRef.current) return;
    }

    // Completion
    setPhase(AppStatus.RESULT);
    const finalMood: Mood = riskLevel === RiskLevel.LOW ? "happy" : riskLevel === RiskLevel.MEDIUM ? "serious" : "danger";
    setMood(finalMood);
    setStatusText(riskLevel === RiskLevel.LOW ? "分析完成，一切正常" : riskLevel === RiskLevel.MEDIUM ? "分析完成，存在风险" : "分析完成，发现高风险");
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

function getContentForPhase(phase: AppStatus, result: AnalysisResult): string {
  switch (phase) {
    case AppStatus.ASR:
      return result.transcript
        .map((l) => `[${l.timestamp}] ${l.role === "caller" ? "主叫" : "被叫"}: ${l.text}`)
        .join("\n");
    case AppStatus.DATA:
      return [
        `号码接入平台 ${result.multiDimensionData.platformDuration} 天，${result.multiDimensionData.platformDuration > 100 ? "非新号" : "新号"}`,
        `企业在网 ${result.multiDimensionData.enterpriseDuration} 年，风险权重较低`,
        `异地呼叫占比 ${result.multiDimensionData.crossRegionCallRatio}%，${result.multiDimensionData.crossRegionCallRatio > 30 ? "指标异常" : "指标正常"}`,
        `呼叫离散度：${result.multiDimensionData.callDiscreteness}`,
      ].join("\n");
    case AppStatus.CATEGORY:
      return result.category.reasoning;
    case AppStatus.RISK:
      return result.risk.reasoning;
    case AppStatus.FRAUD:
      return result.fraud.reasoning;
    case AppStatus.STRATEGY:
      return result.strategy.reasoning;
    default:
      return "";
  }
}
