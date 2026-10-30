import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Subtitles,
  AudioLines,
  X,
  Radio,
} from 'lucide-react';
import { MovieItem } from '../types/launcher';
import { soundFx } from '../utils/audioFeedback';

interface VideoPlayerModalProps {
  movie: MovieItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(movie?.progressPercent ?? 35);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeAudio, setActiveAudio] = useState<string>(movie?.audio ?? 'Dolby Atmos 7.1');
  const [activeSubtitle, setActiveSubtitle] = useState<string>('Indonesian (Sub)');
  const [showControls, setShowControls] = useState<boolean>(true);

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && movie) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black select-none">
      {/* Background Frame / Video Canvas Simulation */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-90 contrast-105 scale-100 transition-transform duration-1000"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

        {/* Ambient Top Bar with Badges */}
        <div
          className={`absolute top-0 inset-x-0 p-6 lg:p-8 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                soundFx.playBackChime();
                onClose();
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-white">{movie.title}</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mt-0.5">
                <span className="font-bold">{movie.quality}</span>
                <span className="text-white/40">·</span>
                <span className="text-cyan-300">{activeAudio}</span>
                <span className="text-white/40">·</span>
                <span className="text-slate-300">Bitrate: 48.6 Mbps</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playBackChime();
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Play/Pause Overlay indicator */}
        {!isPlaying && (
          <div className="absolute z-20 w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
            <Pause className="w-10 h-10 fill-current" />
          </div>
        )}

        {/* Bottom Playback Controls Strip */}
        <div
          className={`absolute bottom-0 inset-x-0 p-6 lg:p-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
        >
          {/* Timeline Bar */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-slate-300 w-12 text-right">
              {Math.floor((progress / 100) * 162)}:
              {String(Math.floor((((progress / 100) * 162) % 1) * 60)).padStart(2, '0')}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={(e) => {
                soundFx.playNavTick();
                setProgress(Number(e.target.value));
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-xs font-mono text-slate-400 w-12">{movie.duration}</span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setProgress((prev) => Math.max(0, prev - 5));
                }}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Rewind 10s"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  soundFx.playSelectChime();
                  setIsPlaying(!isPlaying);
                }}
                className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  soundFx.playNavTick();
                  setProgress((prev) => Math.min(100, prev + 5));
                }}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Fast Forward 10s"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 h-1.5 bg-white/20 rounded cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Audio & Subtitles Dropdowns */}
            <div className="flex items-center gap-4 text-xs">
              {/* Audio Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <AudioLines className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={activeAudio}
                  onChange={(e) => {
                    soundFx.playNavTick();
                    setActiveAudio(e.target.value);
                  }}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Dolby Atmos 7.1" className="bg-slate-900">
                    Dolby Atmos 7.1
                  </option>
                  <option value="DTS:X Spatial" className="bg-slate-900">
                    DTS:X Spatial
                  </option>
                  <option value="Dolby Digital 5.1" className="bg-slate-900">
                    Dolby Digital 5.1
                  </option>
                  <option value="Stereo 2.0" className="bg-slate-900">
                    Stereo 2.0
                  </option>
                </select>
              </div>

              {/* Subtitles Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <Subtitles className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={activeSubtitle}
                  onChange={(e) => {
                    soundFx.playNavTick();
                    setActiveSubtitle(e.target.value);
                  }}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Indonesian (Sub)" className="bg-slate-900">
                    Indonesian (Sub)
                  </option>
                  <option value="English [CC]" className="bg-slate-900">
                    English [CC]
                  </option>
                  <option value="Spanish" className="bg-slate-900">
                    Spanish
                  </option>
                  <option value="Off" className="bg-slate-900">
                    Off
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
