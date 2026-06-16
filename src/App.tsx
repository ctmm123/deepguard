
import { AnimatePresence } from "motion/react";
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

  const handleSubmit = (input: string) => {
    reset();
    startAnalysis(input);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-text overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
      <Header onSubmit={handleSubmit} />

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
            
            <div className="mt-12 text-center space-y-4">
              <p className="text-[#9ca3af] text-sm font-medium italic min-h-[3rem] animate-pulse">
                {statusText}
              </p>
              
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
