import { motion, AnimatePresence } from "motion/react";
import { AppStatus, RiskLevel, Mood } from "../types";
import { Mic, ShieldCheck, AlertTriangle, ShieldAlert, Activity } from "lucide-react";
import { useMemo } from "react";

interface MochiRobotProps {
  status: AppStatus;
  riskLevel?: RiskLevel | null;
  mood?: Mood;
}

export default function MochiRobot({ status, riskLevel, mood = "thinking" }: MochiRobotProps) {
  const stateConfig = useMemo(() => {
    // If not idle and not result, it's analyzing
    if (status !== AppStatus.IDLE && status !== AppStatus.RESULT) {
      return {
        id: 'analyzing',
        primary: "#8b5cf6", // purple
        secondary: "#22d3ee", // cyan
        glow: "rgba(139, 92, 246, 0.6)",
        icon: Activity,
        label: 'SYSTEM: ANALYZING',
        animationSpeed: 2
      };
    }

    if (status === AppStatus.RESULT) {
      switch (riskLevel) {
        case RiskLevel.LOW: 
          return {
            id: 'safe',
            primary: "#10b981", // emerald
            secondary: "#34d399",
            glow: "rgba(16, 185, 129, 0.4)",
            icon: ShieldCheck,
            label: 'VERIFIED: SAFE',
            animationSpeed: 8
          };
        case RiskLevel.MEDIUM: 
          return {
            id: 'anomaly',
            primary: "#f59e0b", // amber
            secondary: "#fbbf24",
            glow: "rgba(245, 158, 11, 0.4)",
            icon: AlertTriangle,
            label: 'WATCH: ANOMALY',
            animationSpeed: 4
          };
        case RiskLevel.HIGH: 
          return {
            id: 'critical',
            primary: "#ef4444", // red
            secondary: "#f87171",
            glow: "rgba(239, 68, 68, 0.6)",
            icon: ShieldAlert,
            label: 'ALARM: CRITICAL RISK',
            animationSpeed: 1.5
          };
        default: 
          return {
            id: 'safe',
            primary: "#10b981",
            secondary: "#34d399",
            glow: "rgba(16, 185, 129, 0.4)",
            icon: ShieldCheck,
            label: 'VERIFIED: SAFE',
            animationSpeed: 8
          };
      }
    }

    return {
      id: 'idle',
      primary: "#0ea5e9", // sky blue
      secondary: "#38bdf8",
      glow: "rgba(14, 165, 233, 0.4)",
      icon: Mic,
      label: 'PIPELINE: IDLE',
      animationSpeed: 12
    };
  }, [status, riskLevel]);

  const Icon = stateConfig.icon;

  // Generate 3D Particle Spheres
  const { particles, innerParticles } = useMemo(() => {
    const createSphere = (N: number, R: number) => {
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
      return Array.from({ length: N }).map((_, i) => {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
        return {
          x: Math.cos(theta) * r * R,
          y: y * R,
          z: Math.sin(theta) * r * R,
          size: 0.6 + Math.random() * 1.2,
          opacity: 0.3 + Math.random() * 0.7,
        };
      });
    };

    return {
      particles: createSphere(400, 120), // Increased count for finer particles
      innerParticles: createSphere(150, 80), 
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-64 h-64 flex items-center justify-center"
      >
        {/* Core deep glow */}
        <motion.div 
          className="absolute inset-0 rounded-full blur-[50px] opacity-40 mix-blend-screen transition-colors duration-1000"
          style={{ backgroundColor: stateConfig.primary }}
        />

        {/* 3D Particle Spheres */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ perspective: '1000px' }}>
          
          {/* Outer Particle Shell */}
          <motion.div 
            className="absolute w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
            transition={{ duration: stateConfig.animationSpeed * 10, repeat: Infinity, ease: "linear" }}
          >
            {particles.map((p, i) => (
              <div
                key={`outer-${i}`}
                className="absolute rounded-full transition-colors duration-1000"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
                  backgroundColor: stateConfig.secondary,
                  boxShadow: `0 0 ${p.size * 2}px ${stateConfig.primary}`,
                  opacity: p.opacity,
                }}
              />
            ))}
          </motion.div>

          {/* Inner Particle Core (Swirling in opposite/different direction) */}
          <motion.div 
            className="absolute w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateX: [360, 0], rotateY: [0, 360], rotateZ: [0, 180] }}
            transition={{ duration: stateConfig.animationSpeed * 6, repeat: Infinity, ease: "linear" }}
          >
            {innerParticles.map((p, i) => (
              <div
                key={`inner-${i}`}
                className="absolute rounded-full transition-colors duration-1000"
                style={{
                  width: `${p.size * 1.2}px`,
                  height: `${p.size * 1.2}px`,
                  transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
                  backgroundColor: '#ffffff',
                  boxShadow: `0 0 ${p.size * 3}px ${stateConfig.primary}`,
                  opacity: p.opacity * 0.9,
                }}
              />
            ))}
          </motion.div>

        </div>

        {/* Center Microphone / Icon Node */}
        <div className="absolute z-20 w-16 h-16 rounded-full bg-[#0a0e1a]/80 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
           <AnimatePresence mode="wait">
             <motion.div
               key={stateConfig.id}
               initial={{ scale: 0, opacity: 0, rotate: -90 }}
               animate={{ scale: 1, opacity: 1, rotate: 0 }}
               exit={{ scale: 0, opacity: 0, rotate: 90 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
             >
                <Icon size={24} color={stateConfig.primary} className={stateConfig.id === 'analyzing' ? 'animate-pulse' : ''} />
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Sound waves pulsing from center when analyzing */}
        {stateConfig.id === 'analyzing' && (
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute rounded-full border border-white/20"
                style={{ borderColor: stateConfig.primary }}
                initial={{ width: '4rem', height: '4rem', opacity: 0.8 }}
                animate={{ width: '16rem', height: '16rem', opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

      </motion.div>

      {/* Modern Status Tag */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stateConfig.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-10 px-5 py-2 border rounded-full text-xs font-mono font-bold uppercase tracking-[0.15em] backdrop-blur-md"
          style={{
            borderColor: `${stateConfig.primary}40`,
            backgroundColor: `${stateConfig.primary}10`,
            color: stateConfig.primary,
            boxShadow: `0 0 20px ${stateConfig.glow}`
          }}
        >
          <div className="flex items-center gap-2">
            {stateConfig.id === 'analyzing' && (
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: stateConfig.primary }}></span>
                 <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: stateConfig.primary }}></span>
               </span>
            )}
            {stateConfig.label}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
