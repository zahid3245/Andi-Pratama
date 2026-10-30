import React from 'react';
import { Sliders, Image, Sparkles, Check, X, Shield, Eye } from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface WallpaperOption {
  id: string;
  name: string;
  type: 'Sci-Fi Deep Space' | 'Nordic Fjords 8K' | 'Neo Tokyo Cyber' | 'Abstract Obsidian';
  url: string;
  accent: string;
}

interface WallpaperStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWallpaperUrl: string;
  onChangeWallpaper: (url: string) => void;
  blurIntensity: number;
  onChangeBlur: (val: number) => void;
  frostedOpacity: number;
  onChangeOpacity: (val: number) => void;
  screensaverMinutes: number;
  onChangeScreensaverMinutes: (minutes: number) => void;
}

export const WALLPAPER_PRESETS: WallpaperOption[] = [
  {
    id: 'scifi',
    name: 'Chronos Interstellar 8K',
    type: 'Sci-Fi Deep Space',
    url: '/src/assets/images/hero_cinematic_scifi_1793316888522.jpg',
    accent: '#00E5FF',
  },
  {
    id: 'nordic',
    name: 'Nordic Fjord Twilight',
    type: 'Nordic Fjords 8K',
    url: '/src/assets/images/hero_nature_aerial_1793316888747.jpg',
    accent: '#F59E0B',
  },
  {
    id: 'tokyo',
    name: 'Neo-Tokyo Midnight Rain',
    type: 'Neo Tokyo Cyber',
    url: '/src/assets/images/hero_action_thriller_1793316889418.jpg',
    accent: '#FF2A6D',
  },
];

export const WallpaperStudioModal: React.FC<WallpaperStudioModalProps> = ({
  isOpen,
  onClose,
  activeWallpaperUrl,
  onChangeWallpaper,
  blurIntensity,
  onChangeBlur,
  frostedOpacity,
  onChangeOpacity,
  screensaverMinutes,
  onChangeScreensaverMinutes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 select-none">
      <div className="w-full max-w-2xl rounded-3xl p-6 lg:p-8 glass-panel-elevated border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-white">
                VIP Aesthetic & Glassmorphic Studio
              </h2>
              <p className="text-xs text-slate-400">
                Kustomisasi wallpaper dinamis 8K, intensitas frosted glass, dan screensaver Apple TV style.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playBackChime();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallpaper Gallery Selection */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider">
            1. Dynamic 8K Cinematic Wallpapers
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WALLPAPER_PRESETS.map((wp) => {
              const isSelected = activeWallpaperUrl === wp.url;
              return (
                <div
                  key={wp.id}
                  onClick={() => {
                    soundFx.playSelectChime();
                    onChangeWallpaper(wp.url);
                  }}
                  className={`group relative h-28 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={wp.url}
                    alt={wp.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2.5 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white leading-tight">
                      {wp.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{wp.type}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sliders: Blur & Opacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">Frosted Glass Blur</span>
              <span className="font-mono text-cyan-400 font-bold">{blurIntensity}px</span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              value={blurIntensity}
              onChange={(e) => {
                soundFx.playNavTick();
                onChangeBlur(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-white/20 rounded cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400 block mt-2">
              Mengontrol kelembutan latar belakang transparan panel.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">Panel Opacity</span>
              <span className="font-mono text-amber-400 font-bold">{frostedOpacity}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              value={frostedOpacity}
              onChange={(e) => {
                soundFx.playNavTick();
                onChangeOpacity(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-white/20 rounded cursor-pointer accent-amber-400"
            />
            <span className="text-[10px] text-slate-400 block mt-2">
              Transparansi permukaan kartu aplikasi dan status bar.
            </span>
          </div>
        </div>

        {/* Aerial Screensaver Timer */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">
              Apple TV Style Aerial Screensaver
            </span>
            <span className="text-[11px] text-slate-400 block">
              Mulai screensaver 8K saat remote D-Pad tidak aktif
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 5, 15].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  soundFx.playSelectChime();
                  onChangeScreensaverMinutes(mins);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  screensaverMinutes === mins
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
