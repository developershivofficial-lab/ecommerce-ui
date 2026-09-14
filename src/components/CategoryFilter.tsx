import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Star, Check } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { FilterState } from '../types';
import { SortDropdown } from './SortDropdown';

interface CategoryFilterProps {
  filter: FilterState;
  onChangeFilter: (newFilter: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProducts: number;
  filteredCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filter,
  onChangeFilter,
  onResetFilters,
  totalProducts,
  filteredCount
}) => {
  const isFiltered =
    filter.category !== 'All' ||
    filter.minPrice > 0 ||
    filter.maxPrice < 25000 ||
    filter.minRating > 0 ||
    filter.inStockOnly ||
    filter.searchQuery !== '';

  return (
    <div className="bg-white rounded-2xl border border-yellow-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Category Pills Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-500" /> Categories:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = filter.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onChangeFilter({ category: cat })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 shadow-xs'
                    : 'bg-zinc-100 hover:bg-amber-100/60 text-zinc-700 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Count & Reset */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          <span className="text-zinc-500 font-medium">
            Showing <strong className="text-zinc-900 font-bold">{filteredCount}</strong> of {totalProducts} items
          </span>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-bold bg-amber-100/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Secondary Controls: Sort, Price Slider, Rating, In-Stock */}
      <div className="pt-3 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Custom Luxury Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold text-zinc-700 shrink-0">
            Sort by:
          </span>
          <div className="flex-1 min-w-0">
            <SortDropdown
              value={filter.sortBy}
              onChange={(newSort) => onChangeFilter({ sortBy: newSort })}
            />
          </div>
        </div>

        {/* Price Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-zinc-700">Max Price</span>
            <span className="font-bold text-amber-700">₹{filter.maxPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={1500}
            max={25000}
            step={500}
            value={filter.maxPrice}
            onChange={(e) => onChangeFilter({ maxPrice: Number(e.target.value) })}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Rating Filter (4+ Stars) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeFilter({ minRating: filter.minRating === 4 ? 0 : 4 })}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              filter.minRating === 4
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filter.minRating === 4 ? 'fill-amber-500 text-amber-500' : 'text-zinc-400'}`} />
            <span>4.0★ & Above</span>
            {filter.minRating === 4 && <Check className="w-3 h-3 text-amber-700 ml-1" />}
          </button>
        </div>

        {/* In-Stock Toggle */}
        <div className="flex items-center">
          <label className="w-full flex items-center justify-between sm:justify-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 cursor-pointer hover:bg-zinc-100 transition-colors">
            <span className="text-xs font-semibold text-zinc-700">In-Stock Only</span>
            <input
              type="checkbox"
              checked={filter.inStockOnly}
              onChange={(e) => onChangeFilter({ inStockOnly: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
