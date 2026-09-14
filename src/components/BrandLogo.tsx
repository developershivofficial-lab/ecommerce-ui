import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = true }) => {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 group select-none shrink-0" id="brand-logo-link">
      {/* Visual Bag & Monogram Badge */}
      <div
        className={`relative shrink-0 rounded-xl sm:rounded-2xl bg-white border border-yellow-200 shadow-2xs flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
          size === 'sm'
            ? 'w-8 h-8 sm:w-10 sm:h-10'
            : size === 'lg'
            ? 'w-12 h-12 sm:w-16 sm:h-16'
            : 'w-8 h-8 sm:w-11 sm:h-11'
        }`}
      >
        <img
          src="/logo.svg"
          alt="Gopal Bags"
          className="w-full h-full object-contain p-0.5 sm:p-1"
        />
      </div>

      {/* Brand Typographic Identity */}
      <div className="flex flex-col shrink-0">
        <div className="flex items-baseline font-['Outfit',sans-serif] tracking-tight leading-none">
          <span
            className={`font-black text-zinc-950 ${
              size === 'sm'
                ? 'text-base sm:text-lg'
                : size === 'lg'
                ? 'text-2xl sm:text-3xl'
                : 'text-base sm:text-xl md:text-2xl'
            }`}
          >
            GOPAL
          </span>
          <span
            className={`font-black text-amber-500 ml-1 sm:ml-1.5 ${
              size === 'sm'
                ? 'text-base sm:text-lg'
                : size === 'lg'
                ? 'text-2xl sm:text-3xl'
                : 'text-base sm:text-xl md:text-2xl'
            }`}
          >
            BAGS
          </span>
        </div>

        {showTagline && (
          <div className="hidden sm:flex items-center gap-1.5 mt-0.5 sm:mt-1">
            <span className="h-px w-2 sm:w-3 bg-amber-400" />
            <span
              className={`font-bold uppercase tracking-widest text-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] ${
                size === 'sm' ? 'text-[7px] sm:text-[8px]' : 'text-[8px] sm:text-[9px]'
              }`}
            >
              Quality You Can Trust
            </span>
            <span className="h-px w-2 sm:w-3 bg-amber-400" />
          </div>
        )}
      </div>
    </Link>
  );
};
