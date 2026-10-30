import React from 'react';
import { CctvCamera } from '../types/launcher';
import { Maximize2, X, Eye } from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface CctvPipOverlayProps {
  camera: CctvCamera;
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export const CctvPipOverlay: React.FC<CctvPipOverlayProps> = ({
  camera,
  isOpen,
  onClose,
  onExpand,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 w-64 lg:w-72 rounded-2xl overflow-hidden glass-panel-elevated border border-cyan-500/50 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 select-none">
      <div className="relative h-36 bg-black">
        <img
          src={camera.imageUrl}
          alt={camera.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* Scanlines */}
        <div className="absolute inset-0 cctv-scanline pointer-events-none" />

        {/* Top Control Bar */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PiP · {camera.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFx.playSelectChime();
                onExpand();
              }}
              className="p-1 rounded bg-black/60 text-slate-300 hover:text-white"
              title="Expand to Fullscreen"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                soundFx.playBackChime();
                onClose();
              }}
              className="p-1 rounded bg-black/60 text-slate-300 hover:text-white"
              title="Close PiP"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Motion alert tag */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 text-[9px] font-mono text-amber-300 bg-black/60 px-1.5 py-0.5 rounded">
          <Eye className="w-2.5 h-2.5 text-amber-400" />
          <span>Active RTSP 1080p</span>
        </div>
      </div>
    </div>
  );
};
