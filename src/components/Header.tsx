
import React, { useState } from "react";
import { Upload, Search } from "lucide-react";
import logo from "../logo.svg";

interface HeaderProps {
  onSubmit: (input: string) => void;
}

export default function Header({ onSubmit }: HeaderProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (trimmed) onSubmit(trimmed);
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-panel border-b border-white/5 relative z-50">
      <div className="flex items-center gap-3">
        <img src={logo} className="w-10 h-10 object-contain filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.35)]" alt="DEEPGUARD Logo" />
        <div className="flex flex-col">
          <h1 
            className="text-2xl font-black tracking-wider leading-none"
            style={{
              background: 'linear-gradient(90deg, #0ea5e9 0%, #1d4ed8 45%, #0b3fa8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            DEEPGUARD
          </h1>
          <span className="text-[9px] text-primary font-bold tracking-[0.18em] uppercase opacity-70">
            Deep Perception · Guard Every Call
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex items-center gap-2 group">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={16} />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-background border border-white/5 rounded-xl pl-12 pr-4 py-3 text-text text-sm w-64 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all shadow-inner font-sans min-h-[44px]"
              placeholder="输入 Call ID (例如 1, 2)..."
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            onClick={() => {
              const trimmed = value.trim();
              if (trimmed) onSubmit(trimmed);
            }}
            className="px-4 py-3 bg-primary/20 text-primary hover:bg-primary/30 active:scale-95 transition-all rounded-xl text-xs font-bold uppercase tracking-wider min-h-[44px] border border-primary/30 cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.1)] flex items-center"
          >
            开始演示
          </button>
        </div>
        
        <button className="flex items-center gap-2 bg-background border border-dashed border-white/10 rounded-xl px-5 py-3 text-textMuted text-xs font-bold uppercase transition-all hover:border-primary/50 hover:text-primary min-h-[44px]">
          <Upload size={14} />
          <span>Upload Audio</span>
        </button>
      </div>
    </header>
  );
}
