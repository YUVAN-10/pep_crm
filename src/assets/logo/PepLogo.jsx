import React from 'react';

export const PepLogoMark = ({ size = 40, className = '' }) => (
  <img
    src="/pep-logo-full.png"
    alt="Pep Software"
    width={size}
    height={size}
    className={`object-contain ${className}`}
    style={{ width: size, height: size }}
  />
);

export const PepLogo = ({ size = 36, showText = true, variant = 'dark', className = '' }) => {
  const isLight = variant === 'light';

  if (!showText) {
    // Icon-only mode: show just the circular logo mark portion
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/pep-logo-full.png"
          alt="Pep Software"
          className="object-contain"
          style={{ height: size, width: 'auto' }}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/pep-logo-full.png"
        alt="Pep Software"
        className={`object-contain ${isLight ? 'brightness-0 invert' : ''}`}
        style={{ height: size, width: 'auto', maxWidth: '180px' }}
      />
    </div>
  );
};

export default PepLogo;
