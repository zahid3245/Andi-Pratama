import React, { useState } from 'react';
import { Lock, Delete, X, ShieldAlert } from 'lucide-react';
import { soundFx } from '../utils/audioFeedback';

interface PinModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  expectedPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  title,
  subtitle,
  expectedPin,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    soundFx.playNavTick();
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setHasError(false);

      if (nextPin.length === 4) {
        if (nextPin === expectedPin) {
          soundFx.playSelectChime();
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 200);
        } else {
          soundFx.playErrorBuzz();
          setHasError(true);
          setTimeout(() => {
            setPin('');
            setHasError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    soundFx.playNavTick();
    setPin((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 glass-panel-elevated border transition-all duration-200 ${
          hasError
            ? 'border-rose-500 shadow-2xl shadow-rose-500/30 animate-shake'
            : 'border-white/20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playBackChime();
              setPin('');
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Dots Display */}
        <div className="flex items-center justify-center gap-3 my-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  hasError
                    ? 'bg-rose-500 scale-110'
                    : isFilled
                    ? 'bg-amber-400 shadow-lg shadow-amber-400/50 scale-110'
                    : 'bg-white/20'
                }`}
              />
            );
          })}
        </div>

        {hasError && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>PIN Salah. Silakan coba lagi (Hint: {expectedPin})</span>
          </div>
        )}

        {/* Virtual Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-amber-400/20 border border-white/10 text-white font-mono text-lg font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => {
              soundFx.playNavTick();
              setPin('');
            }}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-amber-400/20 border border-white/10 text-white font-mono text-lg font-bold transition-all cursor-pointer flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all cursor-pointer flex items-center justify-center"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
