import React, { useRef } from 'react';
import {
  Tv,
  PlaySquare,
  Film,
  Radio,
  Sparkles,
  Music,
  Clapperboard,
  Gamepad2,
  Home,
  Plus,
  Lock,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { AppItem, IconPack } from '../types/launcher';
import { soundFx } from '../utils/audioFeedback';

interface AppCarouselProps {
  apps: AppItem[];
  focusedAppIndex: number;
  onFocusApp: (index: number) => void;
  onLaunchApp: (app: AppItem) => void;
  onOpenAddApp: () => void;
  iconPack: IconPack;
  onChangeIconPack: (pack: IconPack) => void;
}

export const AppCarousel: React.FC<AppCarouselProps> = ({
  apps,
  focusedAppIndex,
  onFocusApp,
  onLaunchApp,
  onOpenAddApp,
  iconPack,
  onChangeIconPack,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Icon mapping
  const renderAppIcon = (iconName: string, accentColor: string) => {
    const props = { className: 'w-8 h-8 transition-transform group-hover:scale-110 duration-200' };
    switch (iconName) {
      case 'Tv':
        return <Tv {...props} style={{ color: accentColor }} />;
      case 'PlaySquare':
        return <PlaySquare {...props} style={{ color: accentColor }} />;
      case 'Film':
        return <Film {...props} style={{ color: accentColor }} />;
      case 'Radio':
        return <Radio {...props} style={{ color: accentColor }} />;
      case 'Sparkles':
        return <Sparkles {...props} style={{ color: accentColor }} />;
      case 'Music':
        return <Music {...props} style={{ color: accentColor }} />;
      case 'FolderPlay':
      case 'Clapperboard':
        return <Clapperboard {...props} style={{ color: accentColor }} />;
      case 'Gamepad2':
        return <Gamepad2 {...props} style={{ color: accentColor }} />;
      case 'Home':
        return <Home {...props} style={{ color: accentColor }} />;
      default:
        return <Film {...props} style={{ color: accentColor }} />;
    }
  };

  const getPackContainerStyle = (app: AppItem, isFocused: boolean) => {
    switch (iconPack) {
      case 'neon-glossy':
        return isFocused
          ? {
              boxShadow: `0 14px 35px -6px ${app.accentColor}70, 0 0 20px ${app.accentColor}40`,
              borderColor: app.accentColor,
            }
          : {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            };
      case 'minimalist-dark':
        return isFocused
          ? {
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
              borderColor: '#f59e0b',
              backgroundColor: '#111622',
            }
          : {
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backgroundColor: '#0a0d14',
            };
      case 'frosted-glass':
      default:
        return isFocused
          ? {
              boxShadow: `0 12px 35px rgba(0, 0, 0, 0.6), inset 0 0 15px ${app.accentColor}30`,
              borderColor: 'rgba(255, 255, 255, 0.35)',
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
            }
          : {
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
            };
    }
  };

  return (
    <section className="relative w-full mb-10 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Aplikasi Favorit & Sering Digunakan</span>
          </h2>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            D-Pad Navigation Enabled
          </span>
        </div>

        {/* Icon Pack VIP Customizer */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          <Layers className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
          <span className="text-slate-400 font-medium mr-1 text-[11px] hidden md:inline">
            Icon Theme:
          </span>
          <button
            onClick={() => {
              soundFx.playNavTick();
              onChangeIconPack('neon-glossy');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              iconPack === 'neon-glossy'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Neon Glossy
          </button>
          <button
            onClick={() => {
              soundFx.playNavTick();
              onChangeIconPack('frosted-glass');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              iconPack === 'frosted-glass'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Frosted Glass
          </button>
          <button
            onClick={() => {
              soundFx.playNavTick();
              onChangeIconPack('minimalist-dark');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              iconPack === 'minimalist-dark'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Minimal Dark
          </button>
        </div>
      </div>

      {/* Floating Cards Carousel with Glow Focus State */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 lg:gap-5 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth focus:outline-none"
      >
        {apps.map((app, index) => {
          const isFocused = focusedAppIndex === index;
          const containerStyle = getPackContainerStyle(app, isFocused);

          return (
            <div
              key={app.id}
              tabIndex={0}
              onMouseEnter={() => {
                soundFx.playNavTick();
                onFocusApp(index);
              }}
              onFocus={() => {
                soundFx.playNavTick();
                onFocusApp(index);
              }}
              onClick={() => {
                soundFx.playSelectChime();
                onLaunchApp(app);
              }}
              style={containerStyle}
              className={`group relative shrink-0 w-36 lg:w-44 h-40 lg:h-48 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out border backdrop-blur-xl ${
                isFocused
                  ? 'scale-105 -translate-y-2.5 z-20 ring-2 ring-white/40'
                  : 'hover:scale-102 hover:-translate-y-1 z-10'
              }`}
            >
              {/* Top Row: Category or Badge */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {app.category}
                </span>
                {app.badge && (
                  <span
                    className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: `${app.accentColor}50`,
                      backgroundColor: `${app.accentColor}15`,
                      color: app.accentColor,
                    }}
                  >
                    {app.badge}
                  </span>
                )}
              </div>

              {/* Center App Icon with Adaptive Glow Backdrop */}
              <div className="relative flex items-center justify-center my-auto">
                {/* Glow ring */}
                <div
                  className={`absolute w-16 h-16 rounded-full blur-xl transition-opacity duration-300 ${
                    isFocused ? 'opacity-80' : 'opacity-20 group-hover:opacity-50'
                  }`}
                  style={{ backgroundColor: app.accentColor }}
                />
                <div className="relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  {renderAppIcon(app.iconName, app.accentColor)}
                </div>
              </div>

              {/* Bottom Row: App Name and Lock status */}
              <div className="flex items-center justify-between w-full mt-2">
                <span
                  className={`text-xs lg:text-sm font-bold truncate transition-colors ${
                    isFocused ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {app.name}
                </span>

                {app.isLocked && (
                  <div
                    className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    title="Protected by Security PIN"
                  >
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Application Card [ + ] */}
        <div
          tabIndex={0}
          onMouseEnter={() => soundFx.playNavTick()}
          onClick={() => {
            soundFx.playSelectChime();
            onOpenAddApp();
          }}
          className="group relative shrink-0 w-36 lg:w-44 h-40 lg:h-48 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ease-out border border-dashed border-white/20 hover:border-amber-400/80 bg-white/5 hover:bg-white/10 hover:scale-102 hover:-translate-y-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-amber-400/20 group-hover:text-amber-400 flex items-center justify-center transition-colors border border-white/10">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold tracking-wide">Tambah App</span>
          <span className="text-[10px] text-slate-500 font-mono">Custom APK / URL</span>
        </div>
      </div>
    </section>
  );
};
