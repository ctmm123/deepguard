
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResult, RiskLevel } from "../types";
import { X, ShieldCheck, ShieldAlert, ShieldX, Info } from "lucide-react";

interface ResultModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

const riskStyles = {
  [RiskLevel.LOW]: { text: "text-success", bg: "bg-success", badge: "bg-success/20", icon: ShieldCheck, label: "低风险" },
  [RiskLevel.MEDIUM]: { text: "text-warning", bg: "bg-warning", badge: "bg-warning/20", icon: ShieldAlert, label: "中风险" },
  [RiskLevel.HIGH]: { text: "text-danger", bg: "bg-danger", badge: "bg-danger/20", icon: ShieldX, label: "高风险" },
};

export default function ResultModal({ result, onClose }: ResultModalProps) {
  const [toast, setToast] = useState<string | null>(null);
  const style = riskStyles[result.risk.level];
  const Icon = style.icon;

  const handleAction = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-panel border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Left Side: Transcript Mirror */}
        <div className="w-full md:w-5/12 p-8 border-b md:border-b-0 md:border-r border-white/5 bg-[#040915] flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-textMuted uppercase tracking-widest font-mono">
                 <span className="text-primary">文本透视</span>
                 <span>TRANSPARENT TEXT</span>
              </div>
           </div>
           
           <div className="flex-1 space-y-4 font-sans text-xs leading-relaxed text-textSecondary overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
              {result.transcript.map((line, i) => (
                <div key={i} className="group">
                  <p className="opacity-40 mb-1 text-[10px] font-mono">[{line.timestamp}]</p>
                  <p>
                    <span className={line.role === "caller" ? "text-secondary font-bold" : "text-danger font-bold"}>
                      {line.role === "caller" ? "CALLER" : "CALLEE"}
                    </span>
                    <span className="opacity-70">: {line.text}</span>
                  </p>
                </div>
              ))}
           </div>

           <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-textMuted">
              <span className="uppercase opacity-40">Call Hash</span>
              <span>{btoa(result.callId).substring(0, 16)}...</span>
           </div>
        </div>

        {/* Right Side: Analysis Report */}
        <div className="flex-1 p-8 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
             <div>
                <h2 id="modal-title" className="text-2xl font-bold text-text tracking-tight mb-1">风险判定报告</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-textMuted tracking-widest uppercase">ID: {result.callId}</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-[10px] font-mono text-textMuted tracking-widest uppercase">{new Date().toLocaleDateString()}</span>
                </div>
             </div>
             <button 
               onClick={onClose}
               className="p-2 text-textMuted hover:text-text transition-colors"
             >
               <X size={20} />
             </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-4 bg-background/50 rounded-xl border border-white/5 group hover:border-primary/20 transition-colors flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-[10px] uppercase text-textMuted mb-2 tracking-widest flex items-center gap-1.5">
                     <Info size={10} className="text-primary" />
                     业务类目
                  </div>
                  <span className="text-lg font-bold text-text tracking-tight">{result.category.label}</span>
                </div>
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="text-white/5 stroke-current" strokeWidth="2" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="text-success stroke-current"
                      strokeWidth="2"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - result.category.confidence }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-success">
                    {result.category.confidence}%
                  </div>
                </div>
             </div>
             <div className={`p-4 rounded-xl border ${style.badge} ${style.bg}/5 group hover:border-${style.bg}/30 transition-colors flex justify-between items-center`}>
                <div className="flex flex-col">
                  <div className="text-[10px] uppercase text-textMuted mb-2 tracking-widest flex items-center gap-1.5">
                     <Icon size={10} className={style.text} />
                     风险评估
                  </div>
                  <span className={`text-lg font-black tracking-tight ${style.text}`}>{style.label}</span>
                </div>
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="text-white/5 stroke-current" strokeWidth="2" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className={`${style.text} stroke-current`}
                      strokeWidth="2"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - result.risk.confidence }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-80 ${style.text}`}>
                    {result.risk.confidence}%
                  </div>
                </div>
             </div>
          </div>

          <div className="p-6 bg-background/50 rounded-xl border border-white/5 flex-1 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase text-textMuted tracking-widest">智能处置策略</span>
                <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${result.strategy.confidence > 80 ? 'bg-success text-background' : 'bg-warning text-background'}`}>
                   {result.strategy.confidence > 80 ? 'AUTO ENFORCED' : 'MANUAL REVIEW REQ'}
                </div>
             </div>
             <p className="text-sm text-textSecondary leading-relaxed italic mb-8">
                "{result.strategy.reasoning}"
             </p>
             
             <div className="grid grid-cols-3 gap-3 mt-auto">
                <button 
                  onClick={() => handleAction("操作成功：已忽略此分析报告")}
                  className="px-4 py-2.5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                   忽略
                </button>
                <button 
                  onClick={() => handleAction("操作成功：该号码已加入风险黑名单")}
                  className="px-4 py-2.5 border border-danger/30 bg-danger/10 text-danger rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-danger/20 transition-all"
                >
                   黑名单
                </button>
                <button 
                  onClick={() => handleAction("操作成功：自动处置策略已确认执行")}
                  className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.35)] cursor-pointer"
                >
                   确认策略
                </button>
             </div>
          </div>
        </div>

        {/* 自定义微光 Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 bg-[#0c1527]/95 backdrop-blur-md border border-[#38bdf8]/30 text-[#dde6ff] rounded-xl text-xs font-bold tracking-wider shadow-[0_0_30px_rgba(56,189,248,0.25)] flex items-center gap-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
