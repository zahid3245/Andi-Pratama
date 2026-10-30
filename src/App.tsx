/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { HeroBanner } from './components/HeroBanner';
import { AppCarousel } from './components/AppCarousel';
import { WidgetsSection } from './components/WidgetsSection';
import { VirtualRemote } from './components/VirtualRemote';
import { ProfileModal } from './components/ProfileModal';
import { PinModal } from './components/PinModal';
import { SpeedTestModal } from './components/SpeedTestModal';
import { WallpaperStudioModal } from './components/WallpaperStudioModal';
import { CctvFullscreenModal } from './components/CctvFullscreenModal';
import { CctvPipOverlay } from './components/CctvPipOverlay';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { AddAppModal } from './components/AddAppModal';

import {
  FEATURED_MOVIES,
  DEFAULT_APPS,
  DEFAULT_PROFILES,
  INITIAL_METRICS,
  CCTV_CAMERAS,
} from './data/mockData';
import { MovieItem, AppItem, UserProfile, IconPack, SystemMetrics, CctvCamera } from './types/launcher';
import { soundFx } from './utils/audioFeedback';

export default function App() {
  // Profiles
  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(DEFAULT_PROFILES[0]);

  // Featured Content
  const [movies] = useState<MovieItem[]>(FEATURED_MOVIES);
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [myList, setMyList] = useState<string[]>(['movie-1']);

  // Apps
  const [apps, setApps] = useState<AppItem[]>(DEFAULT_APPS);
  const [focusedAppIndex, setFocusedAppIndex] = useState<number>(0);
  const [iconPack, setIconPack] = useState<IconPack>('neon-glossy');

  // Hardware Metrics
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [isBoostingRam, setIsBoostingRam] = useState<boolean>(false);

  // CCTV
  const [cameras, setCameras] = useState<CctvCamera[]>(CCTV_CAMERAS);
  const [activeCctvForFullscreen, setActiveCctvForFullscreen] = useState<CctvCamera | null>(null);
  const [isPipActive, setIsPipActive] = useState<boolean>(false);

  // Aesthetics & Visual Studio
  const [activeWallpaperUrl, setActiveWallpaperUrl] = useState<string>(
    '/src/assets/images/hero_cinematic_scifi_1793316888522.jpg'
  );
  const [blurIntensity, setBlurIntensity] = useState<number>(20);
  const [frostedOpacity, setFrostedOpacity] = useState<number>(65);
  const [screensaverMinutes, setScreensaverMinutes] = useState<number>(5);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSpeedTestOpen, setIsSpeedTestOpen] = useState<boolean>(false);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [isAddAppOpen, setIsAddAppOpen] = useState<boolean>(false);
  const [activeMovieForPlayer, setActiveMovieForPlayer] = useState<MovieItem | null>(null);
  const [activeMovieForDetails, setActiveMovieForDetails] = useState<MovieItem | null>(null);

  // Security PIN dialog
  const [pinDialog, setPinDialog] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    expectedPin: string;
    onSuccess: () => void;
  } | null>(null);

  // Remote D-Pad Navigation UI
  const [isRemoteOpen, setIsRemoteOpen] = useState<boolean>(false);
  const [activeZone, setActiveZone] = useState<'hero' | 'apps' | 'widgets'>('apps');

  // Simulated live metrics telemetry jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuTemp: 47 + Math.floor(Math.random() * 5),
        cpuUsage: 18 + Math.floor(Math.random() * 12),
        downloadSpeedMbps: 380 + Math.floor(Math.random() * 25),
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Launch Notification Toast
  const [launchToast, setLaunchToast] = useState<{ appName: string; mode: string } | null>(null);

  const triggerLaunchToast = (app: AppItem) => {
    soundFx.playSelectChime();
    setLaunchToast({
      appName: app.name,
      mode: 'Memuat streaming 4K HDR STB mode...',
    });
    setTimeout(() => {
      setLaunchToast(null);
    }, 2500);
  };

  // One-Click RAM Booster
  const handleBoostRam = () => {
    setIsBoostingRam(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        ramUsagePercent: 36,
        ramUsedGb: 2.88,
      }));
      setIsBoostingRam(false);
      soundFx.playSelectChime();
    }, 1800);
  };

  // Toggle Favorite
  const handleToggleMyList = (id: string) => {
    setMyList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Launch App handler with Security PIN check
  const handleLaunchApp = (app: AppItem) => {
    if (app.isLocked) {
      setPinDialog({
        isOpen: true,
        title: `Verifikasi PIN: ${app.name}`,
        subtitle: 'Aplikasi ini diproteksi oleh keamanan Parental & VIP Lock.',
        expectedPin: '8888',
        onSuccess: () => {
          setPinDialog(null);
          triggerLaunchToast(app);
        },
      });
    } else {
      triggerLaunchToast(app);
    }
  };

  // Profile selection with PIN check
  const handleSelectProfile = (profile: UserProfile) => {
    if (profile.isPinProtected && profile.pin) {
      setIsProfileModalOpen(false);
      setPinDialog({
        isOpen: true,
        title: `Kunci Profil: ${profile.name}`,
        subtitle: `Masukkan PIN 4-digit profil ${profile.name} untuk beralih.`,
        expectedPin: profile.pin,
        onSuccess: () => {
          setActiveProfile(profile);
          setPinDialog(null);
        },
      });
    } else {
      setActiveProfile(profile);
      setIsProfileModalOpen(false);
    }
  };

  // Add Custom App
  const handleAddApp = (newApp: AppItem) => {
    setApps((prev) => [...prev, newApp]);
    setFocusedAppIndex(apps.length);
  };

  // Remote / Keyboard D-Pad Navigation Engine
  const handleDpadNavigate = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (activeZone === 'apps') {
        if (direction === 'left') {
          setFocusedAppIndex((prev) => (prev > 0 ? prev - 1 : apps.length - 1));
        } else if (direction === 'right') {
          setFocusedAppIndex((prev) => (prev < apps.length - 1 ? prev + 1 : 0));
        } else if (direction === 'up') {
          setActiveZone('hero');
        } else if (direction === 'down') {
          setActiveZone('widgets');
        }
      } else if (activeZone === 'hero') {
        if (direction === 'down') {
          setActiveZone('apps');
        } else if (direction === 'left') {
          setCurrentMovieIndex((prev) => (prev > 0 ? prev - 1 : movies.length - 1));
        } else if (direction === 'right') {
          setCurrentMovieIndex((prev) => (prev < movies.length - 1 ? prev + 1 : 0));
        }
      } else if (activeZone === 'widgets') {
        if (direction === 'up') {
          setActiveZone('apps');
        }
      }
    },
    [activeZone, apps.length, movies.length]
  );

  const handleDpadSelect = useCallback(() => {
    if (activeZone === 'apps') {
      const selectedApp = apps[focusedAppIndex];
      if (selectedApp) {
        handleLaunchApp(selectedApp);
      }
    } else if (activeZone === 'hero') {
      setActiveMovieForPlayer(movies[currentMovieIndex]);
    }
  }, [activeZone, apps, focusedAppIndex, movies, currentMovieIndex]);

  const handleDpadBack = useCallback(() => {
    // Close any open modals
    if (activeMovieForPlayer) setActiveMovieForPlayer(null);
    else if (activeMovieForDetails) setActiveMovieForDetails(null);
    else if (activeCctvForFullscreen) setActiveCctvForFullscreen(null);
    else if (isProfileModalOpen) setIsProfileModalOpen(false);
    else if (isSpeedTestOpen) setIsSpeedTestOpen(false);
    else if (isStudioOpen) setIsStudioOpen(false);
    else if (isAddAppOpen) setIsAddAppOpen(false);
    else if (pinDialog) setPinDialog(null);
    else if (isRemoteOpen) setIsRemoteOpen(false);
    else {
      setActiveZone('hero');
    }
  }, [
    activeMovieForPlayer,
    activeMovieForDetails,
    activeCctvForFullscreen,
    isProfileModalOpen,
    isSpeedTestOpen,
    isStudioOpen,
    isAddAppOpen,
    pinDialog,
    isRemoteOpen,
  ]);

  // Physical Keyboard Listener (Arrow Keys, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          soundFx.playNavTick();
          handleDpadNavigate('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          soundFx.playNavTick();
          handleDpadNavigate('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          soundFx.playNavTick();
          handleDpadNavigate('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          soundFx.playNavTick();
          handleDpadNavigate('right');
          break;
        case 'Enter':
          e.preventDefault();
          soundFx.playSelectChime();
          handleDpadSelect();
          break;
        case 'Escape':
        case 'Backspace':
          soundFx.playBackChime();
          handleDpadBack();
          break;
        case 'r':
        case 'R':
          setIsRemoteOpen((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDpadNavigate, handleDpadSelect, handleDpadBack]);

  return (
    <div
      className="relative min-h-screen w-full bg-[#080a0f] text-slate-100 overflow-x-hidden"
      style={
        {
          '--blur-intensity': `${blurIntensity}px`,
        } as React.CSSProperties
      }
    >
      {/* Dynamic 8K Wallpaper Backdrop with Smooth Crossfade */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={activeWallpaperUrl}
          alt="Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.25] contrast-125 scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/80 to-transparent" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Top Bar / Status Bar (Eksklusif & Clean) */}
        <TopBar
          activeProfile={activeProfile}
          metrics={metrics}
          onOpenProfiles={() => setIsProfileModalOpen(true)}
          onOpenStudio={() => setIsStudioOpen(true)}
          onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
          onToggleRemote={() => setIsRemoteOpen(!isRemoteOpen)}
          isRemoteOpen={isRemoteOpen}
        />

        {/* TV Viewport Container */}
        <main className="flex-1 w-full max-w-[1560px] mx-auto px-6 lg:px-12 pt-6 pb-16">
          {/* Active Navigation Zone Indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-white/40">Focused Zone:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase ${
                  activeZone === 'hero'
                    ? 'bg-amber-400 text-slate-950'
                    : activeZone === 'apps'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-violet-400 text-slate-950'
                }`}
              >
                {activeZone === 'hero'
                  ? 'Cinematic Hero Banner'
                  : activeZone === 'apps'
                  ? 'Apps Carousel'
                  : 'Smart Home & Widgets'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span>Gunakan Tombol Panah (Arrow Keys) & Enter untuk Navigasi STB</span>
            </div>
          </div>

          {/* 2. Dynamic Hero Panel (Cinematic Section) */}
          <div
            className={`transition-all duration-300 rounded-3xl ${
              activeZone === 'hero' ? 'ring-4 ring-amber-400/40 shadow-2xl' : ''
            }`}
          >
            <HeroBanner
              movies={movies}
              currentMovieIndex={currentMovieIndex}
              onSelectMovieIndex={setCurrentMovieIndex}
              onWatchNow={(movie) => setActiveMovieForPlayer(movie)}
              myList={myList}
              onToggleMyList={handleToggleMyList}
              onOpenDetails={(movie) => setActiveMovieForDetails(movie)}
            />
          </div>

          {/* 3. Carousel Aplikasi (Card Grid & Focus Mode) */}
          <div
            className={`transition-all duration-300 rounded-3xl p-1 ${
              activeZone === 'apps' ? 'ring-4 ring-cyan-400/40' : ''
            }`}
          >
            <AppCarousel
              apps={apps}
              focusedAppIndex={focusedAppIndex}
              onFocusApp={setFocusedAppIndex}
              onLaunchApp={handleLaunchApp}
              onOpenAddApp={() => setIsAddAppOpen(true)}
              iconPack={iconPack}
              onChangeIconPack={setIconPack}
            />
          </div>

          {/* 4. Widgets & Smart Metrics (VIP Only) */}
          <div
            className={`transition-all duration-300 rounded-3xl p-1 ${
              activeZone === 'widgets' ? 'ring-4 ring-violet-400/40' : ''
            }`}
          >
            <WidgetsSection
              metrics={metrics}
              onBoostRam={handleBoostRam}
              isBoostingRam={isBoostingRam}
              onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
              cameras={cameras}
              onOpenCctvFullscreen={(cam) => setActiveCctvForFullscreen(cam)}
              onTogglePipCctv={() => setIsPipActive(!isPipActive)}
              isPipActive={isPipActive}
            />
          </div>
        </main>
      </div>

      {/* Floating CCTV Picture-in-Picture Mini View */}
      <CctvPipOverlay
        camera={cameras[0]}
        isOpen={isPipActive}
        onClose={() => setIsPipActive(false)}
        onExpand={() => {
          setIsPipActive(false);
          setActiveCctvForFullscreen(cameras[0]);
        }}
      />

      {/* On-Screen Virtual Smart TV Remote Control */}
      <VirtualRemote
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        onNavigate={handleDpadNavigate}
        onSelect={handleDpadSelect}
        onBack={handleDpadBack}
        onHome={() => {
          setActiveZone('hero');
          handleDpadBack();
        }}
      />

      {/* Profile Selector Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* PIN Security Keypad Modal */}
      {pinDialog && (
        <PinModal
          isOpen={pinDialog.isOpen}
          title={pinDialog.title}
          subtitle={pinDialog.subtitle}
          expectedPin={pinDialog.expectedPin}
          onSuccess={pinDialog.onSuccess}
          onClose={() => setPinDialog(null)}
        />
      )}

      {/* Gigabit Network Speed Test Modal */}
      <SpeedTestModal isOpen={isSpeedTestOpen} onClose={() => setIsSpeedTestOpen(false)} />

      {/* Aesthetic & Frosted Glass Studio Modal */}
      <WallpaperStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        activeWallpaperUrl={activeWallpaperUrl}
        onChangeWallpaper={setActiveWallpaperUrl}
        blurIntensity={blurIntensity}
        onChangeBlur={setBlurIntensity}
        frostedOpacity={frostedOpacity}
        onChangeOpacity={setFrostedOpacity}
        screensaverMinutes={screensaverMinutes}
        onChangeScreensaverMinutes={setScreensaverMinutes}
      />

      {/* Fullscreen CCTV RTSP Feed with PTZ controls */}
      {activeCctvForFullscreen && (
        <CctvFullscreenModal
          camera={activeCctvForFullscreen}
          cameras={cameras}
          onSelectCamera={setActiveCctvForFullscreen}
          onClose={() => setActiveCctvForFullscreen(null)}
          onMinimizeToPip={() => {
            setActiveCctvForFullscreen(null);
            setIsPipActive(true);
          }}
        />
      )}

      {/* Simulated 4K UHD Video Player */}
      {activeMovieForPlayer && (
        <VideoPlayerModal
          movie={activeMovieForPlayer}
          onClose={() => setActiveMovieForPlayer(null)}
        />
      )}

      {/* Film Technical Specs & Cast Details Modal */}
      {activeMovieForDetails && (
        <MovieDetailsModal
          movie={activeMovieForDetails}
          onClose={() => setActiveMovieForDetails(null)}
          onWatchNow={(m) => {
            setActiveMovieForDetails(null);
            setActiveMovieForPlayer(m);
          }}
          isFavorited={myList.includes(activeMovieForDetails.id)}
          onToggleFavorite={handleToggleMyList}
        />
      )}

      {/* Launch Notification Toast */}
      {launchToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-[#0f141f]/95 border border-cyan-400/50 shadow-2xl shadow-cyan-500/25 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping inline-block" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">
              {launchToast.appName}
            </span>
            <span className="text-[11px] font-mono text-cyan-300">
              {launchToast.mode}
            </span>
          </div>
        </div>
      )}

      {/* Add Custom Application Modal */}
      <AddAppModal
        isOpen={isAddAppOpen}
        onClose={() => setIsAddAppOpen(false)}
        onAddApp={handleAddApp}
      />
    </div>
  );
}
