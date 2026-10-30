import React from 'react';
import { MovieItem } from '../types/launcher';
import { X, Play, Plus, Check, Star, Film, Volume2, ShieldCheck, Tv } from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface MovieDetailsModalProps {
  movie: MovieItem | null;
  onClose: () => void;
  onWatchNow: (movie: MovieItem) => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onWatchNow,
  isFavorited,
  onToggleFavorite,
}) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 select-none">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden glass-panel-elevated border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Backdrop Banner Header */}
        <div className="relative h-64 w-full">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10141f] via-[#10141f]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              soundFx.playBackChime();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Backdrop */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>★ {movie.rating.toFixed(1)} / 5.0 RATING</span>
              <span className="text-white/30">·</span>
              <span className="text-cyan-300 font-mono">{movie.quality}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {movie.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#10141f] space-y-5">
          <p className="text-sm text-slate-300 leading-relaxed">{movie.description}</p>

          {/* Technical Audio/Visual Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">RESOLUSI</span>
              <span className="text-xs font-bold text-white mt-0.5 block">{movie.quality}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">AUDIO FORMAT</span>
              <span className="text-xs font-bold text-cyan-300 mt-0.5 block">{movie.audio}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">DURASI</span>
              <span className="text-xs font-bold text-white mt-0.5 block">{movie.duration}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">RATING USIA</span>
              <span className="text-xs font-bold text-amber-400 mt-0.5 block">{movie.ageRating}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => {
                soundFx.playSelectChime();
                onToggleFavorite(movie.id);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold cursor-pointer"
            >
              {isFavorited ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tersimpan di Favorit</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tambah ke Favorit</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playSelectChime();
                onClose();
                onWatchNow(movie);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 cursor-pointer transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Putar Film Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
