import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Film, Volume2, VolumeX, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { MovieItem } from '../types/launcher';
import { soundFx } from '../utils/audioFeedback';

interface HeroBannerProps {
  movies: MovieItem[];
  currentMovieIndex: number;
  onSelectMovieIndex: (index: number) => void;
  onWatchNow: (movie: MovieItem) => void;
  myList: string[];
  onToggleMyList: (movieId: string) => void;
  onOpenDetails: (movie: MovieItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movies,
  currentMovieIndex,
  onSelectMovieIndex,
  onWatchNow,
  myList,
  onToggleMyList,
  onOpenDetails,
}) => {
  const currentMovie = movies[currentMovieIndex] || movies[0];
  const [isPlayingTrailer, setIsPlayingTrailer] = useState<boolean>(true);
  const [trailerSound, setTrailerSound] = useState<boolean>(false);
  const isFavorited = myList.includes(currentMovie.id);

  // Auto-cycle trailers gently if left untouched, or cycle via remote
  const handleNextMovie = () => {
    soundFx.playNavTick();
    onSelectMovieIndex((currentMovieIndex + 1) % movies.length);
  };

  const handlePrevMovie = () => {
    soundFx.playNavTick();
    onSelectMovieIndex((currentMovieIndex - 1 + movies.length) % movies.length);
  };

  return (
    <section className="relative w-full h-[420px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group mb-8">
      {/* Dynamic Cinematic Backdrop Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={currentMovie.backdropUrl}
          alt={currentMovie.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-1000 ease-out transform ${
            isPlayingTrailer ? 'scale-105 filter brightness-95' : 'scale-100 filter brightness-85'
          }`}
        />

        {/* Ambient Animated Cinematic Lighting Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-[#080a0f]/75 to-transparent z-10" />

        {/* Simulated subtle trailer motion dust/particles in CSS */}
        {isPlayingTrailer && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent z-10 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Main Glass Content Layer */}
      <div className="relative z-20 h-full flex flex-col justify-end p-6 lg:p-12 max-w-4xl">
        {/* Editorial Subtitle / Kicker */}
        <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase mb-2">
          <span className="text-amber-400 font-bold tracking-widest flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ★ {currentMovie.rating.toFixed(1)} RATING
          </span>
          <span className="text-white/40">·</span>
          <span className="text-cyan-300 font-mono tracking-widest">{currentMovie.quality}</span>
          <span className="text-white/40">·</span>
          <span className="text-slate-300 font-mono">{currentMovie.audio}</span>
          <span className="text-white/40">·</span>
          <span className="text-slate-400 font-medium">{currentMovie.year}</span>
        </div>

        {/* Hero Title with Balance */}
        <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2 text-balance drop-shadow-md">
          {currentMovie.title}
        </h1>

        {/* Tagline */}
        <p className="text-amber-200/90 text-sm lg:text-base font-medium italic mb-2">
          "{currentMovie.tagline}"
        </p>

        {/* Synopsis */}
        <p className="text-slate-300 text-xs lg:text-sm line-clamp-2 lg:line-clamp-3 mb-4 max-w-2xl leading-relaxed drop-shadow">
          {currentMovie.description}
        </p>

        {/* Genre Tags (Clean unboxed metadata) */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-5">
          {currentMovie.genre.map((g, i) => (
            <React.Fragment key={g}>
              <span className="text-slate-300">{g}</span>
              {i < currentMovie.genre.length - 1 && <span className="text-white/30">/</span>}
            </React.Fragment>
          ))}
          <span className="text-white/30">·</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/20">
            {currentMovie.ageRating}
          </span>
          <span className="text-white/30">·</span>
          <span className="font-mono text-slate-400">{currentMovie.duration}</span>
        </div>

        {/* Quick Action CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Watch Now Button */}
          <button
            onClick={() => {
              soundFx.playSelectChime();
              onWatchNow(currentMovie);
            }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400/50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>▶ Lanjutkan Menonton</span>
          </button>

          {/* Add to Favorites Button */}
          <button
            onClick={() => {
              soundFx.playSelectChime();
              onToggleMyList(currentMovie.id);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border cursor-pointer ${
              isFavorited
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
          >
            {isFavorited ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Tersimpan di Favorit</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>+ Favorit Saya</span>
              </>
            )}
          </button>

          {/* Trailer Preview Mode Toggle */}
          <button
            onClick={() => {
              soundFx.playNavTick();
              setIsPlayingTrailer(!isPlayingTrailer);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>{isPlayingTrailer ? 'Pause Trailer' : 'Play Live Preview'}</span>
          </button>

          {/* Sound Toggle for Trailer */}
          {isPlayingTrailer && (
            <button
              onClick={() => {
                soundFx.playNavTick();
                setTrailerSound(!trailerSound);
              }}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-all cursor-pointer"
              title={trailerSound ? 'Mute Trailer Audio' : 'Unmute Trailer Audio'}
            >
              {trailerSound ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}

          {/* Details & Cast */}
          <button
            onClick={() => {
              soundFx.playSelectChime();
              onOpenDetails(currentMovie);
            }}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="More Info & Stream Specs"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel navigation controls on right side */}
      <div className="absolute right-6 bottom-8 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
        <button
          onClick={handlePrevMovie}
          className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
          title="Previous Featured"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-2">
          {movies.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                soundFx.playNavTick();
                onSelectMovieIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentMovieIndex
                  ? 'w-6 bg-amber-400'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={m.title}
            />
          ))}
        </div>

        <button
          onClick={handleNextMovie}
          className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
          title="Next Featured"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
