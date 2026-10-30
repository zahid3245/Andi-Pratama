import React, { useState } from 'react';
import {
  CctvCamera,
} from '../types/launcher';
import {
  X,
  Camera,
  Moon,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
} from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface CctvFullscreenModalProps {
  camera: CctvCamera | null;
  cameras: CctvCamera[];
  onSelectCamera: (cam: CctvCamera) => void;
  onClose: () => void;
  onMinimizeToPip: () => void;
}

export const CctvFullscreenModal: React.FC<CctvFullscreenModalProps> = ({
  camera,
  cameras,
  onSelectCamera,
  onClose,
  onMinimizeToPip,
}) => {
  const [isNightVision, setIsNightVision] = useState<boolean>(camera?.isNightVision ?? false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isAudioLive, setIsAudioLive] = useState<boolean>(false);
  const [sirenActive, setSirenActive] = useState<boolean>(false);
  const [snapshotMsg, setSnapshotMsg] = useState<string | null>(null);

  if (!camera) return null;

  const handleSnapshot = () => {
    soundFx.playSelectChime();
    setSnapshotMsg(`Saved to STB Gallery at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setSnapshotMsg(null), 3000);
  };

  const handleTriggerSiren = () => {
    soundFx.playErrorBuzz();
    setSirenActive(true);
    setTimeout(() => setSirenActive(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black select-none">
      <div className="relative w-full h-full flex flex-col justify-between p-6">
        {/* Top Header Overlay */}
        <div className="relative z-30 flex items-center justify-between bg-black/75 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-sm font-bold font-mono text-white">
                RTSP LIVE · {camera.name}
              </span>
            </div>
            <span className="text-white/30">|</span>
            <span className="text-xs font-mono text-slate-300">{camera.resolution}</span>
            <span className="text-white/30">|</span>
            <span className="text-xs font-mono text-emerald-400">FPS: {camera.fps}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playSelectChime();
                onMinimizeToPip();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Minimize to Picture-in-Picture"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFx.playBackChime();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas & PTZ Transform Area */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          <div
            className="w-full h-full transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
            }}
          >
            <img
              src={camera.imageUrl}
              alt={camera.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${
                isNightVision ? 'filter grayscale invert contrast-125' : ''
              }`}
            />
          </div>

          {/* Scanlines */}
          <div className="absolute inset-0 cctv-scanline pointer-events-none" />

          {/* OSD Timestamp */}
          <div className="absolute bottom-24 left-8 z-20 font-mono text-xs text-white/80 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
            TIMESTAMP: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>

          {/* Siren Alert Flash */}
          {sirenActive && (
            <div className="absolute inset-0 bg-rose-600/30 animate-pulse pointer-events-none z-20 flex items-center justify-center">
              <div className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-lg flex items-center gap-2 shadow-2xl">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
                <span>PERIMETER SIREN TRIGGERED</span>
              </div>
            </div>
          )}

          {snapshotMsg && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-emerald-500/90 text-white text-xs font-mono font-bold shadow-xl">
              ✓ {snapshotMsg}
            </div>
          )}
        </div>

        {/* Bottom PTZ & Camera Switcher Toolbar */}
        <div className="relative z-30 flex items-center justify-between bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
          {/* Camera Switcher Buttons */}
          <div className="flex items-center gap-2">
            {cameras.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playNavTick();
                  onSelectCamera(c);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  camera.id === c.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* PTZ (Pan / Tilt / Zoom) Controller */}
          <div className="flex items-center gap-3">
            {/* Direction Arrows */}
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setPanY((prev) => prev + 20);
                }}
                className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                title="Pan Up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <div />
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setPanX((prev) => prev + 20);
                }}
                className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                title="Pan Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setPanX(0);
                  setPanY(0);
                  setZoomLevel(1);
                }}
                className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-cyan-400 font-bold"
                title="Reset Center"
              >
                RST
              </button>
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setPanX((prev) => prev - 20);
                }}
                className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                title="Pan Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div />
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setPanY((prev) => prev - 20);
                }}
                className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                title="Pan Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <div />
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setZoomLevel((z) => Math.min(2.5, z + 0.2));
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setZoomLevel((z) => Math.max(1, z - 0.2));
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tools: Night Vision, Snapshot, Siren */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playNavTick();
                setIsNightVision(!isNightVision);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isNightVision
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
              }`}
              title="Toggle Night Vision"
            >
              <Moon className="w-4 h-4" />
            </button>

            <button
              onClick={handleSnapshot}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 transition-all cursor-pointer"
              title="Take Snapshot"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={handleTriggerSiren}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
              title="Alarm Siren"
            >
              Trigger Siren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
