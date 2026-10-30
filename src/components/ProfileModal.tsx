import React from 'react';
import { UserProfile } from '../types/launcher';
import { Lock, X, Shield, Clock, UserCheck } from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface ProfileModalProps {
  isOpen: boolean;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profiles,
  activeProfile,
  onSelectProfile,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 select-none">
      <div className="w-full max-w-2xl rounded-3xl p-8 glass-panel-elevated border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Who's Watching?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih profil pengguna untuk memuat preferensi, batasan jam tayang, & rekomendasi personal.
            </p>
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

        {/* Profile Avatar Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {profiles.map((profile) => {
            const isCurrent = profile.id === activeProfile.id;

            return (
              <div
                key={profile.id}
                onClick={() => {
                  soundFx.playSelectChime();
                  onSelectProfile(profile);
                }}
                className={`group relative rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-amber-400/10 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-400/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:scale-102 hover:border-white/30'
                }`}
              >
                {/* Avatar Icon */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-3xl mb-3 border border-white/15 shadow-inner group-hover:scale-105 transition-transform">
                  {profile.avatar}
                  {profile.isPinProtected && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center border-2 border-slate-900 shadow">
                      <Lock className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase tracking-wider shadow">
                      Active
                    </div>
                  )}
                </div>

                {/* Profile Name & Badge */}
                <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {profile.name}
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono font-semibold tracking-wider mt-0.5">
                  {profile.badge}
                </span>

                {/* Screen Time Metric if applicable */}
                {profile.screenTimeLimitMinutes > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>
                      {profile.screenTimeUsedMinutes}/{profile.screenTimeLimitMinutes}m
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Parental Controls & Restrictions Note */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs space-y-0.5">
            <span className="font-bold text-slate-200">
              Proteksi Akses & Parental Control Aktif
            </span>
            <span className="text-slate-400 leading-relaxed">
              Profil bertanda gembok memerlukan PIN 4 digit untuk beralih. Batas waktu layar (Screen Time) profil anak akan memicu kunci otomatis setelah jam harian tercapai.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
