import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Percent,
  ChevronDown,
  Check
} from 'lucide-react';
import { FilterState } from '../types';

interface SortOption {
  value: FilterState['sortBy'];
  label: string;
  icon: React.ReactNode;
  hint?: string;
}

const SORT_OPTIONS: SortOption[] = [
  {
    value: 'featured',
    label: 'Featured & Trending',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
    hint: 'Handpicked curation'
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
    icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />,
    hint: 'Budget friendly first'
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
    icon: <ArrowDownRight className="w-3.5 h-3.5 text-indigo-600" />,
    hint: 'Luxury & signature first'
  },
  {
    value: 'rating',
    label: 'Highest Rated (★ 4.8+)',
    icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
    hint: 'Customer favorites'
  },
  {
    value: 'discount',
    label: 'Biggest Discount %',
    icon: <Percent className="w-3.5 h-3.5 text-red-500" />,
    hint: 'Best festive savings'
  }
];

interface SortDropdownProps {
  value: FilterState['sortBy'];
  onChange: (value: FilterState['sortBy']) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  // Close when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        id="custom-sort-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-2xl bg-white border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
          isOpen
            ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md bg-amber-50/20'
            : 'border-yellow-200 hover:border-amber-400 hover:bg-amber-50/30'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="shrink-0">{selectedOption.icon}</span>
          <span className="text-zinc-900 font-bold truncate font-['Outfit',sans-serif]">
            {selectedOption.label}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-600' : ''
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            aria-activedescendant={selectedOption.value}
            className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border border-yellow-200/90 shadow-xl overflow-hidden py-1.5 backdrop-blur-md"
          >
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700/80 border-b border-yellow-100 flex items-center justify-between">
              <span>Sort Bags By</span>
              <span className="text-zinc-400 font-normal">Select priority</span>
            </div>

            <div className="py-1 space-y-0.5">
              {SORT_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between gap-2 text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 font-bold text-zinc-950 border-l-2 border-amber-500'
                        : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 p-1 rounded-lg bg-zinc-50 border border-zinc-200/60">
                        {option.icon}
                      </span>
                      <div className="truncate">
                        <div className="font-semibold truncate leading-tight">
                          {option.label}
                        </div>
                        {option.hint && (
                          <div className="text-[10px] text-zinc-400 font-normal truncate">
                            {option.hint}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
