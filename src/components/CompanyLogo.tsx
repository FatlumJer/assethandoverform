import React from 'react';

interface CompanyLogoProps {
  className?: string;
  variant?: 'blue-on-white' | 'badge-card';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className = '',
  variant = 'blue-on-white',
}) => {
  // Brand blue color from official KiKxxl communication logo
  const brandBlue = '#009fe3';
  const brandDark = '#0284c7';

  if (variant === 'badge-card') {
    return (
      <div
        className={`flex items-center justify-center p-2 rounded-md select-none ${className}`}
        style={{ backgroundColor: brandBlue }}
      >
        <svg
          viewBox="0 0 320 85"
          className="w-full h-auto max-h-14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Emblem: Concentric Target with eT */}
          <g transform="translate(10, 5)">
            {/* Outer Ring */}
            <circle cx="36" cy="36" r="32" stroke="#ffffff" strokeWidth="4.5" />
            {/* Middle Ring */}
            <circle cx="36" cy="36" r="22" stroke="#ffffff" strokeWidth="3.5" />
            {/* Center Filled Circle */}
            <circle cx="36" cy="36" r="13" fill="#ffffff" />
            {/* eT letters in center */}
            <text
              x="36"
              y="40.5"
              fill={brandBlue}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="12.5"
              fontWeight="800"
              textAnchor="middle"
              letterSpacing="-0.5px"
            >
              eT
            </text>
          </g>

          {/* Right Wordmark: KiKXXL */}
          <text
            x="94"
            y="49"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Cabinet Grotesk', sans-serif"
            fontSize="45"
            fontWeight="900"
            letterSpacing="-0.5px"
          >
            KiKXXL
          </text>

          {/* Subtitle: COMMUNICATION */}
          <text
            x="96"
            y="69"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="11"
            fontWeight="600"
            letterSpacing="5.5px"
          >
            COMMUNICATION
          </text>
        </svg>
      </div>
    );
  }

  // Default: Blue on White (Optimized for the Asset Handover Paper Document)
  return (
    <div className={`flex items-center justify-center p-1 select-none ${className}`}>
      <svg
        viewBox="0 0 320 85"
        className="w-full h-auto max-h-14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Emblem: Concentric Target with eT */}
        <g transform="translate(10, 5)">
          {/* Outer Ring */}
          <circle cx="36" cy="36" r="32" stroke={brandBlue} strokeWidth="4.5" />
          {/* Middle Ring */}
          <circle cx="36" cy="36" r="22" stroke={brandBlue} strokeWidth="3.5" />
          {/* Center Filled Circle */}
          <circle cx="36" cy="36" r="13" fill={brandBlue} />
          {/* eT letters in center */}
          <text
            x="36"
            y="40.5"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="12.5"
            fontWeight="800"
            textAnchor="middle"
            letterSpacing="-0.5px"
          >
            eT
          </text>
        </g>

        {/* Right Wordmark: KiKXXL */}
        <text
          x="94"
          y="49"
          fill={brandBlue}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Cabinet Grotesk', sans-serif"
          fontSize="45"
          fontWeight="900"
          letterSpacing="-0.5px"
        >
          KiKXXL
        </text>

        {/* Subtitle: COMMUNICATION */}
        <text
          x="96"
          y="69"
          fill={brandDark}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="5.5px"
        >
          COMMUNICATION
        </text>
      </svg>
    </div>
  );
};
