
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import ThoughtBubble from "./ThoughtBubble";
import ContentCard, {
  TranscriptContent,
  DataContent,
  ReasoningContent,
  StrategyContent,
} from "./ContentCard";
import { StepOutput } from "../hooks/useAnalysis";
import { AnalysisResult, AppStatus } from "../types";

interface ThinkingOutputProps {
  steps: StepOutput[];
  result: AnalysisResult | null;
}

export default function ThinkingOutput({ steps, result }: ThinkingOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps]);

  if (steps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center opacity-20 pointer-events-none">
        <div className="w-32 h-32 border border-dashed border-primary/50 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
          <div className="w-4 h-4 bg-primary" />
        </div>
        <p className="mt-8 text-[11px] font-mono tracking-[0.5em] uppercase">SYSTEM IDLE: WAITING FOR INPUT</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 custom-scrollbar">
      {steps.map((step, i) => (
        <div key={i} className="space-y-4">
          <ThoughtBubble text={step.thought} />
          {step.content && (
            <div className="pl-12">
              <StepContent phase={step.phase} content={step.content} result={result} />
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} className="h-20" />
    </div>
  );
}

function StepContent({
  phase,
  content,
  result,
}: {
  phase: AppStatus;
  content: string;
  result: AnalysisResult | null;
}) {
  if (!result) return null;

  switch (phase) {
    case AppStatus.ASR: {
      return (
        <ContentCard type="asr" label="ASR Transcript Stream">
          <TranscriptContent lines={result.transcript} />
        </ContentCard>
      );
    }
    case AppStatus.DATA: {
      const items = content.split("\n");
      return (
        <ContentCard type="data" label="Multi-Dimensional Analysis">
          <DataContent items={items} />
        </ContentCard>
      );
    }
    case AppStatus.CATEGORY:
      return (
        <ContentCard type="reasoning" label="Entity Categorization">
          <ReasoningContent text={content} probability={result.category.confidence} />
        </ContentCard>
      );
    case AppStatus.RISK:
      return (
        <ContentCard type="reasoning" label="Heuristic Risk Assessment">
          <ReasoningContent text={content} probability={result.risk.confidence} />
        </ContentCard>
      );
    case AppStatus.FRAUD:
      return (
        <ContentCard type="reasoning" label="Fraud Probability Vector">
          <ReasoningContent text={content} probability={result.fraud.probability} />
        </ContentCard>
      );
    case AppStatus.STRATEGY:
      return (
        <ContentCard type="strategy" label="Final Resolution Strategy">
          <div className="space-y-4">
            <StrategyContent text={content} />
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.strategy.confidence}%` }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-secondary"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-secondary">
                CONFIDENCE: {result.strategy.confidence}%
              </span>
            </div>
          </div>
        </ContentCard>
      );
    default:
      return null;
  }
}
