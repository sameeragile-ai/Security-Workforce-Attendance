import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { isInsideGeofence, formatDistance, formatTacticalCoordinates } from '../lib/geo';
import { Shield, Navigation, Crosshair, AlertOctagon } from 'lucide-react';

interface TacticalMapViewProps {
  siteId?: string;
  height?: string | number;
  interactive?: boolean;
  showAllSites?: boolean;
  onSelectSite?: (siteId: string) => void;
  className?: string;
}

export const TacticalMapView: React.FC<TacticalMapViewProps> = ({
  siteId,
  height = '260px',
  interactive = true,
  showAllSites = false,
  onSelectSite,
  className = '',
}) => {
  const {
    brand,
    language,
    sites,
    selectedSiteId,
    guardLocation,
    isMockLocationDetected,
  } = useAppStore();

  const targetSite = sites.find((s) => s.id === (siteId || selectedSiteId)) || sites[0];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  // Calculate real distance
  const { isInside, distanceMeters } = isInsideGeofence(
    guardLocation,
    { lat: targetSite.lat, lng: targetSite.lng },
    targetSite.radiusMeters
  );

  // Normalized relative offset of guard from site center (clamped for visual canvas)
  const latDiff = guardLocation.lat - targetSite.lat;
  const lngDiff = guardLocation.lng - targetSite.lng;
  // Convert diff to pixel coordinates in 300x300 tactical radar box
  // Scale factor: ~150m is 45% radius
  const scale = 18000;
  const guardX = Math.min(Math.max(150 + lngDiff * scale, 25), 275);
  const guardY = Math.min(Math.max(150 - latDiff * scale, 25), 275);

  const [radarAngle, setRadarAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-[#0A0D12] border border-white/10 select-none shadow-inner ${className}`}
      style={{ height }}
    >
      {/* Dark Tactical Grid Canvas */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-40 pointer-events-none" />

      {/* Tactical SVG Map Layer */}
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="siteGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.28" />
            <stop offset="70%" stopColor={accentColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tactical Crosshairs & Range Rings */}
        <line x1="150" y1="10" x2="150" y2="290" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="10" y1="150" x2="290" y2="150" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="150" cy="150" r="120" fill="none" stroke="#1A2433" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="150" cy="150" r="85" fill="none" stroke="#1E293B" strokeWidth="1" />

        {/* Geofence Perimeter Zone (150m) */}
        <circle
          cx="150"
          cy="150"
          r="65"
          fill="url(#siteGlow)"
          stroke={isMockLocationDetected ? '#EF4444' : isInside ? accentColor : '#64748B'}
          strokeWidth="2"
          strokeDasharray="5 3"
          className="transition-colors duration-500"
        />

        {/* Site Center Hub Marker */}
        <circle cx="150" cy="150" r="4" fill={accentColor} filter="url(#glow)" />
        <text
          x="150"
          y="136"
          fill="#94A3B8"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle"
          fontWeight="bold"
        >
          POST ALPHA · 150M GEOFENCE
        </text>

        {/* Rotating Radar Sweep Line */}
        <g transform={`rotate(${radarAngle} 150 150)`}>
          <line x1="150" y1="150" x2="150" y2="35" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
          <path
            d="M150 150 L150 35 A115 115 0 0 1 230 65 Z"
            fill={accentColor}
            opacity="0.08"
          />
        </g>

        {/* Guard Live Position Marker */}
        <g transform={`translate(${guardX}, ${guardY})`}>
          {/* Pulsing halo */}
          <circle
            cx="0"
            cy="0"
            r="12"
            fill={isMockLocationDetected ? 'rgba(239, 68, 68, 0.35)' : isInside ? 'rgba(34, 197, 94, 0.35)' : 'rgba(245, 158, 11, 0.35)'}
            className="animate-ping"
          />
          {/* Guard dot */}
          <circle
            cx="0"
            cy="0"
            r="5"
            fill={isMockLocationDetected ? '#EF4444' : isInside ? '#22C55E' : '#F59E0B'}
            stroke="#0B1626"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
          {/* Label */}
          <text
            x="0"
            y="14"
            fill={isMockLocationDetected ? '#EF4444' : isInside ? '#22C55E' : '#F59E0B'}
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isMockLocationDetected ? 'MOCK GPS' : isInside ? 'ON POST (YOU)' : 'OUTSIDE'}
          </text>
        </g>

        {/* Tactical Corner Brackets */}
        <path d="M10 22 V10 H22" fill="none" stroke="#334155" strokeWidth="1.5" />
        <path d="M290 22 V10 H278" fill="none" stroke="#334155" strokeWidth="1.5" />
        <path d="M10 278 V290 H22" fill="none" stroke="#334155" strokeWidth="1.5" />
        <path d="M290 278 V290 H278" fill="none" stroke="#334155" strokeWidth="1.5" />
      </svg>

      {/* Floating Tactical Overlay Info */}
      <div className="absolute top-2.5 start-2.5 z-20 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono-telemetry text-slate-300">
        <span
          className={`w-2 h-2 rounded-full ${
            isMockLocationDetected
              ? 'bg-red-500 animate-ping'
              : isInside
              ? 'bg-emerald-500 animate-pulse'
              : 'bg-amber-500'
          }`}
        />
        <span className="font-bold">
          {isMockLocationDetected
            ? 'BREACH / MOCK GPS'
            : isInside
            ? 'INSIDE PERIMETER'
            : 'OUTSIDE GEOFENCE'}
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-amber-400 font-bold">{formatDistance(distanceMeters, language === 'ar')}</span>
      </div>

      {/* GPS Coordinates Telemetry Bar */}
      <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/5 text-[9px] font-mono-telemetry text-slate-400">
        <span className="truncate">
          {formatTacticalCoordinates(guardLocation.lat, guardLocation.lng)}
        </span>
        <span className="shrink-0 text-slate-400">
          ±{guardLocation.accuracyMeters}m
        </span>
      </div>
    </div>
  );
};
