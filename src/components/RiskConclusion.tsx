
import { RiskLevel } from "../types";
import { motion } from "motion/react";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface RiskConclusionProps {
  riskLevel: RiskLevel | null;
  callId: string;
  categoryLabel: string;
  fraudProbability: number;
  onViewResult: () => void;
}

const styles = {
  [RiskLevel.LOW]: { bg: "bg-success/10", text: "text-success", border: "border-success/30", icon: ShieldCheck, label: "低风险" },
  [RiskLevel.MEDIUM]: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", icon: ShieldAlert, label: "中风险" },
  [RiskLevel.HIGH]: { bg: "bg-danger/10", text: "text-danger", border: "border-danger/30", icon: ShieldX, label: "高风险" },
};

export default function RiskConclusion({
  riskLevel,
  callId,
  categoryLabel,
  fraudProbability,
  onViewResult,
}: RiskConclusionProps) {
  if (!riskLevel) return null;

  const style = styles[riskLevel];
  const Icon = style.icon;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 px-8 py-3 bg-panel/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between shadow-2xl"
    >
      <div className="flex items-center gap-6">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${style.border} ${style.bg}`}>
          <Icon size={16} className={style.text} />
          <span className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
            {style.label}
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono tracking-tighter">
          <div className="flex flex-col">
            <span className="text-textMuted uppercase opacity-40">Call ID</span>
            <span className="text-textSecondary">{callId}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-textMuted uppercase opacity-40">Category</span>
            <span className="text-textSecondary">{categoryLabel}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-textMuted uppercase opacity-40">Fraud Prob</span>
              <span className={`font-bold ${fraudProbability > 80 ? 'text-danger' : 'text-primary'}`}>
                {fraudProbability}%
              </span>
            </div>
            <div className="relative w-8 h-8">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-white/10 stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className={`${fraudProbability > 80 ? 'text-danger' : 'text-primary'} stroke-current`}
                  strokeWidth="3"
                  strokeDasharray={`${fraudProbability}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${fraudProbability}, 100` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onViewResult}
        className="flex items-center justify-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl px-6 py-3 text-xs font-bold uppercase transition-all active:scale-95 min-h-[44px] cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.35)]"
      >
        查看完整结果 REPORT
      </button>
    </motion.div>
  );
}
