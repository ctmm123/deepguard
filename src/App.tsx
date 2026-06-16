
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Search, Play } from "lucide-react";
import MochiRobot from "./components/MochiRobot";
import Header from "./components/Header";
import ThinkingOutput from "./components/ThinkingOutput";
import RiskConclusion from "./components/RiskConclusion";
import ResultModal from "./components/ResultModal";
import { useAnalysis } from "./hooks/useAnalysis";
import { AppStatus, RiskLevel } from "./types";

export default function App() {
  const {
    phase,
    mood,
    statusText,
    steps,
    result,
    showModal,
    setShowModal,
    startAnalysis,
    reset,
  } = useAnalysis();

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (input: string) => {
    reset();
    startAnalysis(input);
  };

  const handleAnalyze = () => {
    let targetId = inputValue.trim();
    if (!targetId) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      targetId = randNum.toString();
    }
    handleSubmit(targetId);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-text overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel: Robot UI (35%) */}
        <section className="w-[35%] bg-panel/50 border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#0ea5e9]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#6c7ae0]/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            <MochiRobot status={phase} riskLevel={result?.risk.level} mood={mood} />
            
            <div className="mt-12 text-center space-y-4 w-full flex flex-col items-center">
              <p className="text-[#9ca3af] text-sm font-medium italic min-h-[3rem] animate-pulse">
                {statusText}
              </p>
              
              {phase === AppStatus.IDLE && (
                <div className="pt-8 border-t border-white/5 space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="bg-background border border-white/5 rounded-xl pl-12 pr-4 py-3 text-text text-sm w-full outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all shadow-inner font-sans min-h-[44px]"
                      placeholder="输入 Call ID (例如 1, 2)..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAnalyze();
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl py-3 text-xs font-bold uppercase transition-all active:scale-95 min-h-[44px] cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.35)]"
                  >
                    <Play size={14} className="fill-white" />
                    <span>开始分析</span>
                  </button>
                </div>
              )}
              
              {phase === AppStatus.RESULT && (
                <button 
                  onClick={reset}
                  className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-[#9ca3af] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                >
                  Restart Analysis
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right Panel: Analysis Stream (65%) */}
        <section className="flex-1 bg-background relative flex flex-col">
          <ThinkingOutput steps={steps} result={result} />
        </section>
      </main>

      {/* Result Bottom Bar */}
      {phase === AppStatus.RESULT && (
        <RiskConclusion
          riskLevel={result?.risk.level || null}
          callId={result?.callId || ""}
          categoryLabel={result?.category.label || ""}
          fraudProbability={result?.fraud.probability || 0}
          onViewResult={() => setShowModal(true)}
        />
      )}

      {/* Results Detail Modal */}
      <AnimatePresence>
        {showModal && result && (
          <ResultModal result={result} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
