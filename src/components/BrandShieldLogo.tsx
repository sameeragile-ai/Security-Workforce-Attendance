import React from 'react';
import { BrandId } from '../types';

interface BrandShieldLogoProps {
  brand: BrandId;
  size?: number;
  showRadar?: boolean;
  className?: string;
}

export const BrandShieldLogo: React.FC<BrandShieldLogoProps> = ({
  brand,
  size = 48,
  showRadar = false,
  className = '',
}) => {
  const isAman = brand === 'aman';
  const primaryColor = isAman ? '#FFB020' : '#D4A857';
  const bgGlow = isAman ? 'rgba(255, 176, 32, 0.25)' : 'rgba(212, 168, 87, 0.25)';
  const letter = isAman ? 'A' : 'N';

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Soft Glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none"
        style={{ backgroundColor: bgGlow }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
      >
        {/* Shield Outer Path */}
        <path
          d="M50 4L8 18V55C8 85 50 111 50 111C50 111 92 85 92 55V18L50 4Z"
          fill={isAman ? '#0B1626' : '#0A2E2C'}
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Tactical Border */}
        <path
          d="M50 14L16 25V54C16 78 50 100 50 100C50 100 84 78 84 54V25L50 14Z"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.65"
        />

        {/* Monogram Letter */}
        <text
          x="50"
          y="68"
          fill={primaryColor}
          fontSize="42"
          fontWeight="700"
          fontFamily="'Barlow Condensed', sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="1"
        >
          {letter}
        </text>

        {/* Tactical Crosshair / Stars */}
        <circle cx="50" cy="24" r="2.5" fill={primaryColor} />
      </svg>

      {/* Rotating Radar Sweep Overlay */}
      {showRadar && (
        <div className="absolute inset-[-4px] rounded-full overflow-hidden pointer-events-none z-20">
          <div
            className="w-full h-full animate-radar origin-center"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${primaryColor} 360deg)`,
              opacity: 0.25,
            }}
          />
        </div>
      )}
    </div>
  );
};
