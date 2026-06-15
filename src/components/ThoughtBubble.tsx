
import { motion } from "motion/react";

export default function ThoughtBubble({ text }: { text: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
        <div className="w-4 h-4 text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>
      <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-textSecondary text-sm italic font-sans shadow-lg max-w-[85%]">
        {text}
      </div>
    </motion.div>
  );
}
