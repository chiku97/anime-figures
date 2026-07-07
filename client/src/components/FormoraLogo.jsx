import React from 'react';

/**
 * FormoraLogo - An adaptive, vector-based SVG logo component.
 * 
 * Props:
 * @param {boolean} compact - If true, renders a slim horizontal version for Navbars.
 * @param {'light' | 'dark' | 'multicolor'} variant - Color variant (light for dark bg, dark for light bg, multicolor for original).
 * @param {string} className - Additional CSS classes.
 * @param {number | string} height - Desired height of the logo container.
 */
const FormoraLogo = ({ 
  compact = false, 
  variant = 'dark', 
  className = '', 
  height = '40px' 
}) => {
  // Set up theme colors based on variant
  const isDark = variant === 'dark';
  const isLight = variant === 'light';
  
  // Icon colors
  const iconStroke = isDark 
    ? 'url(#fGradDark)' 
    : isLight 
      ? 'url(#fGradLight)' 
      : 'url(#fGradOriginal)';
      
  // Text colors
  const primaryText = isDark ? '#1F1F1F' : isLight ? '#FAF9F6' : '#FFFFFF';
  const secondaryText = isDark ? '#A8B8A2' : isLight ? '#A6B39B' : '#A3E635'; // Sage / lime
  const studioText = isDark 
    ? 'url(#studioGradDark)' 
    : isLight 
      ? 'url(#studioGradLight)' 
      : 'url(#studioGradOriginal)';
      
  const taglineText = isDark ? '#8A8A8A' : isLight ? '#F7F4EF' : '#E5E7EB';
  const frameColor = isDark ? '#1F1F1F' : isLight ? '#FAF9F6' : '#FFFFFF';

  if (compact) {
    // Horizontal layout for Navbar
    return (
      <svg 
        viewBox="0 0 260 60" 
        style={{ height }}
        className={`inline-block ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="fGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D2D2D" />
            <stop offset="50%" stopColor="#8A8A8A" />
            <stop offset="100%" stopColor="#1F1F1F" />
          </linearGradient>
          <linearGradient id="fGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#A6B39B" />
          </linearGradient>
          <linearGradient id="fGradOriginal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* STUDIO text gradient */}
          <linearGradient id="studioGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8B8A2" /> {/* Sage */}
            <stop offset="100%" stopColor="#B97A57" /> {/* Clay */}
          </linearGradient>
          <linearGradient id="studioGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A6B39B" /> {/* Sage */}
            <stop offset="100%" stopColor="#D4AF37" /> {/* Gold */}
          </linearGradient>
          <linearGradient id="studioGradOriginal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A7F3D0" /> {/* Emerald */}
            <stop offset="100%" stopColor="#93C5FD" /> {/* Blue */}
          </linearGradient>
        </defs>

        {/* Icon (Stylized F) */}
        <g transform="translate(5, 5) scale(0.28)">
          <path 
            d="M 30,130 C 30,160 60,160 60,130 C 60,105 30,105 30,60 C 30,30 65,30 95,30 C 110,30 115,40 115,50 C 115,65 95,65 75,65 C 60,65 60,85 75,85 C 95,85 105,95 105,110 C 105,130 85,130 60,130"
            fill="none" 
            stroke={iconStroke} 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 30,60 L 30,100"
            fill="none" 
            stroke={iconStroke} 
            strokeWidth="14" 
            strokeLinecap="round" 
          />
        </g>

        {/* Brand Text */}
        <text 
          x="50" 
          y="32" 
          fontFamily="'Outfit', sans-serif" 
          fontSize="22" 
          fontWeight="800" 
          letterSpacing="2.5" 
          fill={primaryText}
        >
          ORMORA
        </text>

        <text 
          x="50" 
          y="48" 
          fontFamily="'Outfit', sans-serif" 
          fontSize="13" 
          fontWeight="700" 
          letterSpacing="1.5" 
          fill={studioText}
        >
          STUDIO
        </text>
      </svg>
    );
  }

  // Full branding block (for Footers, Landing pages, etc.)
  return (
    <svg 
      viewBox="0 0 360 200" 
      style={{ height }}
      className={`block ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="fGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D2D2D" />
          <stop offset="50%" stopColor="#8A8A8A" />
          <stop offset="100%" stopColor="#1F1F1F" />
        </linearGradient>
        <linearGradient id="fGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#A6B39B" />
        </linearGradient>
        <linearGradient id="fGradOriginal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* STUDIO text gradient */}
        <linearGradient id="studioGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8B8A2" />
          <stop offset="100%" stopColor="#B97A57" />
        </linearGradient>
        <linearGradient id="studioGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A6B39B" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="studioGradOriginal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>

      {/* Outer borders mimicking original framing */}
      {/* Top right bracket */}
      <path 
        d="M 110,40 L 330,40 L 330,110" 
        fill="none" 
        stroke={frameColor} 
        strokeWidth="2" 
        strokeOpacity="0.8"
      />
      {/* Bottom left bracket */}
      <path 
        d="M 30,135 L 30,165 L 310,165" 
        fill="none" 
        stroke={frameColor} 
        strokeWidth="2.5" 
        strokeOpacity="0.9"
      />

      <g transform="translate(10, 20)">
        {/* Interlocking F Logo Icon */}
        <g transform="translate(20, 22) scale(0.65)">
          {/* Main F path */}
          <path 
            d="M 30,130 C 30,160 60,160 60,130 C 60,105 30,105 30,60 C 30,30 65,30 95,30 C 110,30 115,40 115,50 C 115,65 95,65 75,65 C 60,65 60,85 75,85 C 95,85 105,95 105,110 C 105,130 85,130 60,130"
            fill="none" 
            stroke={iconStroke} 
            strokeWidth="13" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Inner details to replicate interlocking ribbon feel */}
          <path 
            d="M 30,60 L 30,105"
            fill="none" 
            stroke={iconStroke} 
            strokeWidth="13" 
            strokeLinecap="round" 
          />
        </g>

        {/* ORMORA Text */}
        <text 
          x="105" 
          y="78" 
          fontFamily="'Outfit', sans-serif" 
          fontSize="36" 
          fontWeight="800" 
          letterSpacing="4" 
          fill={primaryText}
        >
          ORMORA
        </text>

        {/* STUDIO Text */}
        <text 
          x="170" 
          y="108" 
          fontFamily="'Outfit', sans-serif" 
          fontSize="22" 
          fontWeight="800" 
          letterSpacing="2.5" 
          fill={studioText}
        >
          STUDIO
        </text>

        {/* Slogan */}
        <text 
          x="35" 
          y="136" 
          fontFamily="'Outfit', sans-serif" 
          fontSize="9.5" 
          fontWeight="500" 
          letterSpacing="4.5" 
          fill={taglineText}
        >
          WHERE VISION FINDS FORM
        </text>
      </g>
    </svg>
  );
};

export default FormoraLogo;
