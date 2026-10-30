import React, { useState } from 'react';
import {
  Video,
  Cpu,
  CloudSun,
  HardDrive,
  RefreshCw,
  Zap,
  Activity,
  Maximize2,
  Moon,
  Camera,
  Sliders,
  Gauge,
  Wind,
  Droplets,
  Radio,
  Eye,
} from 'lucide-react';
import { SystemMetrics, CctvCamera } from '../types/launcher';
import { soundFx } from '../utils/audioFeedback';

interface WidgetsSectionProps {
  metrics: SystemMetrics;
  onBoostRam: () => void;
  isBoostingRam: boolean;
  onOpenSpeedTest: () => void;
  cameras: CctvCamera[];
  onOpenCctvFullscreen: (cam: CctvCamera) => void;
  onTogglePipCctv: () => void;
  isPipActive: boolean;
}

export const WidgetsSection: React.FC<WidgetsSectionProps> = ({
  metrics,
  onBoostRam,
  isBoostingRam,
  onOpenSpeedTest,
  cameras,
  onOpenCctvFullscreen,
  onTogglePipCctv,
  isPipActive,
}) => {
  const [selectedCamIndex, setSelectedCamIndex] = useState<number>(0);
  const [isNightVision, setIsNightVision] = useState<boolean>(false);
  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);

  const currentCam = cameras[selectedCamIndex] || cameras[0];

  const handleCaptureSnapshot = () => {
    soundFx.playSelectChime();
    setLastSnapshot(new Date().toLocaleTimeString());
    setTimeout(() => setLastSnapshot(null), 3000);
  };

  const handleToggleNightVision = () => {
    soundFx.playNavTick();
    setIsNightVision(!isNightVision);
  };

  return (
    <section className="w-full mb-12 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Widgets & Smart Metrics</span>
          </h2>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span className="text-xs text-amber-400 font-mono font-semibold tracking-wider">
            VIP ELITE SUITE
          </span>
        </div>
      </div>

      {/* 3 Main Dynamic Live Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ========================================================= */}
        {/* WIDGET 1: 📹 CCTV Camera View (RTSP / ONVIF Smart Home) */}
        {/* ========================================================= */}
        <div className="group relative rounded-3xl p-5 glass-panel-elevated overflow-hidden flex flex-col justify-between border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Video className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide">
                  Live CCTV Camera
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  RTSP/ONVIF · {currentCam.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                LIVE
              </span>
              <button
                onClick={() => {
                  soundFx.playSelectChime();
                  onOpenCctvFullscreen(currentCam);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                title="Fullscreen CCTV"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Camera Video Viewport */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 bg-black/60 mb-3 shadow-inner">
            <img
              src={currentCam.imageUrl}
              alt={currentCam.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-500 ${
                isNightVision ? 'filter grayscale invert contrast-125' : ''
              }`}
            />

            {/* CCTV Scanlines & Ambient Noise */}
            <div className="absolute inset-0 cctv-scanline pointer-events-none" />

            {/* OSD (On-Screen Display) Info */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>REC 4K · 30 FPS</span>
            </div>

            <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-white/80">
              {currentCam.name}
            </div>

            {/* Motion Detection Overlay Bounding Box */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>AI Motion: Perimeter Safe</span>
            </div>

            {lastSnapshot && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-xs text-xs font-mono text-emerald-400">
                ✓ Snapshot Saved ({lastSnapshot})
              </div>
            )}
          </div>

          {/* Camera Controls & Switcher */}
          <div className="flex items-center justify-between text-xs z-10">
            {/* Camera Selector Dropdown */}
            <select
              value={selectedCamIndex}
              onChange={(e) => {
                soundFx.playNavTick();
                setSelectedCamIndex(Number(e.target.value));
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
            >
              {cameras.map((c, i) => (
                <option key={c.id} value={i} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>

            {/* Action Tools */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleNightVision}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isNightVision
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title="Toggle Infrared Night Vision"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCaptureSnapshot}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
                title="Snapshot Frame"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  soundFx.playSelectChime();
                  onTogglePipCctv();
                }}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  isPipActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title="Picture-in-Picture Mini View"
              >
                {isPipActive ? 'Close PiP' : 'PiP View'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* WIDGET 2: 🚀 System Performance & RAM Booster */}
        {/* ========================================================= */}
        <div className="group relative rounded-3xl p-5 glass-panel-elevated overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-400/50 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide">
                  System Optimizer & RAM
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Real-time STB Telemetry
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playSelectChime();
                onOpenSpeedTest();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-cyan-300 transition-colors cursor-pointer"
            >
              <Gauge className="w-3 h-3" />
              <span>Speed Test</span>
            </button>
          </div>

          {/* Metrics Displays */}
          <div className="space-y-3 my-auto">
            {/* RAM Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Memory (RAM)</span>
                <span className="font-mono text-amber-300 font-bold">
                  {metrics.ramUsedGb.toFixed(2)} GB / {metrics.ramTotalGb} GB (
                  {metrics.ramUsagePercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    metrics.ramUsagePercent > 75
                      ? 'bg-rose-500'
                      : metrics.ramUsagePercent > 50
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${metrics.ramUsagePercent}%` }}
                />
              </div>
            </div>

            {/* CPU & Thermal Status */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400">CPU Temperature</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-bold font-mono text-white">
                    {metrics.cpuTemp}°C
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Optimal</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[10px] text-slate-400">Internal Storage</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-bold font-mono text-white">
                    {metrics.storageUsedGb}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">/ 128 GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* One-Click RAM Cleaner & Booster CTA */}
          <button
            onClick={() => {
              soundFx.playRamBoostPulse();
              onBoostRam();
            }}
            disabled={isBoostingRam}
            className="w-full mt-3 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-75"
          >
            <Zap className={`w-4 h-4 fill-current ${isBoostingRam ? 'animate-spin' : ''}`} />
            <span>
              {isBoostingRam ? 'Purging Cache & Boosting STB...' : '⚡ One-Click RAM Cleaner & Boost'}
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* WIDGET 3: ☁️ Live Weather 3D & Atmosphere */}
        {/* ========================================================= */}
        <div className="group relative rounded-3xl p-5 glass-panel-elevated overflow-hidden flex flex-col justify-between border border-white/10 hover:border-violet-500/50 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <CloudSun className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide">
                  Live Weather 3D
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Jakarta Metropole · Radar
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-violet-300 px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 font-semibold">
              AQI 32 · GOOD
            </span>
          </div>

          {/* Big Temperature Hero */}
          <div className="flex items-center justify-between my-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-white tracking-tighter">
                  28°
                </span>
                <span className="text-lg text-amber-400 font-bold">C</span>
              </div>
              <span className="text-xs text-slate-300 font-medium">Partly Cloudy</span>
            </div>

            {/* 3D Sun Cloud Graphic */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/30 border border-white/10 flex items-center justify-center shadow-inner">
              <CloudSun className="w-10 h-10 text-amber-400 animate-bounce duration-1000" />
            </div>
          </div>

          {/* Micro Weather Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400">Humidity</span>
                <span className="font-mono text-[11px] font-bold text-white">65%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <Wind className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400">Wind Velocity</span>
                <span className="font-mono text-[11px] font-bold text-white">12 km/h</span>
              </div>
            </div>
          </div>

          {/* 4-Day Horizontal Forecast Strip */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-center text-[10px]">
            <div>
              <span className="text-slate-400 font-mono block">FRI</span>
              <span className="text-white font-bold block mt-0.5">29°</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono block">SAT</span>
              <span className="text-white font-bold block mt-0.5">27°</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono block">SUN</span>
              <span className="text-white font-bold block mt-0.5">30°</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono block">MON</span>
              <span className="text-white font-bold block mt-0.5">28°</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
