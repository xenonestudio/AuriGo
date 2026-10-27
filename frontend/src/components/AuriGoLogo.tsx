import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'yellow';
  className?: string;
  size?: number;
}

export const AuriGoLogo: React.FC<LogoProps> = ({ variant = 'dark', className = '', size = 38 }) => {
  const isDarkBg = variant === 'dark';
  const textColorAuri = isDarkBg ? '#FFFFFF' : '#0F172A';
  const textColorGo = isDarkBg ? '#FFB800' : '#D97706';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {/* Isotipo: Pin Andino en Marcha (Pin + Inclinación 15° + Corte Cumbre Tachirense) */}
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="26" fill="#0F172A" />
        {/* Silueta del Pin con ángulo dinámico */}
        <path
          d="M50 18C36 18 26 28 26 42C26 56 46 76 48.5 78.5C49.3 79.3 50.7 79.3 51.5 78.5C54 76 74 56 74 42C74 28 64 18 50 18Z"
          fill="#FFB800"
        />
        {/* Corte angular Cumbre Tachirense y Flecha 15° */}
        <path
          d="M40 44L56 36L48 54L60 48"
          stroke="#0F172A"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="40" r="7" fill="#0F172A" />
      </svg>

      {/* Wordmark CamelCase Obligatorio: Auri (Blanco/Oscuro) + Go (Amarillo/Ámbar) */}
      <div style={{ lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <span style={{ fontSize: size * 0.65, fontWeight: 800, color: textColorAuri, letterSpacing: '-0.5px' }}>
          Auri
        </span>
        <span style={{ fontSize: size * 0.65, fontWeight: 800, color: textColorGo, letterSpacing: '-0.5px' }}>
          Go
        </span>
      </div>
    </div>
  );
};
