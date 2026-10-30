export interface MovieItem {
  id: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  description: string;
  backdropUrl: string;
  rating: number;
  year: number;
  duration: string;
  quality: '4K Ultra HD' | '8K HDR' | 'Dolby Vision';
  audio: 'Dolby Atmos 7.1' | 'DTS:X Spatial' | 'Dolby 5.1';
  genre: string[];
  ageRating: string;
  accentColor: string;
  progressPercent?: number;
}

export type IconPack = 'neon-glossy' | 'minimalist-dark' | 'frosted-glass';

export interface AppItem {
  id: string;
  name: string;
  category: 'Streaming' | 'Live TV' | 'Music' | 'Gaming' | 'System' | 'Smart Home';
  iconName: string;
  accentColor: string;
  isLocked?: boolean;
  badge?: string;
  isVipOnly?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  badge: 'VIP MASTER' | 'CINEMA PRO' | 'KIDS SAFE' | 'GUEST';
  isPinProtected: boolean;
  pin?: string;
  screenTimeLimitMinutes: number;
  screenTimeUsedMinutes: number;
  allowedAgeRating: string;
}

export interface SystemMetrics {
  cpuTemp: number;
  cpuUsage: number;
  ramUsagePercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  storageUsedGb: number;
  storageTotalGb: number;
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  pingMs: number;
  connectionType: 'WiFi 6' | 'Gigabit LAN';
  signalQuality: string;
}

export interface CctvCamera {
  id: string;
  name: string;
  location: string;
  resolution: string;
  fps: number;
  status: 'ONLINE' | 'RECORDING' | 'MOTION DETECTED';
  isNightVision: boolean;
  imageUrl: string;
}
