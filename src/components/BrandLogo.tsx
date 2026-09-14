import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = true }) => {
  return (
    <Link to="/" className="flex items-center gap-3 group select-none" id="brand-logo-link">
      {/* Visual Bag & Monogram Badge */}
      <div
        className={`relative shrink-0 rounded-2xl bg-white border border-yellow-200 shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
          size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
        }`}
      >
        <img
          src="/logo.svg"
          alt="Gopal Bags - Quality You Can Trust"
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Brand Typographic Identity */}
      <div className="flex flex-col">
        <div className="flex items-baseline font-['Outfit',sans-serif] tracking-tight leading-none">
          <span
            className={`font-black text-zinc-950 ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'
            }`}
          >
            GOPAL
          </span>
          <span
            className={`font-black text-amber-500 ml-1.5 ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'
            }`}
          >
            BAGS
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-px w-3 bg-amber-400" />
            <span
              className={`font-bold uppercase tracking-widest text-zinc-500 font-['Plus_Jakarta_Sans',sans-serif] ${
                size === 'sm' ? 'text-[8px]' : 'text-[9px]'
              }`}
            >
              Quality You Can Trust
            </span>
            <span className="h-px w-3 bg-amber-400" />
          </div>
        )}
      </div>
    </Link>
  );
};
