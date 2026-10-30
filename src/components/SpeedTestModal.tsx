import React, { useState, useEffect } from 'react';
import { Wifi, Gauge, Play, CheckCircle2, RotateCw, X, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stage, setStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [ping, setPing] = useState<number>(8);
  const [jitter, setJitter] = useState<number>(1.2);
  const [download, setDownload] = useState<number>(385);
  const [upload, setUpload] = useState<number>(120);

  if (!isOpen) return null;

  const startTest = () => {
    soundFx.playRamBoostPulse();
    setIsRunning(true);
    setStage('ping');
    setPing(14);
    setDownload(0);
    setUpload(0);

    // Ping stage
    setTimeout(() => {
      setPing(8);
      setJitter(1.1);
      setStage('download');

      // Download test curve
      let currDl = 10;
      const dlInterval = setInterval(() => {
        currDl += Math.floor(Math.random() * 65) + 30;
        if (currDl >= 420) {
          currDl = 425;
          clearInterval(dlInterval);
          setDownload(currDl);
          setStage('upload');

          // Upload test curve
          let currUl = 10;
          const ulInterval = setInterval(() => {
            currUl += Math.floor(Math.random() * 30) + 15;
            if (currUl >= 165) {
              currUl = 168;
              clearInterval(ulInterval);
              setUpload(currUl);
              setStage('complete');
              setIsRunning(false);
              soundFx.playSelectChime();
            } else {
              setUpload(currUl);
            }
          }, 80);
        } else {
          setDownload(currDl);
        }
      }, 70);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 select-none">
      <div className="w-full max-w-lg rounded-3xl p-6 lg:p-8 glass-panel-elevated border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AURA Gigabit Speed Test</h2>
              <p className="text-xs text-slate-400 font-mono">Server: Jakarta Tier-1 Edge</p>
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

        {/* Speedometer Radial Display */}
        <div className="relative w-48 h-48 mx-auto my-4 flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-4 border-white/10 shadow-inner">
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
            {stage === 'download'
              ? 'Testing Download'
              : stage === 'upload'
              ? 'Testing Upload'
              : stage === 'ping'
              ? 'Testing Latency'
              : 'Speed Test Ready'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl lg:text-5xl font-black font-mono text-white tracking-tighter">
              {stage === 'upload' ? upload : download}
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400">Mbps</span>

          {/* Glowing orbital ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-cyan-400/50 transition-opacity duration-300 ${
              isRunning ? 'animate-spin opacity-100' : 'opacity-20'
            }`}
          />
        </div>

        {/* Detailed Metrics Table */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">PING</span>
            <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block">
              {ping} ms
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">JITTER</span>
            <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block">
              {jitter} ms
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">DOWNLOAD</span>
            <span className="text-sm font-bold font-mono text-cyan-400 mt-1 block">
              {download} Mbps
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">UPLOAD</span>
            <span className="text-sm font-bold font-mono text-amber-400 mt-1 block">
              {upload} Mbps
            </span>
          </div>
        </div>

        {/* 4K Streaming Certification Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">4K & 8K Ultra HD Certified</span>
              <span className="text-slate-400 block text-[11px]">
                Koneksi optimal untuk streaming Dolby Vision tanpa buffer.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-400 text-slate-950">
            A+ EXCELLENT
          </span>
        </div>

        {/* Trigger Button */}
        <button
          onClick={startTest}
          disabled={isRunning}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Mengukur Kecepatan Jaringan...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Uji Kecepatan Ulang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
