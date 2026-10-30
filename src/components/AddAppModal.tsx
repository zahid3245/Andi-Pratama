import React, { useState } from 'react';
import { Plus, X, Layers, Sparkles } from 'lucide-react';
import { AppItem } from '../types/launcher';
import { soundFx } from '../utils/audioFeedback';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (app: AppItem) => void;
}

export const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose, onAddApp }) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<AppItem['category']>('Streaming');
  const [accentColor, setAccentColor] = useState<string>('#00E5FF');
  const [badge, setBadge] = useState<string>('Custom');
  const [iconName, setIconName] = useState<string>('Tv');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playSelectChime();
    const newApp: AppItem = {
      id: `custom-app-${Date.now()}`,
      name: name.trim(),
      category,
      iconName,
      accentColor,
      badge: badge.trim() || undefined,
    };

    onAddApp(newApp);
    onClose();
  };

  const COLOR_OPTIONS = ['#00E5FF', '#FF2A6D', '#FFD700', '#10B981', '#8B5CF6', '#F97316'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 select-none">
      <div className="w-full max-w-md rounded-3xl p-6 lg:p-8 glass-panel-elevated border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tambah Shortcut Aplikasi</h2>
              <p className="text-xs text-slate-400">Daftarkan aplikasi Android STB atau link M3U8 baru.</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Nama Aplikasi / Channel
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: HBO Max, Vidio, Kodi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AppItem['category'])}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Streaming">Streaming</option>
                <option value="Live TV">Live TV</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Smart Home">Smart Home</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Badge Resolusi
              </label>
              <input
                type="text"
                placeholder="4K, VIP, Live"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Warna Glow Kartu
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setAccentColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                    accentColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                soundFx.playBackChime();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 cursor-pointer transition-transform active:scale-95"
            >
              Simpan ke Layar Utama
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
