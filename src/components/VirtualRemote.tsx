import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  X,
  Tv,
  HelpCircle,
} from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface VirtualRemoteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
}

export const VirtualRemote: React.FC<VirtualRemoteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelect,
  onBack,
  onHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-3xl p-5 bg-[#0f141f]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-slate-200 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Remote Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            AURA IR Remote
          </span>
        </div>
        <button
          onClick={() => {
            soundFx.playBackChime();
            onClose();
          }}
          className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Remote Actions */}
      <div className="flex items-center justify-around mb-5">
        <button
          onClick={() => {
            soundFx.playBackChime();
            onBack();
          }}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-1 active:scale-95 transition-transform cursor-pointer"
          title="Back (Esc / Backspace)"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
          <span className="text-[9px] font-mono">BACK</span>
        </button>

        <button
          onClick={() => {
            soundFx.playSelectChime();
            onHome();
          }}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-1 active:scale-95 transition-transform cursor-pointer"
          title="Home Screen"
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-mono">HOME</span>
        </button>
      </div>

      {/* D-Pad Circle Controller */}
      <div className="relative w-44 h-44 mx-auto my-2 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-white/15 p-2 shadow-inner flex items-center justify-center">
        {/* Up Button */}
        <button
          onClick={() => {
            soundFx.playNavTick();
            onNavigate('up');
          }}
          className="absolute top-2 w-12 h-10 flex items-center justify-center rounded-t-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          title="Up Arrow"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* Down Button */}
        <button
          onClick={() => {
            soundFx.playNavTick();
            onNavigate('down');
          }}
          className="absolute bottom-2 w-12 h-10 flex items-center justify-center rounded-b-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          title="Down Arrow"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* Left Button */}
        <button
          onClick={() => {
            soundFx.playNavTick();
            onNavigate('left');
          }}
          className="absolute left-2 w-10 h-12 flex items-center justify-center rounded-l-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          title="Left Arrow"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Button */}
        <button
          onClick={() => {
            soundFx.playNavTick();
            onNavigate('right');
          }}
          className="absolute right-2 w-10 h-12 flex items-center justify-center rounded-r-xl hover:bg-cyan-500/20 active:bg-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          title="Right Arrow"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* OK / Select Center Button */}
        <button
          onClick={() => {
            soundFx.playSelectChime();
            onSelect();
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-90 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center transition-all cursor-pointer border border-white/20"
          title="OK / Select (Enter)"
        >
          OK
        </button>
      </div>

      {/* Keyboard Shortcut Hints */}
      <div className="mt-4 pt-3 border-t border-white/10 text-center text-[10px] text-slate-400 space-y-1">
        <p className="font-mono text-cyan-300">
          Keyboard Support Active
        </p>
        <p className="text-white/60">
          <kbd className="px-1 py-0.5 bg-white/10 rounded">Arrow Keys</kbd> Navigate ·{' '}
          <kbd className="px-1 py-0.5 bg-white/10 rounded">Enter</kbd> OK ·{' '}
          <kbd className="px-1 py-0.5 bg-white/10 rounded">Esc</kbd> Back
        </p>
      </div>
    </div>
  );
};
