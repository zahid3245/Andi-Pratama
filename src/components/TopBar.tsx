import React, { useState, useEffect } from 'react';
import { Wifi, ShieldCheck, Sun, Sliders, Smartphone, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { UserProfile, SystemMetrics } from '../types/launcher';
import { soundFx } from '../utils/audioFeedback';

interface TopBarProps {
  activeProfile: UserProfile;
  metrics: SystemMetrics;
  onOpenProfiles: () => void;
  onOpenStudio: () => void;
  onOpenSpeedTest: () => void;
  onToggleRemote: () => void;
  isRemoteOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeProfile,
  metrics,
  onOpenProfiles,
  onOpenStudio,
  onOpenSpeedTest,
  onToggleRemote,
  isRemoteOpen,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) {
      soundFx.playNavTick();
    }
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-6 lg:px-12 py-3.5 glass-panel border-b border-white/10 select-none">
      {/* Brand + VIP Badge */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-lg lg:text-xl text-white">
              AURA<span className="text-cyan-400">TV</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold text-amber-400">
              <span className="animate-shimmer font-bold">VIP ELITE EDITION</span>
              <span className="text-white/30">·</span>
              <span className="text-slate-400">STB 8K</span>
            </div>
          </div>
        </div>

        {/* Profile Switcher Trigger */}
        <button
          onClick={() => {
            soundFx.playSelectChime();
            onOpenProfiles();
          }}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-amber-400/80 group cursor-pointer"
          title="Switch User Profile"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs shadow-inner">
            {activeProfile.avatar}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
              {activeProfile.name}
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono tracking-wide">
              {activeProfile.badge}
            </span>
          </div>
        </button>
      </div>

      {/* Center Zone: Quick Studio, Sound, Remote triggers */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => {
            soundFx.playSelectChime();
            onOpenStudio();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-cyan-400/70"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Aesthetic Studio</span>
        </button>

        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-md text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-cyan-400/70"
          title={isMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </button>

        <button
          onClick={() => {
            soundFx.playSelectChime();
            onToggleRemote();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
            isRemoteOpen
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-md shadow-cyan-500/30'
              : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
          }`}
          title="Toggle D-Pad Remote"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Remote D-Pad</span>
        </button>
      </div>

      {/* Right Zone: System Metrics Minimalis (Jam, Cuaca 3D, Koneksi 4K) */}
      <div className="flex items-center gap-3 lg:gap-5 text-slate-300">
        {/* Live Weather */}
        <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="text-white font-mono font-semibold">28°C</span>
          <span className="text-white/40 hidden lg:inline">·</span>
          <span className="text-slate-400 hidden lg:inline">Partly Cloudy</span>
        </div>

        {/* Network & 4K Stream Status */}
        <button
          onClick={() => {
            soundFx.playSelectChime();
            onOpenSpeedTest();
          }}
          className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors cursor-pointer group"
          title="Open Network Speed Test"
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-emerald-300 font-semibold">
            {metrics.downloadSpeedMbps} Mbps
          </span>
          <span className="text-white/40 hidden sm:inline">·</span>
          <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-wider hidden sm:inline">
            4K HDR
          </span>
        </button>

        {/* Live Clock */}
        <div className="flex items-center gap-2 pl-1 border-l border-white/10">
          <div className="flex flex-col text-right">
            <span className="text-sm lg:text-base font-bold font-mono tracking-tight text-white tabular-nums">
              {time || '20:45:00'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {dateStr || 'Thu, Oct 29'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
