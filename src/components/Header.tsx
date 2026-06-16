
import logo from "../logo.svg";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-panel border-b border-white/5 relative z-50">
      <div className="flex items-center gap-3">
        <img src={logo} className="w-10 h-10 object-contain filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.35)]" alt="DEEPGUARD Logo" />
        <div className="flex flex-col h-10 justify-between py-0.5">
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
    </header>
  );
}
