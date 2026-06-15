
import React from "react";
import { motion } from "motion/react";
import { TranscriptLine } from "../types";

type ContentCardType = "asr" | "data" | "reasoning" | "strategy";

interface ContentCardProps {
  type: ContentCardType;
  label: string;
  children: React.ReactNode;
}

const colors: Record<ContentCardType, { border: string; text: string; bg: string }> = {
  asr: { border: "border-primary", text: "text-primary", bg: "bg-primary/5" },
  data: { border: "border-warning", text: "text-warning", bg: "bg-warning/5" },
  reasoning: { border: "border-success", text: "text-success", bg: "bg-success/5" },
  strategy: { border: "border-secondary", text: "text-secondary", bg: "bg-secondary/5" },
};

export default function ContentCard({ type, label, children }: ContentCardProps) {
  const style = colors[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-card border-l-[3px] ${style.border} ${style.bg} rounded-r-xl px-5 py-4 shadow-sm`}
    >
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${style.text}`}>
        {label}
      </div>
      <div className="text-sm text-text leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}

export function TranscriptContent({ lines }: { lines: TranscriptLine[] }) {
  return (
    <div className="space-y-2 font-sans">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-[10px] text-textMuted mt-1 w-12 shrink-0 font-mono">[{line.timestamp}]</span>
          <p className="text-xs">
            <span className={line.role === "caller" ? "text-secondary font-bold" : "text-danger font-bold"}>
              {line.role === "caller" ? "主叫" : "被叫"}
            </span>
            <span className="text-textSecondary opacity-80">: {line.text}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export function DataContent({ items }: { items: string[] }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-textSecondary font-sans">
          <div className="w-1 h-1 bg-warning rounded-full" />
          {item}
        </div>
      ))}
    </div>
  );
}

export function ReasoningContent({ text, probability }: { text: string; probability?: number }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-textMuted italic font-sans leading-relaxed">
        {text}
      </div>
      {probability !== undefined && (
        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${probability}%` }}
              transition={{ duration: 1.5 }}
              className={`h-full ${probability > 80 ? 'bg-danger' : probability > 50 ? 'bg-warning' : 'bg-success'}`}
            />
          </div>
          <span className={`text-[10px] font-mono font-bold ${probability > 80 ? 'text-danger' : 'text-primary'}`}>
            PROBABILITY: {probability}%
          </span>
        </div>
      )}
    </div>
  );
}

export function StrategyContent({ text }: { text: string }) {
  return (
    <div className="text-xs text-secondary font-bold font-sans">
      {text}
    </div>
  );
}
